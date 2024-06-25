import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Common/Navbar";
import Footer from "../components/Common/Footer";
import { motion } from "framer-motion";
import { FaArrowRight, FaRobot } from "react-icons/fa";
import AnimatedButton from "../components/Common/AnimatedButton";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <section className="flex-grow flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-600 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -20 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute right-0 bottom-0 mb-8 mr-8 z-20"
        >
          <FaRobot className="text-6xl text-blue-500" />
        </motion.div>

        <div className="absolute top-0 right-0 mt-8 mr-8 flex flex-col items-end z-20">
          <div
            className="bg-white rounded-lg shadow-md p-4 mb-4"
            style={{ width: "300px" }}
          >
            <p className="text-blue-600 text-xs leading-tight mb-1">Welcome!</p>
            <p className="text-sm leading-tight font-semibold">
              We're here to revolutionize your job application process{" "}
              <span role="img" aria-label="rocket">
                🚀
              </span>
            </p>
          </div>
          <div
            className="bg-white rounded-lg shadow-md p-4 mr-24"
            style={{ width: "300px" }}
          >
            <p className="text-blue-600 text-xs leading-tight mb-1">
              AI at Work
            </p>
            <p className="text-sm leading-tight font-semibold">
              Our AI ensures your resume is perfectly tailored{" "}
              <span role="img" aria-label="robot">
                🤖
              </span>
            </p>
          </div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-0 text-center text-white h-72"></div>
      </section>

      <section className="bg-gray-100 py-12 opacity-">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            How We Can Help You
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <FaArrowRight className="text-4xl text-blue-500 mb-4 mx-auto" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Resume Tailoring
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Tailor your resume to match your desired job description. Our AI
                analyzes keywords and formats to optimize your chances.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <FaArrowRight className="text-4xl text-blue-500 mb-4 mx-auto" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Job Fit Analysis
              </h3>
              <p className="text-gray-700 leading-relaxed">
                We compare your resume against job descriptions to assess fit.
                Receive insights and recommendations for improvement.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <FaArrowRight className="text-4xl text-blue-500 mb-4 mx-auto" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                ATS Optimization
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Ensure your resume passes through Applicant Tracking Systems.
                Our templates and formats are designed to meet ATS requirements.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-gradient-to-r from-blue-400 to-purple-600 py-12">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            Start Building Your Career Today
          </h2>
          <Link to="/dashboard">
            <AnimatedButton text="Get Started" onClick={() => {}} canProceed={true} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
