import React from 'react';
import { motion } from 'framer-motion';
import { useContract } from '../../context/contractContext';

const AnimatedButton = ({ text, onClick }) => {
  const { canProceed } = useContract();
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      // disabled={!canProceed}
      className={`px-4 py-2 bg-blue-600 text-white rounded-md ${!canProceed ? "cursor-not-allowed bg-blue-600  opacity-60" : "bg-blue-600 "}`}
    >
      {text}
    </motion.button>
  );
};

export default AnimatedButton;
