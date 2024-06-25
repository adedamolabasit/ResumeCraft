import React from "react";
import { FaUpload, FaFileAlt, FaCheck, FaDownload, FaInfoCircle } from "react-icons/fa";

const InfoCard: React.FC = () => {
  return (
    <div className="bg-blue-100 text-blue-900 p-6 rounded-lg shadow-lg flex flex-col justify-center items-center h-full">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <FaInfoCircle className="mr-2" /> Getting Started
      </h2>
      <ul className="space-y-4 text-lg">
        <li className="flex items-center space-x-4">
          <FaUpload className="text-3xl text-blue-500" />
          <span>Please upload your resume file.</span>
        </li>
        <li className="flex items-center space-x-4">
          <FaFileAlt className="text-3xl text-blue-500" />
          <span>Provide the job description.</span>
        </li>
        <li className="flex items-center space-x-4">
          <FaCheck className="text-3xl text-blue-500" />
          <span>Approve the transaction on the Galadriel network.</span>
        </li>
        <li className="flex items-center space-x-4">
          <FaDownload className="text-3xl text-blue-500" />
          <span>Download the newly created resume.</span>
        </li>
        <li className="text-center">
          Note: The process may take a while. Please be patient.
        </li>
      </ul>
    </div>
  );
};

export default InfoCard;
