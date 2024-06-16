const { ethers } = require("hardhat");

async function main() {
    const initialOracleAddress = [`${process.env.REACT_APP_ORACLE_ADDRESS}`];
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contract with the account:", deployer.address);

  const ChatGpt = await ethers.getContractFactory("ChatGpt");
  const chatGpt = await ChatGpt.deploy(...initialOracleAddress);

  console.log("Contract deployed to:", chatGpt);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error deploying contract:", error);
    process.exit(1);
  });
