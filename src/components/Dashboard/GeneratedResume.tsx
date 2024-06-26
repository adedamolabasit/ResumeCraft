import React from "react";
import { useContract } from "../../context/contractContext";

const GeneratedResume: React.FC<any> = ({ content }) => {
  const {generateResumeContent, isGenerating} = useContract()  

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Generated Resume</h2>
        <div>Powered by <span className="font-bold"> Galadriel Network</span></div>
      </div>
      <div className="mt-4 p-4 bg-gray-100 rounded w-full">{content}</div>
      <button
        className={`mt-4 py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 ${isGenerating && "bg-blue-600 opacity-60 cursor-not-allowed"}`}
        onClick={generateResumeContent}
        disabled={isGenerating}
      >
        Generate Resume
      </button>
    </div>
  );
};

export default GeneratedResume;
