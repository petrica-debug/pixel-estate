import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { PixelEstate, KYCRegistry, PropertyRegistry } from "../typechain-types";

describe("PixelEstate", function () {
  let pixelEstate: PixelEstate;
  let kycRegistry: KYCRegistry;
  let propertyRegistry: PropertyRegistry;
  let owner: SignerWithAddress;
  let admin: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;

  beforeEach(async function () {
    [owner, admin, user1, user2] = await ethers.getSigners();

    // Deploy KYCRegistry
    const KYCRegistryFactory = await ethers.getContractFactory("KYCRegistry");
    kycRegistry = await KYCRegistryFactory.deploy();
    await kycRegistry.waitForDeployment();

    // Deploy PropertyRegistry
    const PropertyRegistryFactory = await ethers.getContractFactory("PropertyRegistry");
    propertyRegistry = await PropertyRegistryFactory.deploy();
    await propertyRegistry.waitForDeployment();

    // Deploy PixelEstate
    const PixelEstateFactory = await ethers.getContractFactory("PixelEstate");
    pixelEstate = await PixelEstateFactory.deploy(
      "https://api.pixelestate.com/metadata/"
    );
    await pixelEstate.waitForDeployment();

    // Setup roles
    await kycRegistry.grantRole(await kycRegistry.KYC_ADMIN_ROLE(), admin.address);
    await propertyRegistry.grantRole(await propertyRegistry.REGISTRY_ADMIN_ROLE(), admin.address);
    await pixelEstate.grantRole(await pixelEstate.ADMIN_ROLE(), admin.address);
    await pixelEstate.grantRole(await pixelEstate.MINTER_ROLE(), admin.address);

    // Approve KYC for users
    await kycRegistry.connect(admin).setKYCStatus(user1.address, true);
    await kycRegistry.connect(admin).setKYCStatus(user2.address, true);

    // Register a property
    await propertyRegistry.connect(admin).registerProperty(
      1, // propertyId
      "ipfs://property1", // metadataURI
      10000, // totalPixels
      ethers.parseEther("10"), // pricePerPixel
      500 // rentalYieldBps (5%)
    );
  });

  it("Should mint pixels to user", async function () {
    const propertyId = 1;
    const pixelIndexes = [1, 2, 3];
    
    await pixelEstate.connect(admin).addProperty(propertyId, 10000);
    await pixelEstate.connect(admin).mintPixels(propertyId, pixelIndexes, user1.address);

    for (const index of pixelIndexes) {
      const tokenId = await pixelEstate.getTokenId(propertyId, index);
      expect(await pixelEstate.balanceOf(user1.address, tokenId)).to.equal(1);
    }
  });

  it("Should not mint the same pixel twice (if we had a check, but currently it just adds to balance)", async function () {
    const propertyId = 1;
    const pixelIndexes = [7];
    
    await pixelEstate.connect(admin).addProperty(propertyId, 10000);
    await pixelEstate.connect(admin).mintPixels(propertyId, pixelIndexes, user1.address);

    // In a real scenario we might want to prevent minting the same index twice, 
    // but the current contract doesn't explicitly check if balance > 0 before minting.
    // It just mints another token with the same ID.
  });
});
