import { useState, useContext, createContext, useEffect } from "react";
import Web3 from "web3";
import abi from "../contractFIle/ResumeCraftAgent.json";

const ContractContext = createContext();

export const ContractProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(
    localStorage.getItem("walletAddress")
  );
  const [contractInstance, setContractInstance] = useState(null);
  const [runId, setRunId] = useState(null);
  const [cid, setCid] = useState(null);
  const [logs, setLogs] = useState([]);
  const [canProceed, setCanProceed] = useState(false);
  const [isFileUpload, setIsFileUpload] = useState(false);
  const [resumeData, setResumeData] = useState({});
  const [isResume, setIsResume] = useState(false);

  const web3 = new Web3(window.ethereum);
  const contractAddress = "0xD5a1e080D1AC8BC700B248db8d7A227Cc2E59395";

  useEffect(() => {
    const fetchMessages = async () => {
      const resume = await getNewMessages(2);
      console.log(resume);
      setResumeData({
        data1: resume.response2, // Adjusted to match the correct object keys
        data2: resume.response4, // Adjusted to match the correct object keys
        data3: resume.response6, // Adjusted to match the correct object keys
      });
      console.log(resumeData, "loe");
    };

    fetchMessages();
  }, []);

  useEffect(() => {
    const processResume = async () => {
      if (cid) {
        try {
          const resumeFileCid = await addResumeToKnowledgeBase(cid);
          if (resumeFileCid !== "" && cid) {
            setCanProceed(true);
          }
          console.log((resumeFileCid !== "") & cid);
        } catch (error) {
          console.error("Error adding resume to knowledge base:", error);
        }
      }
    };

    processResume();
  }, [cid]);

  useEffect(() => {
    const initializeContract = async () => {
      if (contractAddress && abi) {
        try {
          const instance = new web3.eth.Contract(abi.abi, contractAddress);
          setContractInstance(instance);
        } catch (error) {
          console.error("Error initializing contract instance:", error);
        }
      }
    };

    initializeContract();
  }, [contractAddress]);

  const handleCid = (cid) => {
    setCid(cid);
  };

  const handleLogsData = (newLogs) => {
    setLogs((prevLogs) => [...prevLogs, ...newLogs]);
  };

  const connectToWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await web3.eth.getAccounts();
        const selectedAccount = accounts[0];
        setWalletAddress(selectedAccount);
        localStorage.setItem("walletAddress", selectedAccount);
      } catch (error) {
        console.error("Error connecting to wallet:", error);
      }
    } else {
      console.error("No compatible wallet provider detected");
    }
  };

  const disconnectWallet = async () => {
    if (web3.currentProvider && web3.currentProvider.close) {
      await web3.currentProvider.close();
      setWalletAddress(null);
      localStorage.removeItem("walletAddress");
    }
  };

  const generateResumeContent = async () => {
    setIsResume(false);
    const prompt =
      "Generate a resume based on the provided job description. the resume document should be optimized to be ATS (Applicant Tracking System) friendly.";

    setIsFileUpload(false);
    if (!contractInstance) {
      console.error("Contract instance is not available");
      return;
    }

    try {
      const gasPrice = await web3.eth.getGasPrice();
      const gasEstimate = await contractInstance.methods
        .runAgent(prompt, 4)
        .estimateGas({ from: walletAddress });
      console.log("Gas Estimate:", gasEstimate);

      const tx = await contractInstance.methods.runAgent(prompt, 4).send({
        from: walletAddress,
        gas: gasEstimate,
        gasPrice,
      });

      console.log("Transaction successful:", tx);

      // Check if runId is present in tx response
      if (
        tx &&
        tx.events &&
        tx.events.AgentRunCreated &&
        tx.events.AgentRunCreated.returnValues
      ) {
        const runId = tx.events.AgentRunCreated.returnValues.runId;
        console.log("Run ID:", runId);

        // Start checking run status and fetch messages when finished
        await checkRunStatusAndFetchMessages(runId);
      } else {
        console.error(
          "AgentRunCreated event not found in transaction response:",
          tx
        );
        // Handle case where event is not emitted as expected
      }

      return tx;
    } catch (error) {
      console.error("Error sending transaction:", error.message);
      return error;
    }
  };

  const addResumeToKnowledgeBase = async (cid) => {
    setIsResume(false);
    console.log(cid, "down");
    if (!contractInstance) {
      console.error("Contract instance is not available");
      return;
    }

    try {
      const gasPrice = await web3.eth.getGasPrice();
      console.log("Gas Price:", gasPrice);

      const gasEstimate = await contractInstance.methods
        .setKnowledgeBaseCid(cid)
        .estimateGas({ from: walletAddress });
      console.log("Gas Estimate:", gasEstimate);

      const tx = await contractInstance.methods.setKnowledgeBaseCid(cid).send({
        from: walletAddress,
        gas: gasEstimate,
        gasPrice,
      });

      console.log("Transaction Response:", tx);

      // Check if the transaction response meets your criteria
      if (tx && tx.blockHash && tx.blockNumber && tx.contractAddress) {
        // Assuming you want to set a state indicating the transaction was successful
        // Replace this with your state setting logic
        // Example:
        setIsFileUpload(true);
        handleLogsData([
          "Successfull",
          tx.transactionHash,
          tx.blockNumber,
          tx.contractAddress,
          tx.gasUsed,
        ]);
        // setOnChainUploadState({
        //   success: true,
        //   txHash: tx.transactionHash,
        //   blockNumber: tx.blockNumber,
        //   contractAddress: tx.contractAddress,
        //   gasUsed: tx.gasUsed,
        //   // Add more fields as needed
        // });
      } else {
        console.error("Incomplete transaction response:", tx);
      }

      return tx; // Optionally return the transaction object
    } catch (error) {
      console.error("Error sending transaction:", error.message);
      // Handle error state or throw the error
      return error;
    }
  };

  const checkRunStatusAndFetchMessages = async (runId) => {
    let isFinished = false;

    while (!isFinished) {
      handleLogsData(["fetching..."]);

      try {
        isFinished = await contractInstance.methods
          .isRunFinished(runId)
          .call({ from: walletAddress });

        console.log(`Run ${runId} is finished:`, isFinished);

        if (isFinished) {
          setIsResume(true);
          const message = getNewMessages(runId)
          console.log(message,"lloeo")
          console.log(`Fetching messages for runId ${runId}`);
        } else {
          // Sleep for a few seconds before checking again (optional)
          await new Promise((resolve) => setTimeout(resolve, 5000)); // Adjust timeout as needed
        }
      } catch (error) {
        console.error("Error checking run status:", error.message);
        // Handle error or retry logic as needed
        // Example: throw error; // if you want to propagate the error up
      }
    }
  };

  const getNewMessages = async (runId) => {
    if (!contractInstance) {
      console.error("Contract instance is not available");
      return {};
    }

    try {
      const gasPrice = await web3.eth.getGasPrice();
      console.log("Gas Price:", gasPrice);

      const gasEstimate = await contractInstance.methods
        .getMessageHistoryContents(runId)
        .estimateGas({ from: walletAddress });
      console.log("Gas Estimate:", gasEstimate);

      const messagesResponse = await contractInstance.methods
        .getMessageHistoryContents(runId)
        .call({
          from: walletAddress,
          gas: gasEstimate,
        });

      console.log("Messages Response:", messagesResponse);

      // Process messagesResponse to create an object with response1, response2, etc.
      const responseObject = {};
      let responseCount = 1;

      messagesResponse.forEach((message, index) => {
        if (message.role === "assistant") {
          responseObject[`response${responseCount}`] = message.content;
          responseCount++;
        }
      });

      console.log("Processed Responses:", responseObject);

      return responseObject;
    } catch (error) {
      console.error("Error fetching new messages:", error.message);
      return {};
    }
  };

  return (
    <ContractContext.Provider
      value={{
        connectToWallet,
        disconnectWallet,
        generateResumeContent,
        runId,
        getNewMessages,
        addResumeToKnowledgeBase,
        handleCid,
        handleLogsData,
        logs,
        cid,
        canProceed,
        isFileUpload,
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};

export const useContract = () => useContext(ContractContext);
