const path = require("path");
require('dotenv').config({ path: './.env' });
const HDWalletProvider = require("@truffle/hdwallet-provider");
const MetaMaskAccountIndex = 0;

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      port: 8545,
      host: "127.0.0.1",
      network_id: process.env.NETWORK_ID
    },
    ganache: {
      provider: function() {
          return new HDWalletProvider(process.env.MNEMONIC, "HTTP://127.0.0.1:7545", MetaMaskAccountIndex);
      },
      port: 7545,
      network_id: process.env.NETWORK_ID,
      host: "127.0.0.1"
    },
    ropsten_infura: {
      provider: function() {
        return new HDWalletProvider(process.env.MNEMONIC, "https://ropsten.infura.io/v3/544717715da448a5adf6e052d78b4f22", MetaMaskAccountIndex)
      },
      network_id: 3
    },
    goerli_infura: {
      provider: function() {
        return new HDWalletProvider(process.env.MNEMONIC, "https://goerli.infura.io/v3/544717715da448a5adf6e052d78b4f22", MetaMaskAccountIndex)
      },
      network_id: 5
    }
  },
  compilers: {
    solc: {
      version: "0.8.10"
    }
  }
}