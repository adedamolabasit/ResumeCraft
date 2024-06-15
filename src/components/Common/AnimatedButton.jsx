import React from 'react';
import { motion } from 'framer-motion';


const AnimatedButton = ({ text, onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="px-4 py-2 bg-blue-600 text-white rounded-md"
    >
      {text}
    </motion.button>
  );
};

export default AnimatedButton;
