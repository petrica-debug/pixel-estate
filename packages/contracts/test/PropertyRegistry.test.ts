import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { PropertyRegistry } from "../typechain-types";

describe("PropertyRegistry", function () {
  let propertyRegistry: PropertyRegistry;
  let owner: SignerWithAddress;
  let admin: SignerWithAddress;
  let user1: SignerWithAddress;

  beforeEach(async function () {
    [owner, admin, user1] = await ethers.getSigners();

    const PropertyRegistryFactory = await ethers.getContractFactory("PropertyRegistry");
    propertyRegistry = await PropertyRegistryFactory.deploy();
    await propertyRegistry.waitForDeployment();

    await propertyRegistry.grantRole(await propertyRegistry.REGISTRY_ADMIN_ROLE(), admin.address);
  });

  it("Should register a property", async function () {
    const propertyId = 1;
    const metadataURI = "ipfs://property1";
    const totalPixels = 10000;
    const pricePerPixel = ethers.parseEther("10");
    const rentalYieldBps = 500;

    await propertyRegistry.connect(admin).registerProperty(
      propertyId,
      metadataURI,
      totalPixels,
      pricePerPixel,
      rentalYieldBps
    );

    const property = await propertyRegistry.getProperty(propertyId);
    expect(property.metadataURI).to.equal(metadataURI);
    expect(property.totalPixels).to.equal(totalPixels);
    expect(property.pricePerPixel).to.equal(pricePerPixel);
    expect(property.rentalYieldBps).to.equal(rentalYieldBps);
    expect(property.status).to.equal(0); // UPCOMING
  });

  it("Should update metadata", async function () {
    const propertyId = 1;
    await propertyRegistry.connect(admin).registerProperty(
      propertyId,
      "ipfs://property1",
      10000,
      ethers.parseEther("10"),
      500
    );

    const newMetadataURI = "ipfs://property1-updated";
    await propertyRegistry.connect(admin).updateMetadata(propertyId, newMetadataURI);

    const property = await propertyRegistry.getProperty(propertyId);
    expect(property.metadataURI).to.equal(newMetadataURI);
  });

  it("Should update property status", async function () {
    const propertyId = 1;
    await propertyRegistry.connect(admin).registerProperty(
      propertyId,
      "ipfs://property1",
      10000,
      ethers.parseEther("10"),
      500
    );

    await propertyRegistry.connect(admin).setPropertyStatus(propertyId, 1); // ACTIVE

    const property = await propertyRegistry.getProperty(propertyId);
    expect(property.status).to.equal(1);
  });
});
