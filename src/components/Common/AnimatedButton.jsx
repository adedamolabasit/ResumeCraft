import { motion } from "framer-motion";
import { useContract } from "../../context/contractContext";

const AnimatedButton = ({ text, onClick, canProceed }) => {
  const { cid, walletAddress } = useContract();
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      disabled={!canProceed || cid }
      className={`px-4 py-2  bg-blue-600 cursor-pointer text-white rounded-md ${
        !canProceed && "bg-blue-600 opacity-60 cursor-not-allowed"
      } ${cid && "bg-blue-600 opacity-60 cursor-not-allowed"}`
    }
    >
      {cid ? "File uploaded" : text}
    </motion.button>
  );
};

export default AnimatedButton;
