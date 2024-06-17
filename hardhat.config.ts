require("@nomicfoundation/hardhat-ethers");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    galadrielDev: {
      url: "https://devnet.galadriel.com",
      accounts: [process.env.REACT_APP_PRIVATE_KEY].filter(Boolean),
      gas: 100,
      gasPrice: 5000000000,
      timeout: 30000,
      chainId: 696969,
    },
  },
};



