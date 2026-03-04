import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { PixelEstate, KYCRegistry, Marketplace, MockERC20 } from "../typechain-types";

describe("Marketplace", function () {
  let pixelEstate: PixelEstate;
  let kycRegistry: KYCRegistry;
  let marketplace: Marketplace;
  let mockToken: MockERC20;
  let owner: SignerWithAddress;
  let admin: SignerWithAddress;
  let seller: SignerWithAddress;
  let buyer: SignerWithAddress;
  let treasury: SignerWithAddress;

  beforeEach(async function () {
    [owner, admin, seller, buyer, treasury] = await ethers.getSigners();

    // Deploy MockERC20
    const MockERC20Factory = await ethers.getContractFactory("MockERC20");
    mockToken = await MockERC20Factory.deploy("Mock USDC", "USDC");
    await mockToken.waitForDeployment();

    // Deploy KYCRegistry
    const KYCRegistryFactory = await ethers.getContractFactory("KYCRegistry");
    kycRegistry = await KYCRegistryFactory.deploy();
    await kycRegistry.waitForDeployment();

    // Deploy PixelEstate
    const PixelEstateFactory = await ethers.getContractFactory("PixelEstate");
    pixelEstate = await PixelEstateFactory.deploy("https://api.pixelestate.com/metadata/");
    await pixelEstate.waitForDeployment();

    // Deploy Marketplace
    const MarketplaceFactory = await ethers.getContractFactory("Marketplace");
    marketplace = await MarketplaceFactory.deploy(
      await pixelEstate.getAddress(),
      await kycRegistry.getAddress(),
      await mockToken.getAddress(),
      treasury.address
    );
    await marketplace.waitForDeployment();

    // Setup roles
    await kycRegistry.grantRole(await kycRegistry.KYC_ADMIN_ROLE(), admin.address);
    await pixelEstate.grantRole(await pixelEstate.ADMIN_ROLE(), admin.address);
    await pixelEstate.grantRole(await pixelEstate.MINTER_ROLE(), admin.address);

    // Approve KYC
    await kycRegistry.connect(admin).setKYCStatus(seller.address, true);
    await kycRegistry.connect(admin).setKYCStatus(buyer.address, true);

    // Setup property and mint pixels to seller
    const propertyId = 1;
    await pixelEstate.connect(admin).addProperty(propertyId, 100);
    await pixelEstate.connect(admin).mintPixels(propertyId, [1, 2, 3], seller.address);

    // Approve marketplace to transfer seller's pixels
    await pixelEstate.connect(seller).setApprovalForAll(await marketplace.getAddress(), true);

    // Mint mock tokens to buyer and approve marketplace
    await mockToken.mint(buyer.address, ethers.parseEther("1000"));
    await mockToken.connect(buyer).approve(await marketplace.getAddress(), ethers.parseEther("1000"));
  });

  it("Should list pixels", async function () {
    const propertyId = 1;
    const pixelIndexes = [1, 2];
    const pricePerPixel = ethers.parseEther("10");

    await expect(marketplace.connect(seller).listPixels(propertyId, pixelIndexes, pricePerPixel))
      .to.emit(marketplace, "Listed")
      .withArgs(0, seller.address, propertyId, 2, pricePerPixel);

    const listing = await marketplace.listings(0);
    expect(listing.seller).to.equal(seller.address);
    expect(listing.pricePerPixel).to.equal(pricePerPixel);
    expect(listing.remaining).to.equal(2);
    expect(listing.active).to.be.true;
  });

  it("Should buy pixels", async function () {
    const propertyId = 1;
    const pixelIndexes = [1, 2];
    const pricePerPixel = ethers.parseEther("10");

    await marketplace.connect(seller).listPixels(propertyId, pixelIndexes, pricePerPixel);

    const initialBuyerBalance = await mockToken.balanceOf(buyer.address);
    const initialSellerBalance = await mockToken.balanceOf(seller.address);
    const initialTreasuryBalance = await mockToken.balanceOf(treasury.address);

    await expect(marketplace.connect(buyer).buyListing(0, 2))
      .to.emit(marketplace, "Sold")
      .withArgs(0, buyer.address, 2, ethers.parseEther("20"));

    const finalBuyerBalance = await mockToken.balanceOf(buyer.address);
    const finalSellerBalance = await mockToken.balanceOf(seller.address);
    const finalTreasuryBalance = await mockToken.balanceOf(treasury.address);

    expect(initialBuyerBalance - finalBuyerBalance).to.equal(ethers.parseEther("20"));
    
    // Fee is 2% of 20 = 0.4
    expect(finalTreasuryBalance - initialTreasuryBalance).to.equal(ethers.parseEther("0.4"));
    expect(finalSellerBalance - initialSellerBalance).to.equal(ethers.parseEther("19.6"));

    // Check pixel ownership
    const tokenId1 = await pixelEstate.getTokenId(propertyId, 1);
    const tokenId2 = await pixelEstate.getTokenId(propertyId, 2);
    expect(await pixelEstate.balanceOf(buyer.address, tokenId1)).to.equal(1);
    expect(await pixelEstate.balanceOf(buyer.address, tokenId2)).to.equal(1);
  });

  it("Should cancel listing", async function () {
    const propertyId = 1;
    const pixelIndexes = [1, 2];
    const pricePerPixel = ethers.parseEther("10");

    await marketplace.connect(seller).listPixels(propertyId, pixelIndexes, pricePerPixel);

    await expect(marketplace.connect(seller).cancelListing(0))
      .to.emit(marketplace, "Cancelled")
      .withArgs(0);

    const listing = await marketplace.listings(0);
    expect(listing.active).to.be.false;

    // Check pixels returned to seller
    const tokenId1 = await pixelEstate.getTokenId(propertyId, 1);
    const tokenId2 = await pixelEstate.getTokenId(propertyId, 2);
    expect(await pixelEstate.balanceOf(seller.address, tokenId1)).to.equal(1);
    expect(await pixelEstate.balanceOf(seller.address, tokenId2)).to.equal(1);
  });
});
