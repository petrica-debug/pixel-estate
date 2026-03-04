// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./PixelEstate.sol";
import "./KYCRegistry.sol";

contract SaleVoting is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    PixelEstate public pixelEstate;
    KYCRegistry public kycRegistry;

    struct SaleProposal {
        uint256 proposedPrice;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 deadline;
        bool executed;
        bool active;
    }

    // propertyId => SaleProposal
    mapping(uint256 => SaleProposal) public proposals;
    
    // propertyId => voter => hasVoted
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    uint256 public constant QUORUM_BPS = 6600; // 66%
    uint256 public constant VOTING_PERIOD = 30 days;

    event ProposalCreated(uint256 indexed propertyId, address indexed proposer, uint256 proposedPrice, uint256 deadline);
    event VoteCast(uint256 indexed propertyId, address indexed voter, bool support, uint256 weight);
    event ProposalExecuted(uint256 indexed propertyId, uint256 proposedPrice);
    event ProposalCancelled(uint256 indexed propertyId);

    constructor(address _pixelEstate, address _kycRegistry) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        
        pixelEstate = PixelEstate(_pixelEstate);
        kycRegistry = KYCRegistry(_kycRegistry);
    }

    function createProposal(uint256 propertyId, uint256 proposedPrice) external {
        require(kycRegistry.isKYCApproved(msg.sender), "KYC not approved");
        require(!proposals[propertyId].active, "Proposal already active");
        require(getUserPixelCount(propertyId, msg.sender) > 0, "Must own pixels to propose");

        proposals[propertyId] = SaleProposal({
            proposedPrice: proposedPrice,
            votesFor: 0,
            votesAgainst: 0,
            deadline: block.timestamp + VOTING_PERIOD,
            executed: false,
            active: true
        });

        emit ProposalCreated(propertyId, msg.sender, proposedPrice, proposals[propertyId].deadline);
    }

    function vote(uint256 propertyId, bool support) external {
        require(kycRegistry.isKYCApproved(msg.sender), "KYC not approved");
        SaleProposal storage proposal = proposals[propertyId];
        require(proposal.active, "No active proposal");
        require(block.timestamp <= proposal.deadline, "Voting ended");
        require(!hasVoted[propertyId][msg.sender], "Already voted");

        uint256 weight = getUserPixelCount(propertyId, msg.sender);
        require(weight > 0, "No voting weight");

        hasVoted[propertyId][msg.sender] = true;

        if (support) {
            proposal.votesFor += weight;
        } else {
            proposal.votesAgainst += weight;
        }

        emit VoteCast(propertyId, msg.sender, support, weight);
    }

    function executeProposal(uint256 propertyId) external {
        SaleProposal storage proposal = proposals[propertyId];
        require(proposal.active, "No active proposal");
        require(block.timestamp > proposal.deadline, "Voting not ended");
        require(!proposal.executed, "Already executed");

        uint256 totalPixels = pixelEstate.propertyPixelCount(propertyId);
        uint256 totalVotes = proposal.votesFor + proposal.votesAgainst;
        
        uint256 quorumRequired = (totalPixels * QUORUM_BPS) / 10000;

        if (totalVotes >= quorumRequired && proposal.votesFor > proposal.votesAgainst) {
            proposal.executed = true;
            proposal.active = false;
            // In a real scenario, this would trigger property status change in PropertyRegistry
            // and potentially pause trading in Marketplace
            emit ProposalExecuted(propertyId, proposal.proposedPrice);
        } else {
            proposal.active = false;
            emit ProposalCancelled(propertyId);
        }
    }

    function cancelProposal(uint256 propertyId) external onlyRole(ADMIN_ROLE) {
        require(proposals[propertyId].active, "No active proposal");
        proposals[propertyId].active = false;
        emit ProposalCancelled(propertyId);
    }

    function getUserPixelCount(uint256 propertyId, address user) public view returns (uint256) {
        uint256 totalPixels = pixelEstate.propertyPixelCount(propertyId);
        uint256 count = 0;
        
        for (uint256 i = 0; i < totalPixels; i++) {
            uint256 tokenId = pixelEstate.getTokenId(propertyId, i);
            if (pixelEstate.balanceOf(user, tokenId) > 0) {
                count++;
            }
        }
        
        return count;
    }
}
