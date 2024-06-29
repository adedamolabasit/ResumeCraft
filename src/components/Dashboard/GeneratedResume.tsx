import React from "react";
import { useContract } from "../../context/contractContext";

const GeneratedResume: React.FC<any> = ({ content }) => {
  const { generateResumeContent } = useContract();

  const downloadResume = async (cid: string) => {
    const message = await generateResumeContent();

    console.log(message, "utyi");
  };

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Generated Resume</h2>
        <div>powered by <span className="font-bold"> Galadriel Network</span></div>
      </div>
      <div className="mt-4 p-4 bg-gray-100 rounded w-full">{content}</div>
      <button
        onClick={() =>
          downloadResume("QmPbGgVXkr9i4eZGvkVWyZReHffSVry4niKcF6k2R2TPte")
        }
        className="mt-4 py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
      >
        Generate Resume
      </button>
    </div>
  );
};

export default GeneratedResume;
