import { useState, useContext, createContext, useRef, useEffect } from "react";
import Web3 from "web3";
import abi from "../contractFIle/ChatGpt.json";

const ContractContext = createContext();

export const ContractProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const walletAddressRef = useRef(null);
  const [contractInstance, setContractInstance] = useState(null);
  const [chatId, setChatId] = useState(null); // State to store chatId

  const web3 = new Web3(window.ethereum);
  const walletAddress1 = "0x48C3762fF86e96559b5C09047b1Df5882160eB4C";
  const galadrielContractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

  useEffect(() => {
    if (galadrielContractAddress && abi) {
      console.log("Initializing contract instance...");
      try {
        const instance = new web3.eth.Contract(
          abi.abi,
          galadrielContractAddress
        );
        setContractInstance(instance);
        console.log("Contract instance initialized:", instance);
      } catch (error) {
        console.error("Error initializing contract instance:", error);
      }
    } else {
      console.error("Contract address or ABI not found");
    }
  }, [galadrielContractAddress]);

  useEffect(() => {
    if (contractInstance) {
      console.log("Setting up event listener...");
      try {
        if (contractInstance.events) {
          const subscription = contractInstance.events
            .ChatCreated({
              fromBlock: "latest",
            })
            .on("data", (event) => {
              console.log("ChatCreated event detected:", event);
              const { chatId } = event.returnValues;
              setChatId(chatId); // Save chatId to state
            })
            .on("error", (error) => {
              console.error("Error listening to ChatCreated event:", error);
            });

          // Cleanup function to unsubscribe when component unmounts
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
          console.error(
            "Events property is not available on the contract instance"
          );
        }
      } catch (error) {
        console.error("Error setting up event listener:", error);
      }
    } else {
      console.log("Contract instance not available yet.");
    }
  }, [contractInstance]);

  useEffect(() => {
    const run = async () => {
      if (chatId) {
        console.log("hey");
        const a = await triggerOracleFunction(chatId);
        console.log(a, "ooo");
      }
    };
    run();
  }, chatId);

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
    try {
      if (web3.currentProvider && web3.currentProvider.close) {
        await web3.currentProvider.close();
        setWalletAddress(null);
        walletAddressRef.current = null;
        localStorage.removeItem("walletAddress");
      } else {
        console.warn("Provider does not support disconnecting");
      }
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
  };
  let allMessages = [];

  const generateResumeContent = async (content) => {
    if (!contractInstance) {
      console.error("Contract instance is not available");
      return;
    }

    try {
      const tx = await contractInstance.methods.startChat(content).send({
        from: walletAddress1,
        gas: 500000, // Adjust this value if necessary
        gasPrice: "20000000000", // 20 Gwei
        type: 0,
      });

      const { chatId } = tx.events.ChatCreated.returnValues;
      setChatId(chatId); // Save chatId to state

      console.log(tx, "ryr");
      const newMessages = await getNewMessages(chatId, allMessages.length);
      console.log(newMessages, "chiee.");

      return tx;
    } catch (error) {
      console.error("Error sending transaction:", error);
      return error;
    }
  };

  const getNewMessages = async (chatId, currentMessagesCount) => {
    try {
      const messagesResponse = await contractInstance.methods
        .getMessageHistoryContents(chatId)
        .call({ from: walletAddress1 });

      const rolesResponse = await contractInstance.methods
        .getMessageHistoryRoles(chatId)
        .call({ from: walletAddress1 });

      const messages = Array.isArray(messagesResponse)
        ? messagesResponse
        : [messagesResponse];
      const roles = Array.isArray(rolesResponse)
        ? rolesResponse
        : [rolesResponse];

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

  const triggerOracleFunction = async (chatId) => {
    if (!contractInstance) {
      console.error("Contract instance is not available");
      return;
    }

    try {
      const documents = ["Document1", "Document2"]; // Example documents array

      const tx = await contractInstance.methods
        .onOracleKnowledgeBaseQueryResponse(chatId, documents, "")
        .send({
           method: 'eth_requestAccounts',
          from: walletAddress1 ,
          gas: 500000, // Adjust gas limit if necessary
        });

      console.log("Oracle function triggered successfully:", tx);
      const newMessages = await getNewMessages(chatId, allMessages.length);
      console.log(newMessages, "bchiee.");
    } catch (error) {
      console.error("Error triggering Oracle function:", error);
      console.log("Error message:", error.message); // Log specific error message
    }
  };
  return (
    <ContractContext.Provider
      value={{
        connectToWallet,
        disconnectWallet,
        generateResumeContent,
        chatId,
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};

export const useContract = () => useContext(ContractContext);
