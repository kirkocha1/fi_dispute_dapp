var FiDisputeManager = artifacts.require("./FiDisputeManager.sol")
var FiDiToken = artifacts.require("./FiDiToken.sol")

module.exports = async function(deployer) {
  await deployer.deploy(FiDiToken);
  const token = await FiDiToken.deployed()
  await deployer.deploy(FiDisputeManager, FiDiToken.address)
  const manager = await FiDisputeManager.deployed()
  await token.grantRole("0x00", manager.address)
  await token.grantRole(web3.utils.keccak256("MINTER_ROLE"), manager.address)
    
};
