// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract KYCRegistry is AccessControl {
    bytes32 public constant KYC_ADMIN_ROLE = keccak256("KYC_ADMIN_ROLE");

    mapping(address => bool) private _kycStatuses;

    event KYCStatusUpdated(address indexed user, bool status);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(KYC_ADMIN_ROLE, msg.sender);
    }

    function setKYCStatus(address user, bool status) external onlyRole(KYC_ADMIN_ROLE) {
        _kycStatuses[user] = status;
        emit KYCStatusUpdated(user, status);
    }

    function batchSetKYC(address[] calldata users, bool[] calldata statuses) external onlyRole(KYC_ADMIN_ROLE) {
        require(users.length == statuses.length, "Length mismatch");
        for (uint256 i = 0; i < users.length; i++) {
            _kycStatuses[users[i]] = statuses[i];
            emit KYCStatusUpdated(users[i], statuses[i]);
        }
    }

    function isKYCApproved(address user) external view returns (bool) {
        return _kycStatuses[user];
    }
}
