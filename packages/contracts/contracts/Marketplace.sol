// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./PixelEstate.sol";
import "./KYCRegistry.sol";

contract Marketplace is AccessControl, ReentrancyGuard, ERC1155Holder {
    using SafeERC20 for IERC20;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    PixelEstate public pixelEstate;
    KYCRegistry public kycRegistry;
    IERC20 public paymentToken; // USDC
    
    address public treasuryAddress;
    uint256 public platformFeeBps = 200; // 2%

    struct Listing {
        uint256 listingId;
        address seller;
        uint256 propertyId;
        uint256[] pixelIndexes;
        uint256 pricePerPixel;
        uint256 remaining;
        bool active;
    }

    uint256 public nextListingId;
    mapping(uint256 => Listing) public listings;

    event Listed(uint256 indexed listingId, address indexed seller, uint256 indexed propertyId, uint256 pixelCount, uint256 pricePerPixel);
    event Sold(uint256 indexed listingId, address indexed buyer, uint256 pixelCount, uint256 totalPrice);
    event Cancelled(uint256 indexed listingId);
    event PlatformFeeUpdated(uint256 newFeeBps);
    event TreasuryUpdated(address newTreasury);

    constructor(address _pixelEstate, address _kycRegistry, address _paymentToken, address _treasuryAddress) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        
        pixelEstate = PixelEstate(_pixelEstate);
        kycRegistry = KYCRegistry(_kycRegistry);
        paymentToken = IERC20(_paymentToken);
        treasuryAddress = _treasuryAddress;
    }

    function setPlatformFee(uint256 _feeBps) external onlyRole(ADMIN_ROLE) {
        require(_feeBps <= 1000, "Fee too high"); // Max 10%
        platformFeeBps = _feeBps;
        emit PlatformFeeUpdated(_feeBps);
    }

    function setTreasury(address _treasury) external onlyRole(ADMIN_ROLE) {
        require(_treasury != address(0), "Invalid address");
        treasuryAddress = _treasury;
        emit TreasuryUpdated(_treasury);
    }

    function listPixels(uint256 propertyId, uint256[] calldata pixelIndexes, uint256 pricePerPixel) external nonReentrant {
        require(kycRegistry.isKYCApproved(msg.sender), "KYC not approved");
        require(pixelIndexes.length > 0, "No pixels provided");
        require(pricePerPixel > 0, "Price must be > 0");

        // Transfer pixels to marketplace contract
        uint256[] memory tokenIds = new uint256[](pixelIndexes.length);
        uint256[] memory amounts = new uint256[](pixelIndexes.length);
        
        for (uint256 i = 0; i < pixelIndexes.length; i++) {
            tokenIds[i] = pixelEstate.getTokenId(propertyId, pixelIndexes[i]);
            amounts[i] = 1;
        }

        pixelEstate.safeBatchTransferFrom(msg.sender, address(this), tokenIds, amounts, "");

        uint256 listingId = nextListingId++;
        listings[listingId] = Listing({
            listingId: listingId,
            seller: msg.sender,
            propertyId: propertyId,
            pixelIndexes: pixelIndexes,
            pricePerPixel: pricePerPixel,
            remaining: pixelIndexes.length,
            active: true
        });

        emit Listed(listingId, msg.sender, propertyId, pixelIndexes.length, pricePerPixel);
    }

    function cancelListing(uint256 listingId) external nonReentrant {
        Listing storage listing = listings[listingId];
        require(listing.active, "Listing not active");
        require(listing.seller == msg.sender || hasRole(ADMIN_ROLE, msg.sender), "Not seller or admin");

        listing.active = false;

        // Return remaining pixels
        if (listing.remaining > 0) {
            uint256[] memory tokenIds = new uint256[](listing.remaining);
            uint256[] memory amounts = new uint256[](listing.remaining);
            
            uint256 returnIndex = 0;
            for (uint256 i = 0; i < listing.pixelIndexes.length; i++) {
                uint256 tokenId = pixelEstate.getTokenId(listing.propertyId, listing.pixelIndexes[i]);
                if (pixelEstate.balanceOf(address(this), tokenId) > 0) {
                    tokenIds[returnIndex] = tokenId;
                    amounts[returnIndex] = 1;
                    returnIndex++;
                }
            }

            pixelEstate.safeBatchTransferFrom(address(this), listing.seller, tokenIds, amounts, "");
        }

        emit Cancelled(listingId);
    }

    function buyListing(uint256 listingId, uint256 pixelCount) external nonReentrant {
        require(kycRegistry.isKYCApproved(msg.sender), "KYC not approved");
        Listing storage listing = listings[listingId];
        require(listing.active, "Listing not active");
        require(pixelCount > 0 && pixelCount <= listing.remaining, "Invalid pixel count");

        uint256 totalPrice = pixelCount * listing.pricePerPixel;
        uint256 fee = (totalPrice * platformFeeBps) / 10000;
        uint256 sellerAmount = totalPrice - fee;

        // Transfer payment
        paymentToken.safeTransferFrom(msg.sender, treasuryAddress, fee);
        paymentToken.safeTransferFrom(msg.sender, listing.seller, sellerAmount);

        // Transfer pixels
        uint256[] memory tokenIds = new uint256[](pixelCount);
        uint256[] memory amounts = new uint256[](pixelCount);
        
        uint256 transferIndex = 0;
        for (uint256 i = 0; i < listing.pixelIndexes.length && transferIndex < pixelCount; i++) {
            uint256 tokenId = pixelEstate.getTokenId(listing.propertyId, listing.pixelIndexes[i]);
            if (pixelEstate.balanceOf(address(this), tokenId) > 0) {
                tokenIds[transferIndex] = tokenId;
                amounts[transferIndex] = 1;
                transferIndex++;
            }
        }

        pixelEstate.safeBatchTransferFrom(address(this), msg.sender, tokenIds, amounts, "");

        listing.remaining -= pixelCount;
        if (listing.remaining == 0) {
            listing.active = false;
        }

        emit Sold(listingId, msg.sender, pixelCount, totalPrice);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(AccessControl, ERC1155Holder) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
