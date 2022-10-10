// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract DigitalSignatureWhitelistContract is Ownable {

    using ECDSA for bytes32;

    /**
     * @notice Used to validate whitelist addresses
               Replace this wallet address to your own!
     */
    address private signerAddress = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;

    /**
     * @notice Verify signature
     */
    function verifyAddressSigner(bytes memory signature) private view returns (bool) {
        bytes32 messageHash = keccak256(abi.encodePacked(msg.sender));
        return signerAddress == messageHash.toEthSignedMessageHash().recover(signature);
    }

    /**
     * @notice Function with whitelist
     */
    function whitelistFunc(bytes memory signature) external
    {
        require(verifyAddressSigner(signature), "SIGNATURE_VALIDATION_FAILED");

        // Do some useful stuff
    }
}
