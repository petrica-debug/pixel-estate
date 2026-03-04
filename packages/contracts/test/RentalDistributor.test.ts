import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { PixelEstate, KYCRegistry, RentalDistributor, MockERC20 } from "../typechain-types";

describe("RentalDistributor", function () {
  let pixelEstate: PixelEstate;
  let kycRegistry: KYCRegistry;
  let rentalDistributor: RentalDistributor;
  let mockToken: MockERC20;
  let owner: SignerWithAddress;
  let admin: SignerWithAddress;
  let user1: SignerWithAddress;

  beforeEach(async function () {
    [owner, admin, user1] = await ethers.getSigners();

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

    // Deploy RentalDistributor
    const RentalDistributorFactory = await ethers.getContractFactory("RentalDistributor");
    rentalDistributor = await RentalDistributorFactory.deploy(
      await pixelEstate.getAddress(),
      await kycRegistry.getAddress(),
      await mockToken.getAddress()
    );
    await rentalDistributor.waitForDeployment();

    // Setup roles
    await kycRegistry.grantRole(await kycRegistry.KYC_ADMIN_ROLE(), admin.address);
    await pixelEstate.grantRole(await pixelEstate.ADMIN_ROLE(), admin.address);
    await pixelEstate.grantRole(await pixelEstate.MINTER_ROLE(), admin.address);
    await rentalDistributor.grantRole(await rentalDistributor.ADMIN_ROLE(), admin.address);

    // Approve KYC
    await kycRegistry.connect(admin).setKYCStatus(user1.address, true);

    // Setup property and mint pixels
    const propertyId = 1;
    await pixelEstate.connect(admin).addProperty(propertyId, 100);
    await pixelEstate.connect(admin).mintPixels(propertyId, [1, 2, 3], user1.address);

    // Mint mock tokens to admin and approve distributor
    await mockToken.mint(admin.address, ethers.parseEther("1000"));
    await mockToken.connect(admin).approve(await rentalDistributor.getAddress(), ethers.parseEther("1000"));
  });

  it("Should deposit rental", async function () {
    const propertyId = 1;
    const amount = ethers.parseEther("100");

    await rentalDistributor.connect(admin).depositRental(propertyId, amount);

    const pending = await rentalDistributor.pendingRental(propertyId, user1.address);
    // User owns 3 out of 100 pixels, so they should get 3% of 100 = 3 tokens
    expect(pending).to.equal(ethers.parseEther("3"));
  });

  it("Should claim rental", async function () {
    const propertyId = 1;
    const amount = ethers.parseEther("100");

    await rentalDistributor.connect(admin).depositRental(propertyId, amount);

    const initialBalance = await mockToken.balanceOf(user1.address);
    await rentalDistributor.connect(user1).claimAllRental(propertyId);
    const finalBalance = await mockToken.balanceOf(user1.address);

    expect(finalBalance - initialBalance).to.equal(ethers.parseEther("3"));
  });
});
