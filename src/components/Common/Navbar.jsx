import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">ResumeGen</Link>
        <div className="space-x-4">
          <Link to="/login" className="text-white hover:underline">Login</Link>
          <Link to="/signup" className="text-white hover:underline">Signup</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
