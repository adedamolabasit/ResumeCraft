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

  const web3 = new Web3(window.ethereum);
  const walletAddress1 = "0x48C3762fF86e96559b5C09047b1Df5882160eB4C";
  const galadrielContractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

  useEffect(() => {
    if (galadrielContractAddress && abi) {
      console.log("Initializing contract instance...");
      const instance = new web3.eth.Contract(abi.abi, galadrielContractAddress);
      setContractInstance(instance);
    } else {
      console.error("Contract address or ABI not found");
    }
  }, [galadrielContractAddress, abi]);

  useEffect(() => {
    if (contractInstance) {
      console.log("Setting up event listener...");
      // Set up event listener for ChatCreated event
      contractInstance.events.ChatCreated({
        fromBlock: 'latest'
      })
      .on('data', (event) => {
        console.log("ChatCreated event detected:", event);
        // Handle the event data as needed
      })
      .on('error', (error) => {
        console.error("Error listening to ChatCreated event:", error);
      });

      // Cleanup function to unsubscribe when component unmounts
      return () => {
        contractInstance.events.ChatCreated().removeAllListeners();
      };
    } else {
      console.log("Contract instance not available yet.");
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

  const generateResumeContent = async (content) => {
    if (!contractInstance) {
      console.error("Contract instance is not available");
      return;
    }

    try {
      const tx = await contractInstance.methods
        .startChat(content)
        .send({
          from: walletAddress1,
          gas: 500000, // Adjust this value if necessary
          gasPrice: '20000000000', // 20 Gwei
          type: 0 
        });

      console.log(tx.events, "Transaction successful");
      return tx;
    } catch (error) {
      console.error("Error sending transaction:", error);
      throw error;
    }
  };

  return (
    <ContractContext.Provider
      value={{ connectToWallet, disconnectWallet, generateResumeContent }}
    >
      {children}
    </ContractContext.Provider>
  );
};

export const useContract = () => useContext(ContractContext);
