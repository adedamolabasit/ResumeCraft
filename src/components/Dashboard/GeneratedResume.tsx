import React from "react";
import { useContract } from "../../context/contractContext";

const GeneratedResume: React.FC<any> = ({ content }) => {
  const { chatId, getNewMessages } = useContract();

  const downloadResume = async (cid:string) => {
    const message = await getNewMessages(0);

    console.log(message, "utyi");
  };

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold">Generated Resume</h2>
      <pre className="mt-4 p-4 bg-gray-100 rounded">{content}</pre>
      <button
        onClick={() => downloadResume("QmPbGgVXkr9i4eZGvkVWyZReHffSVry4niKcF6k2R2TPte")}
        className="mt-4 py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
      >
        Download Resume
      </button>
    </div>
  );
};

export default GeneratedResume;
