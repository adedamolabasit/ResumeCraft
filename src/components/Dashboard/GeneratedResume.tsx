import React from 'react';


const GeneratedResume:React.FC<any> = ({ content}) => {
  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold">Generated Resume</h2>
      <pre className="mt-4 p-4 bg-gray-100 rounded">{content}</pre>
      <button
        onClick={() => {/* Logic to download resume */}}
        className="mt-4 py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
      >
        Download Resume
      </button>
    </div>
  );
};

export default GeneratedResume;
