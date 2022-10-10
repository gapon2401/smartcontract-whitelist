import { task } from "hardhat/config";

task("deploy").setAction(async function (_, { ethers, run }) {
  console.log("Start deploying");
  try {
    const OnChainWhitelistContractFactory = await ethers.getContractFactory(
      "OnChainWhitelistContract"
    );
    const OnChainWhitelistContract =
      await OnChainWhitelistContractFactory.deploy();
    await OnChainWhitelistContract.deployed();
    console.log(
      "OnChainWhitelistContract deployed to address:",
      OnChainWhitelistContract.address
    );

    const DigitalSignatureWhitelistContractFactory =
      await ethers.getContractFactory("DigitalSignatureWhitelistContract");
    const DigitalSignatureWhitelistContract =
      await DigitalSignatureWhitelistContractFactory.deploy();
    await DigitalSignatureWhitelistContract.deployed();
    console.log(
      "DigitalSignatureWhitelistContract deployed to address:",
      DigitalSignatureWhitelistContract.address
    );

    const MerkleTreeWhitelistContractFactory = await ethers.getContractFactory(
      "MerkleTreeWhitelistContract"
    );
    const MerkleTreeWhitelistContract =
      await MerkleTreeWhitelistContractFactory.deploy();
    await MerkleTreeWhitelistContract.deployed();
    console.log(
      "MerkleTreeWhitelistContract deployed to address:",
      MerkleTreeWhitelistContract.address
    );
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
});
