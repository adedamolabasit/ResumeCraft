import React, { useState, useEffect } from "react";
import { FaUpload } from "react-icons/fa";
import { useContract } from "../../context/contractContext";

const UploadResume: React.FC<any> = ({ onFileUpload }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setUploading(true);
      onFileUpload(file);
    }
  };

  return (
    <div className="mb-4">
      <label className="block mb-2 text-sm font-bold">Upload your resume</label>
      <div className="flex flex-col items-center">
        <label className="w-full flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue-500 hover:text-white">
          <FaUpload className="text-3xl" />
          <span className="mt-2 text-base leading-normal">Select a file</span>
          <input
            type="file"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
      </div>
    </div>
  );
};

export default UploadResume;
