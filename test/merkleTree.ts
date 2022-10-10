import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { MerkleTreeWhitelistContract } from "../typechain-types";
import { expect } from "chai";
import { MerkleTree } from "merkletreejs";

interface Signers {
  admin: SignerWithAddress;
  user: SignerWithAddress;
}

describe("Merkle tree whitelist", function () {
  before(async function () {
    this.signers = {} as Signers;
    const signers: SignerWithAddress[] = await ethers.getSigners();
    this.signers.admin = signers[0];
    this.signers.user = signers[1];
    this.signers.all = signers.slice(2);
  });

  beforeEach(async function () {
    const ContractFactory = await ethers.getContractFactory(
      "MerkleTreeWhitelistContract"
    );

    this.contract = <MerkleTreeWhitelistContract>await ContractFactory.deploy();

    await this.contract.deployed();

    /* Create Merkle tree */
    this.buildMerkleTree = async (addresses: string[]) => {
      const { keccak256 } = ethers.utils;

      let leaves = addresses.map((addr) => keccak256(addr));

      return new MerkleTree(leaves, keccak256, { sortPairs: true });
    };

    this.getProofForAddress = async (
      merkleTree: MerkleTree,
      address: string
    ) => {
      const { keccak256 } = ethers.utils;

      /* Get proof for address */
      let hashedAddress = keccak256(address);
      return merkleTree.getHexProof(hashedAddress);
    };
  });

  it("Should revert INVALID_PROOF", async function () {
    // Create merkle root hash
    const merkleTree = await this.buildMerkleTree([
      this.signers.all[0].address,
      this.signers.all[1].address,
      this.signers.all[2].address,
      this.signers.all[3].address,
    ]);

    await this.contract.setMerkleRoot(merkleTree.getHexRoot());

    const proof = await this.getProofForAddress(
      merkleTree,
      this.signers.all[4].address
    );

    await expect(
      this.contract.connect(this.signers.all[4]).whitelistFunc(proof)
    ).to.be.revertedWith("INVALID_PROOF");
  });

  it("Should revert INVALID_PROOF. Trying to use valid proof for another address", async function () {
    // Create merkle root hash
    const merkleTree = await this.buildMerkleTree([
      this.signers.all[0].address,
      this.signers.all[1].address,
      this.signers.all[2].address,
      this.signers.all[3].address,
    ]);

    await this.contract.setMerkleRoot(merkleTree.getHexRoot());

    const proof = await this.getProofForAddress(
      merkleTree,
      this.signers.all[2].address
    );

    await expect(
      this.contract.connect(this.signers.all[4]).whitelistFunc(proof)
    ).to.be.revertedWith("INVALID_PROOF");
  });

  it("Should pass whitelist check", async function () {
    // Create merkle root hash
    const merkleTree = await this.buildMerkleTree([
      this.signers.all[0].address,
      this.signers.all[1].address,
      this.signers.all[2].address,
      this.signers.all[3].address,
    ]);

    await this.contract.setMerkleRoot(merkleTree.getHexRoot());

    const proof = await this.getProofForAddress(
      merkleTree,
      this.signers.all[1].address
    );

    await expect(
      this.contract.connect(this.signers.all[1]).whitelistFunc(proof)
    ).to.be.not.reverted;
  });
});
