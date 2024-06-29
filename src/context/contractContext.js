import React, { useState, useContext, createContext, useEffect } from "react";
import Web3 from "web3";
import { toast } from "react-toastify";
import abi from "../contractFIle/ResumeCraftAgent.json";

const ContractContext = createContext();

export const ContractProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(
    localStorage.getItem("walletAddress") || null
  );
  const [contractInstance, setContractInstance] = useState(null);
  const [runId, setRunId] = useState(null);
  const [cid, setCid] = useState(null);
  const [logs, setLogs] = useState(["loading.."]);
  const [canProceed, setCanProceed] = useState(false);
  const [isFileUpload, setIsFileUpload] = useState(false);
  const [resumeData, setResumeData] = useState({});
  const [isResume, setIsResume] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [message, setMessage] = useState("");
  const web3 = new Web3(window.ethereum);
  const contractAddress = "0x35db88B40976489946d1185AF7Dd2c0AFf3DBA3C";

  const handleAccountsChanged = (accounts) => {
    if (accounts.length > 0) {
      const selectedAccount = accounts[0];
      setWalletAddress(selectedAccount);
      localStorage.setItem("walletAddress", selectedAccount);
      toast.info(`Wallet connected: ${selectedAccount}`);
    } else {
      setWalletAddress(null);
      localStorage.removeItem("walletAddress");
      toast.info("Wallet disconnected");
    }
  };

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

    // Cleanup function to remove event listener
    return () => {
      if (window.ethereum && typeof window.ethereum.removeListener === "function") {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      }
    };
  }, [contractAddress]); // Include contractAddress as dependency for reinitialization

  useEffect(() => {
    // Listen for wallet address changes
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }

    return () => {
      if (window.ethereum && typeof window.ethereum.removeListener === "function") {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      }
    };
  }, []); // Empty dependency array ensures this effect runs only once

  useEffect(() => {
    const fetchMessages = async () => {
      const resume = await getNewMessages(2);
      setResumeData({
        data1: resume.response2,
        data2: resume.response4,
        data3: resume.response6,
      });
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
        } catch (error) {
          console.error("Error adding resume to knowledge base:", error);
        }
      }
    };

    processResume();
  }, [cid]);

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
        toast.success(`Wallet connected: ${selectedAccount}`);
      } catch (error) {
        console.error("Error connecting to wallet:", error);
      }
    } else {
      console.error("No compatible wallet provider detected");
    }
  };

  const disconnectWallet = async () => {
    try {
      if (window.ethereum && window.ethereum.isMetaMask) {
        await window.ethereum.request({ method: 'wallet_requestPermissions' });
        await window.ethereum.close();
        setWalletAddress(null);
        localStorage.removeItem('walletAddress'); 
        toast.info('Wallet disconnected');
      } else {
        console.error('No compatible wallet provider detected');
      }
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  const generateResumeContent = async () => {
    setIsResume(false);
    const prompt =
      "Generate a resume based on the provided job description. The resume document should be optimized for Applicant Tracking System (ATS) compatibility. It should include necessary tags to make the display appealing as a professional PDF or DOCX file..";

    setIsFileUpload(false);
    if (!contractInstance) {
      console.error("Contract instance is not available");
      return;
    }

    try {
      const gasPrice = await web3.eth.getGasPrice();
      const gasEstimate = await contractInstance.methods
        .runAgent(prompt, 6)
        .estimateGas({ from: walletAddress });
      console.log("Gas Estimate:", gasEstimate);

      const tx = await contractInstance.methods.runAgent(prompt, 6).send({
        from: walletAddress,
        gas: gasEstimate,
        gasPrice,
      });

      setIsGenerating(true);

      if (
        tx &&
        tx.events &&
        tx.events.AgentRunCreated &&
        tx.events.AgentRunCreated.returnValues
      ) {
        const runId = tx.events.AgentRunCreated.returnValues.runId;

        await checkRunStatusAndFetchMessages(runId);
      } else {
        console.error(
          "AgentRunCreated event not found in transaction response:",
          tx
        );
      }

      return tx;
    } catch (error) {
      console.error("Error sending transaction:", error.message);
      return error;
    }
  };

  const addResumeToKnowledgeBase = async (cid) => {
    setIsResume(false);
    if (!contractInstance) {
      console.error("Contract instance is not available");
      return;
    }

    try {
      const gasPrice = await web3.eth.getGasPrice();
      const gasEstimate = await contractInstance.methods
        .setKnowledgeBaseCid(cid)
        .estimateGas({ from: walletAddress });
      console.log("Gas Estimate:", gasEstimate);

      const tx = await contractInstance.methods.setKnowledgeBaseCid(cid).send({
        from: walletAddress,
        gas: gasEstimate,
        gasPrice,
      });

      if (tx && tx.blockHash && tx.blockNumber && tx.contractAddress) {
        setIsFileUpload(true);
        handleLogsData([
          "Successful",
          tx.transactionHash,
          tx.blockNumber,
          tx.contractAddress,
          tx.gasUsed,
        ]);
      } else {
        console.error("Incomplete transaction response:", tx);
      }

      return tx;
    } catch (error) {
      console.error("Error sending transaction:", error.message);
      return error;
    }
  };

  const checkRunStatusAndFetchMessages = async (runId) => {
    let isFinished = false;

    while (!isFinished) {
      try {
        isFinished = await contractInstance.methods
          .isRunFinished(runId)
          .call({ from: walletAddress });

        if (isFinished) {
          setIsResume(true);
          setIsGenerating(false);
          const messagesResponse = await getNewMessages(runId);
          setMessage(messagesResponse);
        } else {
          await new Promise((resolve) => setTimeout(resolve, 5000));
        }
      } catch (error) {
        console.error("Error checking run status:", error.message);
      }
    }
  };

  const getNewMessages = async (runId) => {
    if (!contractInstance) {
      console.error("Contract instance is not available");
      return {};
    }

    try {
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

      setMessage(messagesResponse);

      console.log("Messages Response:", messagesResponse);

      return messagesResponse;
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
        isGenerating,
        isResume,
        message,
        walletAddress,
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};

export const useContract = () => useContext(ContractContext);
