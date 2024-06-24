import { useState, useContext, createContext, useEffect } from "react";
import Web3 from "web3";
import abi from "../contractFIle/ResumeCraftAgent.json";

const ContractContext = createContext();

export const ContractProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(localStorage.getItem("walletAddress"));
  const [contractInstance, setContractInstance] = useState(null);
  const [chatId, setChatId] = useState(null);
  const [cid, setCid] = useState(null);
  const [logs, setLogs] = useState([]);
  const [canProceed, setCanProceed] = useState(false);

  const web3 = new Web3(window.ethereum);
  const contractAddress = "0xDFf6BC4c64295d0Fd85ED11d5433772D9eD297aD";

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
    if (contractAddress && abi) {
      try {
        const instance = new web3.eth.Contract(abi.abi, contractAddress);
        setContractInstance(instance);
      } catch (error) {
        console.error("Error initializing contract instance:", error);
      }
    }
  }, [contractAddress]);

  useEffect(() => {
    if (contractInstance) {
      try {
        if (contractInstance.events && contractInstance.events.ChatCreated) {
          const subscription = contractInstance.events
            .ChatCreated({
              fromBlock: "latest",
            })
            .on("data", (event) => {
              const { chatId } = event.returnValues;
              setChatId(chatId);
            })
            .on("error", (error) => {
              console.error("Error listening to ChatCreated event:", error);
            });

          return () => {
            subscription.unsubscribe((error, success) => {
              if (success) {
                console.log("Successfully unsubscribed!");
              } else {
                console.error("Error while unsubscribing:", error);
              }
            });
          };
        } else {
          console.error("ChatCreated event is not available on the contract instance");
        }
      } catch (error) {
        console.error("Error setting up event listener:", error);
      }
    }
  }, [contractInstance]);

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

  const generateResumeContent = async (jobDescription) => {
    if (!contractInstance) {
      console.error("Contract instance is not available");
      return;
    }

    try {
      const gasPrice = await web3.eth.getGasPrice();
      const gasEstimate = await contractInstance.methods.runAgent(jobDescription, 4).estimateGas({ from: walletAddress });
      console.log("Gas Estimate:", gasEstimate);

      const tx = await contractInstance.methods.runAgent(jobDescription, 4).send({
        from: walletAddress,
        gas: gasEstimate,
        gasPrice,
      });

      const { chatId } = tx.events.AgentRunCreated.returnValues;
      setChatId(chatId);
      console.log("Transaction successful:", tx);

      return tx;
    } catch (error) {
      console.error("Error sending transaction:", error.message);
      return error;
    }
  };

  const addResumeToKnowledgeBase = async (cid) => {
    if (!contractInstance) {
      console.error("Contract instance is not available");
      return;
    }

    try {
      const gasPrice = await web3.eth.getGasPrice();
      console.log("Gas Price:", gasPrice);

      const gasEstimate = await contractInstance.methods.setKnowledgeBaseCid(cid).estimateGas({ from: walletAddress });
      console.log("Gas Estimate:", gasEstimate);

      const tx = await contractInstance.methods.setKnowledgeBaseCid(cid).send({
        from: walletAddress,
        gas: gasEstimate,
        gasPrice,
      });

      return tx;
    } catch (error) {
      console.error("Error sending transaction:", error.message);
      return error;
    }
  };

  const getNewMessages = async (chatId) => {
    if (!contractInstance) {
      console.error("Contract instance is not available");
      return [];
    }

    try {
      const gasPrice = await web3.eth.getGasPrice();
      console.log("Gas Price:", gasPrice);

      const gasEstimate = await contractInstance.methods.getMessageHistoryContents(chatId).estimateGas({ from: walletAddress });
      console.log("Gas Estimate:", gasEstimate);

      const messagesResponse = await contractInstance.methods.getMessageHistoryContents(chatId).call({
        from: walletAddress,
        gas: gasEstimate,
      });

      console.log(messagesResponse, "Messages Response");

      return messagesResponse;
    } catch (error) {
      console.error("Error fetching new messages:", error.message);
      return [];
    }
  };

  return (
    <ContractContext.Provider
      value={{
        connectToWallet,
        disconnectWallet,
        generateResumeContent,
        chatId,
        getNewMessages,
        addResumeToKnowledgeBase,
        handleCid,
        handleLogsData,
        logs,
        cid,
        canProceed,
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};

export const useContract = () => useContext(ContractContext);
