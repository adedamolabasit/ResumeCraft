import React, { useState, useEffect } from "react";
import {
  FaUpload,
  FaFileAlt,
  FaCheck,
  FaDownload,
  FaInfoCircle,
  FaRobot,
  FaLock,
  FaCloudUploadAlt,
} from "react-icons/fa";
import { useContract } from "../../context/contractContext";
import { useNavigate } from "react-router-dom";

const InfoCard: React.FC = () => {
  const { isResume, isGenerating } = useContract();
  const navigate = useNavigate();
  const [generatingText, setGeneratingText] = useState("Please wait...");

  //   // Placeholder function to simulate file generation
  //   const handleGenerateResume = () => {
  //     setIsGenerating(true);
  //     // Simulate generation process
  //     setTimeout(() => {
  //       setIsGenerating(false);
  //     }, 3000); // Placeholder duration for simulation
  //   };

  useEffect(() => {
    if (isResume) {
      navigate("/overview");
    }
  }, [isGenerating, isResume]);
  useEffect(() => {
    let textIndex = 0;
    const generatingTexts = [
      "Please wait...",
      "Hold on...",
      "Almost there...",
      "Generating resume...",
    ];

    const interval = setInterval(() => {
      setGeneratingText(generatingTexts[textIndex]);
      textIndex = (textIndex + 1) % generatingTexts.length;
    }, 3000);

    return () => clearInterval(interval);
  }, []); // Empty dependency array ensures this effect runs only once

  return (
    <div className="bg-blue-100 text-blue-900 p-6 rounded-lg shadow-lg flex flex-col justify-center items-center h-full">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <FaInfoCircle className="mr-2" /> Getting Started
      </h2>
      <ul className="space-y-4 text-lg">
        <li className="flex items-center space-x-4">
          <FaUpload className="text-3xl text-blue-500" />
          <span>Upload your resume file.</span>
        </li>
        <li className="flex items-center space-x-4">
          <FaFileAlt className="text-3xl text-blue-500" />
          <span>Provide the job description.</span>
        </li>
        <li className="flex items-center space-x-4">
          <FaCloudUploadAlt className="text-3xl text-blue-500" />
          <span>Click "Upload Documents" for file indexing.</span>
        </li>
        <li className="flex items-center space-x-4">
          <FaLock className="text-3xl text-blue-500" />
          <span>
            Approve the transaction to add the indexed CID to the AI Knowledge
            Base.
          </span>
        </li>
        <li className="flex items-center space-x-4">
          <FaRobot className="text-3xl text-blue-500" />
          <span>
            Click "Generate Resume" for AI to create a resume, cover letter, and
            generate analysis.
          </span>
        </li>
        <li className="flex items-center space-x-4">
          <FaCheck className="text-3xl text-blue-500" />
          <span>Approve the transaction to generate the resume.</span>
        </li>
        <li className="flex items-center space-x-4">
          <FaDownload className="text-3xl text-blue-500" />
          <span>
            View and download the newly created resume and cover letter.
          </span>
        </li>
      </ul>
      <div className="w-full mt-4 flex items-center flex-col">
        {isGenerating && (
          <div className="flex flex-col items-center space-x-2 text-sm w-full">
            <div className="w-full h-5 bg-blue-500 rounded-full overflow-hidden relative">
              <div className="h-full bg-blue-300 absolute left-0 animate-progress"></div>
            </div>
            <span className="self-start mt-2">{generatingText}</span>
          </div>
        )}
        {/* <button
          onClick={handleGenerateResume}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg focus:outline-none"
        >
          Generate Resume
        </button> */}
      </div>
    </div>
  );
};

export default InfoCard;
