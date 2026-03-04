// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./PixelEstate.sol";
import "./KYCRegistry.sol";

contract RentalDistributor is AccessControl, ReentrancyGuard {
    using SafeERC20 for IERC20;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    PixelEstate public pixelEstate;
    KYCRegistry public kycRegistry;
    IERC20 public distributionToken; // USDC

    struct RentalPeriod {
        uint256 totalAmount;
        uint256 timestamp;
        uint256 distributed;
    }

    // propertyId => RentalPeriod[]
    mapping(uint256 => RentalPeriod[]) public rentalPeriods;

    // propertyId => periodIndex => user => hasClaimed
    mapping(uint256 => mapping(uint256 => mapping(address => bool))) public hasClaimed;

    event RentalDeposited(uint256 indexed propertyId, uint256 amount, uint256 periodIndex);
    event RentalClaimed(uint256 indexed propertyId, address indexed owner, uint256 amount, uint256 periodIndex);
    event DistributionTokenUpdated(address tokenAddress);

    constructor(address _pixelEstate, address _kycRegistry, address _distributionToken) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        
        pixelEstate = PixelEstate(_pixelEstate);
        kycRegistry = KYCRegistry(_kycRegistry);
        distributionToken = IERC20(_distributionToken);
    }

    function setDistributionToken(address _token) external onlyRole(ADMIN_ROLE) {
        distributionToken = IERC20(_token);
        emit DistributionTokenUpdated(_token);
    }

    function depositRental(uint256 propertyId, uint256 amount) external onlyRole(ADMIN_ROLE) {
        require(amount > 0, "Amount must be > 0");
        require(pixelEstate.propertyPixelCount(propertyId) > 0, "Property does not exist");

        distributionToken.safeTransferFrom(msg.sender, address(this), amount);

        uint256 periodIndex = rentalPeriods[propertyId].length;
        rentalPeriods[propertyId].push(RentalPeriod({
            totalAmount: amount,
            timestamp: block.timestamp,
            distributed: 0
        }));

        emit RentalDeposited(propertyId, amount, periodIndex);
    }

    function claimRental(uint256 propertyId, uint256 periodIndex) public nonReentrant {
        require(kycRegistry.isKYCApproved(msg.sender), "KYC not approved");
        require(periodIndex < rentalPeriods[propertyId].length, "Invalid period");
        require(!hasClaimed[propertyId][periodIndex][msg.sender], "Already claimed");

        uint256 claimableAmount = pendingRentalForPeriod(propertyId, periodIndex, msg.sender);
        require(claimableAmount > 0, "Nothing to claim");

        hasClaimed[propertyId][periodIndex][msg.sender] = true;
        rentalPeriods[propertyId][periodIndex].distributed += claimableAmount;

        distributionToken.safeTransfer(msg.sender, claimableAmount);

        emit RentalClaimed(propertyId, msg.sender, claimableAmount, periodIndex);
    }

    function claimAllRental(uint256 propertyId) external {
        uint256 periodsCount = rentalPeriods[propertyId].length;
        for (uint256 i = 0; i < periodsCount; i++) {
            if (!hasClaimed[propertyId][i][msg.sender]) {
                uint256 amount = pendingRentalForPeriod(propertyId, i, msg.sender);
                if (amount > 0) {
                    claimRental(propertyId, i);
                }
            }
        }
    }

    function pendingRentalForPeriod(uint256 propertyId, uint256 periodIndex, address user) public view returns (uint256) {
        if (hasClaimed[propertyId][periodIndex][user]) return 0;

        uint256 totalPixels = pixelEstate.propertyPixelCount(propertyId);
        if (totalPixels == 0) return 0;

        // We need to calculate how many pixels the user owns for this property
        // Because ERC1155 tracks balances per token ID, we have to iterate through all possible pixels for the property
        // Note: In a production environment with 10k pixels, doing this on-chain in a view function is okay,
        // but in a state-changing transaction it might exceed block gas limits.
        // A better approach is tracking user balances per property in PixelEstate or an indexer.
        // For now, we will query the balance of each pixel index.
        
        uint256 userPixels = 0;
        for (uint256 i = 0; i < totalPixels; i++) {
            uint256 tokenId = pixelEstate.getTokenId(propertyId, i);
            if (pixelEstate.balanceOf(user, tokenId) > 0) {
                userPixels++;
            }
        }

        if (userPixels == 0) return 0;

        RentalPeriod memory period = rentalPeriods[propertyId][periodIndex];
        return (userPixels * period.totalAmount) / totalPixels;
    }

    function pendingRental(uint256 propertyId, address user) external view returns (uint256 totalPending) {
        uint256 periodsCount = rentalPeriods[propertyId].length;
        for (uint256 i = 0; i < periodsCount; i++) {
            totalPending += pendingRentalForPeriod(propertyId, i, user);
        }
    }
}
