import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Common/Navbar';
import Footer from '../components/Common/Footer';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { BsFileEarmarkText } from 'react-icons/bs';
import { FaDownload } from 'react-icons/fa';
import { IoIosDocument } from 'react-icons/io';

const Overview = () => {
  // Placeholder for resume and cover letter data
  const resumeContent = ''; // Replace with actual resume content
  const coverLetterContent = ''; // Replace with actual cover letter content

  // Dummy data for ATS standards
  const atsStandards = [
    { id: 1, icon: <FaCheckCircle className="text-green-500" />, text: 'Optimized with relevant keywords' },
    { id: 2, icon: <FaCheckCircle className="text-green-500" />, text: 'Formatted for ATS compatibility' },
    { id: 3, icon: <FaCheckCircle className="text-green-500" />, text: 'Clean and professional layout' },
    { id: 4, icon: <FaTimesCircle className="text-red-500" />, text: 'No graphics or images' },
    { id: 5, icon: <BsFileEarmarkText className="text-blue-500" />, text: 'Text-based format' },
    { id: 6, icon: <IoIosDocument className="text-blue-500" />, text: 'PDF format' },
  ];

  // Function to handle download resume and cover letter
  const handleDownload = () => {
    // Replace with logic to download resume and cover letter
    // For example, create a Blob and use URL.createObjectURL to create a download link
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Resume and Cover Letter Section */}
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Resume and Cover Letter Previews</h2>
          <div className="flex justify-center space-x-8">
            {/* Resume Preview */}
            <div className="bg-white rounded-lg shadow-lg p-6" style={{ width: '50vw', height: '80vh' }}>
              {/* Placeholder for resume content */}
              <p className="text-gray-700 leading-relaxed whitespace-pre-line overflow-auto">{resumeContent}</p>
            </div>
            {/* Cover Letter Preview */}
            <div className="bg-white rounded-lg shadow-lg p-6" style={{ width: '50vw', height: '80vh' }}>
              {/* Placeholder for cover letter content */}
              <p className="text-gray-700 leading-relaxed whitespace-pre-line overflow-auto">{coverLetterContent}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ATS Standards Section */}
      <section className="bg-gray-200 py-12">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">ATS Standards and Changes</h2>
          <div className="grid grid-cols-2 gap-4">
            {atsStandards.map(item => (
              <div key={item.id} className="flex items-center">
                {item.icon}
                <p className="text-gray-700 ml-2">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section className="bg-gradient-to-r from-blue-400 to-purple-600 py-12">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-8">Download Resume and Cover Letter</h2>
          <div className="flex justify-center">
            <button
              className="bg-white text-blue-500 hover:bg-blue-600 hover:text-white py-2 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out"
              onClick={handleDownload}
            >
              <FaDownload className="inline-block mr-2" />
              Download Resume
            </button>
            <button
              className="bg-white text-blue-500 hover:bg-blue-600 hover:text-white py-2 px-6 rounded-lg shadow-lg ml-4 transition duration-300 ease-in-out"
              onClick={handleDownload}
            >
              <FaDownload className="inline-block mr-2" />
              Download Cover Letter
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Overview;
