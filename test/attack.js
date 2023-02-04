const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers, waffle } = require("hardhat");

describe("Attack", function () {
  it("After being decalred the winner , attack contract will not allow anyone to became winner", async function () {
    const goodContract = await ethers.getContractFactory("Good");
    const _goodContract = await goodContract.deploy();
    await _goodContract.deployed();
    console.log("Good contract address is :", _goodContract.address);

    const attackContract = await ethers.getContractFactory("Attack");
    const _attackContract = await attackContract.deploy(_goodContract.address);
    await _attackContract.deployed();
    console.log("Attack contract address: ", _attackContract.address);

    const [_, addr1, addr2] = await ethers.getSigners();
    let tx = await _goodContract.connect(addr1).setCurrentAuctionPrice({
      value: ethers.utils.parseEther("1"),
    });
    await tx.wait();
    //starting attack on good contract
    tx = await _attackContract.attack({
      value: ethers.utils.parseEther("3"),
    });
    await tx.wait();

    expect(await _goodContract.currentWinner()).to.equal(
      _attackContract.address
    );
  });
});
