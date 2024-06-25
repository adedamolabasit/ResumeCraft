import React, { useState } from "react";
import { FaUpload } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";

const UploadResume: React.FC<any> = ({ onFileUpload }) => {
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState("Select a file");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    // console.log(file,"dhde")
    if (file) {
      setUploading(true);
      onFileUpload(file);
      setFileName(file.name);
    }
  };

  return (
    <div className="mb-4">
      <label className="block mb-2 text-sm font-bold">Upload your resume</label>
      <div className="flex flex-col items-center">
        <label className="w-full flex flex-col items-center px-4 py-6 bg-white text-blue-700 rounded-lg shadow-lg tracking-wide uppercase border border-blue-700 cursor-pointer hover:bg-blue-700 hover:text-white">
          <FaUpload className="text-3xl" />
          <span className="mt-2 text-base leading-normal">{fileName}</span>
          <input type="file" className="hidden" onChange={handleFileChange} />
        </label>
      </div>
      {uploading && (
        <div className="flex items-center justify-end mt-2 text-sm gap-2">
          <FaCheckCircle className="text-green-500" />
        </div>
      )}
    </div>
  );
};

export default UploadResume;
