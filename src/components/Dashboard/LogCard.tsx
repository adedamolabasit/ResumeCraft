import React from "react";
import { useContract } from "../../context/contractContext";

const LogCard: React.FC = () => {
  const { logs } = useContract();

  return (
    <div className="bg-black text-white p-4 rounded-lg shadow-lg h-full flex flex-col">
      <ul className="space-y-2 flex-grow overflow-y-auto">
        {logs.map((log: any, index: any) => (
          <li key={index} className="p-2 bg-gray-800 rounded-md text-white">
            {log}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LogCard;
