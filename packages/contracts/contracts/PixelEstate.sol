// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract PixelEstate is ERC1155, AccessControl, Pausable {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    // Mapping from propertyId to total pixels
    mapping(uint256 => uint256) public propertyPixelCount;

    // Mapping from propertyId to minted pixels
    mapping(uint256 => uint256) public propertyMintedPixels;

    // Mapping from tokenId to owner (for single pixel tracking, though ERC1155 handles balances)
    // tokenId = (propertyId << 128) | pixelIndex
    
    event PixelsMinted(uint256 indexed propertyId, address indexed buyer, uint256[] pixelIndexes);
    event PropertyAdded(uint256 indexed propertyId, uint256 totalPixels);

    constructor(string memory uri_) ERC1155(uri_) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    function addProperty(uint256 propertyId, uint256 totalPixels) external onlyRole(ADMIN_ROLE) {
        require(propertyPixelCount[propertyId] == 0, "Property already exists");
        propertyPixelCount[propertyId] = totalPixels;
        emit PropertyAdded(propertyId, totalPixels);
    }

    function mintPixels(uint256 propertyId, uint256[] calldata pixelIndexes, address buyer) external onlyRole(MINTER_ROLE) whenNotPaused {
        require(propertyPixelCount[propertyId] > 0, "Property does not exist");
        
        uint256[] memory tokenIds = new uint256[](pixelIndexes.length);
        uint256[] memory amounts = new uint256[](pixelIndexes.length);

        for (uint256 i = 0; i < pixelIndexes.length; i++) {
            require(pixelIndexes[i] < propertyPixelCount[propertyId], "Invalid pixel index");
            uint256 tokenId = getTokenId(propertyId, pixelIndexes[i]);
            tokenIds[i] = tokenId;
            amounts[i] = 1; // Each pixel is unique, so amount is 1
        }

        _mintBatch(buyer, tokenIds, amounts, "");
        propertyMintedPixels[propertyId] += pixelIndexes.length;
        
        emit PixelsMinted(propertyId, buyer, pixelIndexes);
    }

    function getTokenId(uint256 propertyId, uint256 pixelIndex) public pure returns (uint256) {
        return (propertyId << 128) | pixelIndex;
    }

    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }

    // Override required by Solidity
    function supportsInterface(bytes4 interfaceId) public view override(ERC1155, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
