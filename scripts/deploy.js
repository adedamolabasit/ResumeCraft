const { ethers } = require("hardhat");

async function main() {
    const initialOracleAddress = [`${process.env.REACT_APP_ORACLE_ADDRESS}`];
    const cid = [`${process.env.REACT_APP_KB_CID}`];
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contract with the account:", deployer.address);

  const ChatGpt = await ethers.getContractFactory("ChatGpt");
  const chatGpt = await ChatGpt.deploy(...initialOracleAddress, ...cid);

  console.log("Contract deployed to:", chatGpt);
    // Interact with the contract
    const tx = await chatGpt.startChat("Hello, world!");
    await tx.wait();
    console.log("startChat executed successfully");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error deploying contract:", error);
    process.exit(1);
  });
