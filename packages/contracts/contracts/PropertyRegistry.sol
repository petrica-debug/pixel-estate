// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract PropertyRegistry is AccessControl {
    bytes32 public constant REGISTRY_ADMIN_ROLE = keccak256("REGISTRY_ADMIN_ROLE");

    enum PropertyStatus { UPCOMING, ACTIVE, PAUSED, SOLD }

    struct PropertyInfo {
        string metadataURI;
        uint256 totalPixels;
        uint256 mintedPixels;
        uint256 pricePerPixel; // in USDC (6 decimals)
        uint256 rentalYieldBps; // basis points (e.g., 500 = 5%)
        PropertyStatus status;
        uint256 createdAt;
    }

    mapping(uint256 => PropertyInfo) public properties;

    event PropertyRegistered(uint256 indexed propertyId, uint256 totalPixels, uint256 pricePerPixel);
    event MetadataUpdated(uint256 indexed propertyId, string metadataURI);
    event StatusUpdated(uint256 indexed propertyId, PropertyStatus status);
    event PixelsMinted(uint256 indexed propertyId, uint256 count);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(REGISTRY_ADMIN_ROLE, msg.sender);
    }

    function registerProperty(
        uint256 propertyId,
        string calldata metadataURI,
        uint256 totalPixels,
        uint256 pricePerPixel,
        uint256 rentalYieldBps
    ) external onlyRole(REGISTRY_ADMIN_ROLE) {
        require(properties[propertyId].createdAt == 0, "Property already exists");
        require(totalPixels > 0, "Total pixels must be > 0");

        properties[propertyId] = PropertyInfo({
            metadataURI: metadataURI,
            totalPixels: totalPixels,
            mintedPixels: 0,
            pricePerPixel: pricePerPixel,
            rentalYieldBps: rentalYieldBps,
            status: PropertyStatus.UPCOMING,
            createdAt: block.timestamp
        });

        emit PropertyRegistered(propertyId, totalPixels, pricePerPixel);
    }

    function updateMetadata(uint256 propertyId, string calldata metadataURI) external onlyRole(REGISTRY_ADMIN_ROLE) {
        require(properties[propertyId].createdAt > 0, "Property does not exist");
        properties[propertyId].metadataURI = metadataURI;
        emit MetadataUpdated(propertyId, metadataURI);
    }

    function setPropertyStatus(uint256 propertyId, PropertyStatus status) external onlyRole(REGISTRY_ADMIN_ROLE) {
        require(properties[propertyId].createdAt > 0, "Property does not exist");
        properties[propertyId].status = status;
        emit StatusUpdated(propertyId, status);
    }

    // Called by PixelEstate or Minter when new pixels are minted to keep registry in sync
    function incrementMintedPixels(uint256 propertyId, uint256 count) external onlyRole(REGISTRY_ADMIN_ROLE) {
        require(properties[propertyId].createdAt > 0, "Property does not exist");
        require(properties[propertyId].mintedPixels + count <= properties[propertyId].totalPixels, "Exceeds total pixels");
        
        properties[propertyId].mintedPixels += count;
        emit PixelsMinted(propertyId, count);
    }

    function getProperty(uint256 propertyId) external view returns (PropertyInfo memory) {
        require(properties[propertyId].createdAt > 0, "Property does not exist");
        return properties[propertyId];
    }
}
