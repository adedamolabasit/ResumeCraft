import { useState, useContext, createContext, useEffect } from "react";
import Web3 from "web3";
import abi from "../contractFIle/ChatGpt.json";

const ContractContext = createContext();

export const ContractProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(localStorage.getItem("walletAddress"));
  const [contractInstance, setContractInstance] = useState(null);
  const [chatId, setChatId] = useState(null); // State to store chatId

  const web3 = new Web3(window.ethereum);
  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

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
          const subscription = contractInstance.events.ChatCreated({
            fromBlock: "latest",
          })
            .on("data", (event) => {
              const { chatId } = event.returnValues;
              setChatId(chatId); // Save chatId to state
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

  const addResumeToKnowledgeBase = async (cid) => {
    if (!contractInstance) {
      console.error("Contract instance is not available");
      return;
    }
  
    try {
      const gasPrice = await web3.eth.getGasPrice();
      const data = contractInstance.methods.setKnowledgeCid(cid).encodeABI();
      const gasEstimate = await web3.eth.estimateGas({
        from: walletAddress,
        to: contractInstance.options.address,
        data: data
      });
  
      const tx = await web3.eth.sendTransaction({
        from: walletAddress,
        to: contractInstance.options.address,
        data: data,
        gas: gasEstimate,
        gasPrice: gasPrice
      });
  
      const receipt = await web3.eth.getTransactionReceipt(tx.transactionHash);
      const { chatId } = receipt.logs[0].data; // Adjust this based on your contract event structure
  
      // Save chatId to state or perform further actions
      console.log("Transaction details:", tx);
      console.log("Chat ID:", chatId);
  
      return tx;
    } catch (error) {
      console.error("Error sending transaction:", error);
      return error;
    }
  };

  const generateResumeContent = async (content) => {
    if (!contractInstance) {
      console.error("Contract instance is not available");
      return;
    }

    try {
      const gasPrice = await web3.eth.getGasPrice();
      const gasEstimate = await contractInstance.methods.startChat(content).estimateGas({ from: walletAddress });

      const tx = await contractInstance.methods.startChat(content).send({
        from: walletAddress,
        gas: gasEstimate,
        gasPrice,
      });

      const { chatId } = tx.events.ChatCreated.returnValues;
      setChatId(chatId); // Save chatId to state
      console.log(tx,"uu")

      return tx;
    } catch (error) {
      console.error("Error sending transaction:", error);
      return error;
    }
  };

  const getNewMessages = async (chatId, currentMessagesCount) => {
    try {
      const messagesResponse = await contractInstance.methods.getMessageHistoryContents(chatId).call({ from: walletAddress });
      const rolesResponse = await contractInstance.methods.getMessageHistoryRoles(chatId).call({ from: walletAddress });

      const messages = Array.isArray(messagesResponse) ? messagesResponse : [messagesResponse];
      const roles = Array.isArray(rolesResponse) ? rolesResponse : [rolesResponse];

      const newMessages = [];
      for (let i = currentMessagesCount; i < messages.length; i++) {
        newMessages.push({
          role: roles[i],
          content: messages[i],
        });
      }

      return newMessages;
    } catch (error) {
      console.error("Error fetching new messages:", error);
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
        addResumeToKnowledgeBase
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};

export const useContract = () => useContext(ContractContext);

