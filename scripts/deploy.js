const { ethers } = require("hardhat");

async function main() {
  const initialOracleAddress = process.env.REACT_APP_ORACLE_ADDRESS;
  const systemPrompt = "You are a helpful assistant"

  if (!initialOracleAddress || !systemPrompt) {
    console.error("Environment variables REACT_APP_ORACLE_ADDRESS or REACT_APP_KB_CID are not set");
    process.exit(1);
  }

  console.log("Oracle Address:", initialOracleAddress);
  console.log("Knowledge Base CID:", systemPrompt);

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contract with the account:", deployer.address);

  const ResumeCraftAgent = await ethers.getContractFactory("ResumeCraftAgent");
  const resumeCraftAgent = await ResumeCraftAgent.deploy(initialOracleAddress, systemPrompt);

  console.log("Contract deployed to:", resumeCraftAgent);

  try {
    console.log("startChat executed successfully");
  } catch (error) {
    console.error("Error executing startChat:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error deploying contract:", error);
    process.exit(1);
  });
