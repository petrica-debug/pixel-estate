import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { PixelEstate, KYCRegistry, SaleVoting } from "../typechain-types";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("SaleVoting", function () {
  let pixelEstate: PixelEstate;
  let kycRegistry: KYCRegistry;
  let saleVoting: SaleVoting;
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

    // Deploy PixelEstate
    const PixelEstateFactory = await ethers.getContractFactory("PixelEstate");
    pixelEstate = await PixelEstateFactory.deploy("https://api.pixelestate.com/metadata/");
    await pixelEstate.waitForDeployment();

    // Deploy SaleVoting
    const SaleVotingFactory = await ethers.getContractFactory("SaleVoting");
    saleVoting = await SaleVotingFactory.deploy(
      await pixelEstate.getAddress(),
      await kycRegistry.getAddress()
    );
    await saleVoting.waitForDeployment();

    // Setup roles
    await kycRegistry.grantRole(await kycRegistry.KYC_ADMIN_ROLE(), admin.address);
    await pixelEstate.grantRole(await pixelEstate.ADMIN_ROLE(), admin.address);
    await pixelEstate.grantRole(await pixelEstate.MINTER_ROLE(), admin.address);
    await saleVoting.grantRole(await saleVoting.ADMIN_ROLE(), admin.address);

    // Approve KYC
    await kycRegistry.connect(admin).setKYCStatus(user1.address, true);
    await kycRegistry.connect(admin).setKYCStatus(user2.address, true);

    // Setup property and mint pixels
    // Total 100 pixels. User1 gets 70, User2 gets 30.
    const propertyId = 1;
    await pixelEstate.connect(admin).addProperty(propertyId, 100);
    
    const user1Pixels = Array.from({length: 70}, (_, i) => i);
    const user2Pixels = Array.from({length: 30}, (_, i) => i + 70);
    
    await pixelEstate.connect(admin).mintPixels(propertyId, user1Pixels, user1.address);
    await pixelEstate.connect(admin).mintPixels(propertyId, user2Pixels, user2.address);
  });

  it("Should create a proposal", async function () {
    const propertyId = 1;
    const proposedPrice = ethers.parseEther("1000000");

    await expect(saleVoting.connect(user1).createProposal(propertyId, proposedPrice))
      .to.emit(saleVoting, "ProposalCreated");

    const proposal = await saleVoting.proposals(propertyId);
    expect(proposal.proposedPrice).to.equal(proposedPrice);
    expect(proposal.active).to.be.true;
  });

  it("Should vote and execute proposal if quorum reached", async function () {
    const propertyId = 1;
    const proposedPrice = ethers.parseEther("1000000");

    await saleVoting.connect(user1).createProposal(propertyId, proposedPrice);

    // User1 votes yes (owns 70%, quorum is 66%)
    await expect(saleVoting.connect(user1).vote(propertyId, true))
      .to.emit(saleVoting, "VoteCast")
      .withArgs(propertyId, user1.address, true, 70);

    // Fast forward time
    await time.increase(30 * 24 * 60 * 60 + 1);

    await expect(saleVoting.connect(user1).executeProposal(propertyId))
      .to.emit(saleVoting, "ProposalExecuted")
      .withArgs(propertyId, proposedPrice);

    const proposal = await saleVoting.proposals(propertyId);
    expect(proposal.active).to.be.false;
    expect(proposal.executed).to.be.true;
  });

  it("Should fail to execute if quorum not reached", async function () {
    const propertyId = 1;
    const proposedPrice = ethers.parseEther("1000000");

    await saleVoting.connect(user2).createProposal(propertyId, proposedPrice);

    // User2 votes yes (owns 30%, quorum is 66%)
    await saleVoting.connect(user2).vote(propertyId, true);

    // Fast forward time
    await time.increase(30 * 24 * 60 * 60 + 1);

    // The contract logic says if quorum is not reached, it emits ProposalCancelled instead of reverting.
    await expect(saleVoting.connect(user1).executeProposal(propertyId))
      .to.emit(saleVoting, "ProposalCancelled")
      .withArgs(propertyId);
      
    const proposal = await saleVoting.proposals(propertyId);
    expect(proposal.active).to.be.false;
    expect(proposal.executed).to.be.false;
  });
});
