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
  const [logs, setLogs] = useState(["loading.."]);
  const [canProceed, setCanProceed] = useState(false);
  const [isFileUpload, setIsFileUpload] = useState(false);
  const [resumeData, setResumeData] = useState({});
  const [isResume, setIsResume] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [message, setMessage] = useState();

  const web3 = new Web3(window.ethereum);
  const contractAddress = "0x3Ab2548b286ac591EDDA2b1814985a478B217517";

  useEffect(() => {
    const fetchMessages = async () => {
      const resume = await getNewMessages(2);
      console.log(resume);
      setResumeData({
        data1: resume.response2, 
        data2: resume.response4, 
        data3: resume.response6
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

      if (tx && tx.blockHash && tx.blockNumber && tx.contractAddress) {
        setIsFileUpload(true);
        handleLogsData([
          "Successfull",
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
    const message = getNewMessages(runId);
    console.log(`Fetching messages for runId ${runId}`, message);

    while (!isFinished) {
      handleLogsData(["fetching..."]);

      try {
        isFinished = await contractInstance.methods
          .isRunFinished(runId)
          .call({ from: walletAddress });

        console.log(`Run ${runId} is finished:`, isFinished);

        if (isFinished) {
          setIsResume(true);
          setIsGenerating(false);
          const message = getNewMessages(runId);
          console.log(`Fetching messages for runId ${runId}`);
        } else {
          await new Promise((resolve) => setTimeout(resolve, 5000)); // Adjust timeout as needed
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
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};

export const useContract = () => useContext(ContractContext);
