import React from "react";
import { Link } from "react-router-dom";
import { useContract } from "../../context/contractContext";
import { FaRobot } from "react-icons/fa"; 
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { connectToWallet, disconnectWallet, walletAddress} = useContract();
  const navigate = useNavigate()

  const formatWalletAddress = (address) => {
    if (address.length < 12) return address;

    const firstSix = address.substring(0, 6);
    const lastSix = address.substring(address.length - 6);
    return `${firstSix}...${lastSix}`;
  };

  const handleDisconnect = async () => {
    try {
      await disconnectWallet(); 
      console.log("Wallet disconnected successfully");
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
  };


  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">
          ResumeCraft
        </Link>

        <div className="flex items-center space-x-4">
          {walletAddress ? (
            <div className="flex items-center space-x-4">
              <div className="text-white">
                {formatWalletAddress(walletAddress)}
              </div>
              <FaRobot
                className="text-white cursor-pointer hover:text-gray-300"
                onClick={handleDisconnect}
                title="Disconnect Wallet"
              />
            
            </div>
          ) : (
            <div
              onClick={connectToWallet}
              className="text-white hover:underline cursor-pointer"
            >
              
              Connect Wallet
            </div>
          )}
            <button
                className="text-white bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded-md"
                onClick={() => navigate("/dashboard")}
              >
                Generate Resume
              </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
