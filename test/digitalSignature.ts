import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { DigitalSignatureWhitelistContract } from "../typechain-types";
import { expect } from "chai";

interface Signers {
  admin: SignerWithAddress;
  user: SignerWithAddress;
}

describe("Digital signature whitelist", function () {
  before(async function () {
    this.signers = {} as Signers;
    const signers: SignerWithAddress[] = await ethers.getSigners();
    this.signers.admin = signers[0];
    this.signers.user = signers[1];
    this.signers.all = signers.slice(2);
  });

  beforeEach(async function () {
    const ContractFactory = await ethers.getContractFactory(
      "DigitalSignatureWhitelistContract"
    );

    this.contract = <DigitalSignatureWhitelistContract>(
      await ContractFactory.deploy()
    );

    await this.contract.deployed();

    this.signMessage = async (address: string) => {
      const signer = new ethers.Wallet(process.env.SIGNER_PRIVATE_KEY!);
      const addressHash = ethers.utils.solidityKeccak256(
        ["address"],
        [address.toLowerCase()]
      );

      // Sign the hashed address
      const messageBytes = ethers.utils.arrayify(addressHash);
      return await signer.signMessage(messageBytes);
    };
  });

  it("Should revert SIGNATURE_VALIDATION_FAILED", async function () {
    const signature = await this.signMessage(this.signers.user.address);

    await expect(
      this.contract.connect(this.signers.all[0]).whitelistFunc(signature)
    ).to.be.revertedWith("SIGNATURE_VALIDATION_FAILED");
  });

  it("Should pass whitelist check", async function () {
    const signature = await this.signMessage(this.signers.user.address);

    await expect(
      this.contract.connect(this.signers.user).whitelistFunc(signature)
    ).to.be.not.reverted;
  });
});
