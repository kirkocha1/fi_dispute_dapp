const chai = require("chai")
const chaiAsPromised = require("chai-as-promised")
const crypto = require('crypto')

chai.use(chaiAsPromised)
const expect = chai.expect

const FiDisputeManager = artifacts.require("./FiDisputeManager.sol")
const FiDispute = artifacts.require("./FiDispute.sol")

contract("FiDispute", accounts => {
  it("should choose a winner and send dispute tokens to him", async () => {

  });

  it("should accept judge if all parties agreed on him", async () => {
      
  });

});
