import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Common/Navbar';
import Footer from '../components/Common/Footer';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import AnimatedButton from '../components/Common/AnimatedButton';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-600">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center p-8 bg-white rounded-lg shadow-lg"
        >
          <h1 className="text-4xl font-bold mb-4">Create Your Perfect Resume</h1>
          <p className="mb-8 text-gray-700">Generate a resume tailored to the job you're applying for.</p>
          <Link to="/signup">
            <AnimatedButton text="Get Started" onClick={() => {}} />
          </Link>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};


export default Home;
