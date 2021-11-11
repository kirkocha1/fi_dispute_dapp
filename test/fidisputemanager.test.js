const chai = require("chai")
const chaiAsPromised = require("chai-as-promised")
const crypto = require('crypto')

chai.use(chaiAsPromised)
const expect = chai.expect

const FiDisputeManager = artifacts.require("./FiDisputeManager.sol")
const FiDispute = artifacts.require("./FiDispute.sol")
const FiDiToken = artifacts.require("./FiDiToken.sol")

contract("FiDisputeManager", accounts => {
  it("should create Dispute contract", async () => {
    const fiDiToken = await FiDiToken.deployed()
    const fiDisputeManagerInstance = await FiDisputeManager.deployed()
    const tx = await web3.eth.sendTransaction({from: accounts[0], value: 10, to: fiDisputeManagerInstance.address })
    const res = await fiDisputeManagerInstance.registerDisputeIntention(web3.utils.asciiToHex("test_condition"), 5, { from: accounts[0] })
    const disputeEvent = res.logs[0]
    const disputeInstance = await FiDispute.at(disputeEvent.args[0])
    
    assert.equal(await web3.eth.getBalance(fiDisputeManagerInstance.address), 10)
    assert.equal(disputeEvent.event, "NewOpenDispute", "wrong event")
    assert.equal(await disputeInstance.getDeposit(), 5, "deposit is wrong")
  });

  it("should accept challenger for certain dispute if challenger has enough tokens on client behalf", async () => {
    const fiDisputeManagerInstance = await FiDisputeManager.deployed()
    const fiDiToken = await FiDiToken.deployed()
    const disputeDesc = web3.utils.asciiToHex("test_condition")
    const txAcc1 = await web3.eth.sendTransaction({from: accounts[0], value: 1, to: fiDisputeManagerInstance.address })
    const res = await fiDisputeManagerInstance.registerDisputeIntention(web3.utils.asciiToHex("test_condition"), 5, { from: accounts[0] })
    const disputeEvent = res.logs[0]
    const disputeInstance = await FiDispute.at(disputeEvent.args[0])
    
    const txAcc2 = await web3.eth.sendTransaction({from: accounts[1], value: 10, to: fiDisputeManagerInstance.address })
    
    await fiDiToken.increaseAllowance(fiDisputeManagerInstance.address, await disputeInstance.getParticipationStake(), { from: accounts[1] })
    await fiDisputeManagerInstance.acceptDispute(disputeEvent.args[0], { from: accounts[1] })
    
    assert.equal(await disputeInstance.getDeposit(), 10, "deposit is wrong")
  });

  it("should refund tokens for ETH on client behalf", async () => {
    const fiDisputeManagerInstance = await FiDisputeManager.deployed()
    const fiDiToken = await FiDiToken.deployed()
    const txAcc1 = await web3.eth.sendTransaction({from: accounts[3], value: 2, to: fiDisputeManagerInstance.address })
    await fiDiToken.increaseAllowance(fiDisputeManagerInstance.address, 2, { from: accounts[3] })
    assert.equal(await fiDiToken.balanceOf(accounts[3]), 2, "deposit is wrong")
    fiDisputeManagerInstance.refund(1, { from: accounts[3] })
    assert.equal(await fiDiToken.balanceOf(accounts[3]), 1, "deposit is wrong")
  });

});
