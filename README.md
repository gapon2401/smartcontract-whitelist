# Whitelist in smartcontracts (ERC-721 NFT, ERC-1155 and others)

Here you will find 3 methods of implementing whitelist:

- On-chain whitelist
- Digital signature
- Merkle tree

## On-chain whitelist (mapping)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import "@openzeppelin/contracts/access/Ownable.sol";

contract OnChainWhitelistContract is Ownable {

    mapping(address => bool) public whitelist;

    /**
     * @notice Add to whitelist
     */
    function addToWhitelist(address[] calldata toAddAddresses) external onlyOwner
    {
        for (uint i = 0; i < toAddAddresses.length; i++) {
            whitelist[toAddAddresses[i]] = true;
        }
    }

    /**
     * @notice Remove from whitelist
     */
    function removeFromWhitelist(address[] calldata toRemoveAddresses) external onlyOwner
    {
        for (uint i = 0; i < toRemoveAddresses.length; i++) {
            delete whitelist[toRemoveAddresses[i]];
        }
    }

    /**
     * @notice Function with whitelist
     */
    function whitelistFunc() external
    {
        require(whitelist[msg.sender], "NOT_IN_WHITELIST");

        // Do some useful stuff
    }
}

```

## Digital signature

```solidity
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

```

## Merkle tree

```solidity
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

```

In the `test` folder you will find how to create digital signature and merkle proof on web.

## Comparison table

### Gas units

| Property                      | On-chain | Digital signature | Merkle tree |
|-------------------------------|----------|-------------------|-------------|
| Deployment                    | 329 724  | 486 182           | 352 790     |
| Add to whitelist 1 address    | 46 898   | 0                 | 28 986      |
| Add to whitelist 10 addresses | 253 010  | 0                 | 28 986      |
| Remove from whitelist         | 24 930   | 0                 | 28 986      |
| Call function with whitelist  | 23 443   | 29 365            | 26 065      |

### Gas price in USD

`Gas price per unit` = 22, `ETH` = $1324

| Property                      | On-chain | Digital signature | Merkle tree |
|-------------------------------|----------|-------------------|-------------|
| Deployment                    | $9.6     | $14.16            | $10.28      |
| Add to whitelist 1 address    | $1.37    | 0                 | $0.84       |
| Add to whitelist 10 addresses | $7.37    | 0                 | $0.84       |
| Remove from whitelist         | $0.73    | 0                 | $0.84       |
| Call function with whitelist  | $0.68    | $0.86             | $0.76       |