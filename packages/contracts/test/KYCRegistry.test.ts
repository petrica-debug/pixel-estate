import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { KYCRegistry } from "../typechain-types";

describe("KYCRegistry", function () {
  let kycRegistry: KYCRegistry;
  let owner: SignerWithAddress;
  let admin: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;

  beforeEach(async function () {
    [owner, admin, user1, user2] = await ethers.getSigners();

    const KYCRegistryFactory = await ethers.getContractFactory("KYCRegistry");
    kycRegistry = await KYCRegistryFactory.deploy();
    await kycRegistry.waitForDeployment();

    await kycRegistry.grantRole(await kycRegistry.KYC_ADMIN_ROLE(), admin.address);
  });

  it("Should set KYC status for a user", async function () {
    await kycRegistry.connect(admin).setKYCStatus(user1.address, true);
    expect(await kycRegistry.isKYCApproved(user1.address)).to.be.true;

    await kycRegistry.connect(admin).setKYCStatus(user1.address, false);
    expect(await kycRegistry.isKYCApproved(user1.address)).to.be.false;
  });

  it("Should batch set KYC status", async function () {
    await kycRegistry.connect(admin).batchSetKYC(
      [user1.address, user2.address],
      [true, true]
    );

    expect(await kycRegistry.isKYCApproved(user1.address)).to.be.true;
    expect(await kycRegistry.isKYCApproved(user2.address)).to.be.true;
  });

  it("Should not allow non-admin to set KYC status", async function () {
    await expect(
      kycRegistry.connect(user1).setKYCStatus(user2.address, true)
    ).to.be.revertedWithCustomError(kycRegistry, "AccessControlUnauthorizedAccount");
  });
});
