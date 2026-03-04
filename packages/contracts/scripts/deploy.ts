import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy KYCRegistry
  const KYCRegistry = await ethers.getContractFactory("KYCRegistry");
  const kycRegistry = await KYCRegistry.deploy();
  await kycRegistry.waitForDeployment();
  const kycRegistryAddress = await kycRegistry.getAddress();
  console.log("KYCRegistry deployed to:", kycRegistryAddress);

  // Deploy PropertyRegistry
  const PropertyRegistry = await ethers.getContractFactory("PropertyRegistry");
  const propertyRegistry = await PropertyRegistry.deploy();
  await propertyRegistry.waitForDeployment();
  const propertyRegistryAddress = await propertyRegistry.getAddress();
  console.log("PropertyRegistry deployed to:", propertyRegistryAddress);

  // Deploy PixelEstate
  const PixelEstate = await ethers.getContractFactory("PixelEstate");
  const pixelEstate = await PixelEstate.deploy("https://api.pixelestate.com/metadata/");
  await pixelEstate.waitForDeployment();
  const pixelEstateAddress = await pixelEstate.getAddress();
  console.log("PixelEstate deployed to:", pixelEstateAddress);

  // Deploy MockERC20 for testing/local (USDC)
  const MockERC20 = await ethers.getContractFactory("MockERC20");
  const usdc = await MockERC20.deploy("Mock USDC", "USDC");
  await usdc.waitForDeployment();
  const usdcAddress = await usdc.getAddress();
  console.log("Mock USDC deployed to:", usdcAddress);

  // Deploy RentalDistributor
  const RentalDistributor = await ethers.getContractFactory("RentalDistributor");
  const rentalDistributor = await RentalDistributor.deploy(
    pixelEstateAddress,
    kycRegistryAddress,
    usdcAddress
  );
  await rentalDistributor.waitForDeployment();
  const rentalDistributorAddress = await rentalDistributor.getAddress();
  console.log("RentalDistributor deployed to:", rentalDistributorAddress);

  // Deploy Marketplace
  const treasuryAddress = deployer.address; // For testing, use deployer as treasury
  const Marketplace = await ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy(
    pixelEstateAddress,
    kycRegistryAddress,
    usdcAddress,
    treasuryAddress
  );
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  console.log("Marketplace deployed to:", marketplaceAddress);

  // Deploy SaleVoting
  const SaleVoting = await ethers.getContractFactory("SaleVoting");
  const saleVoting = await SaleVoting.deploy(
    pixelEstateAddress,
    kycRegistryAddress
  );
  await saleVoting.waitForDeployment();
  const saleVotingAddress = await saleVoting.getAddress();
  console.log("SaleVoting deployed to:", saleVotingAddress);

  // Setup roles
  console.log("Setting up roles...");
  await kycRegistry.grantRole(await kycRegistry.KYC_ADMIN_ROLE(), deployer.address);
  await propertyRegistry.grantRole(await propertyRegistry.REGISTRY_ADMIN_ROLE(), deployer.address);
  await pixelEstate.grantRole(await pixelEstate.ADMIN_ROLE(), deployer.address);
  await pixelEstate.grantRole(await pixelEstate.MINTER_ROLE(), deployer.address);
  await rentalDistributor.grantRole(await rentalDistributor.ADMIN_ROLE(), deployer.address);
  await marketplace.grantRole(await marketplace.ADMIN_ROLE(), deployer.address);
  await saleVoting.grantRole(await saleVoting.ADMIN_ROLE(), deployer.address);

  // Save addresses to a file
  const addresses = {
    KYCRegistry: kycRegistryAddress,
    PropertyRegistry: propertyRegistryAddress,
    PixelEstate: pixelEstateAddress,
    USDC: usdcAddress,
    RentalDistributor: rentalDistributorAddress,
    Marketplace: marketplaceAddress,
    SaleVoting: saleVotingAddress,
  };

  const addressesPath = path.join(__dirname, "../../shared/contract-addresses.json");
  fs.writeFileSync(addressesPath, JSON.stringify(addresses, null, 2));
  console.log(`Addresses saved to ${addressesPath}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
