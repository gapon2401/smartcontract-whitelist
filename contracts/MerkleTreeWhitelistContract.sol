// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract MerkleTreeWhitelistContract is Ownable {

    /**
     * @notice Merkle root hash for whitelist addresses
     */
    bytes32 public merkleRoot = 0x09485889b804a49c9e383c7966a2c480ab28a13a8345c4ebe0886a7478c0b73d;

    /**
     * @notice Change merkle root hash
     */
    function setMerkleRoot(bytes32 merkleRootHash) external onlyOwner
    {
        merkleRoot = merkleRootHash;
    }

    /**
     * @notice Verify merkle proof of the address
     */
    function verifyAddress(bytes32[] calldata _merkleProof) private view returns (bool) {
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
        return MerkleProof.verify(_merkleProof, merkleRoot, leaf);
    }

    /**
     * @notice Function with whitelist
     */
    function whitelistFunc(bytes32[] calldata _merkleProof) external
    {
        require(verifyAddress(_merkleProof), "INVALID_PROOF");

        // Do some useful stuff
    }
}
