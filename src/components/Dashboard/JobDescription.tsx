import React from 'react';


const JobDescription:React.FC<any> = ({ onDescriptionChange }) => {
  return (
    <div className="mb-4">
      <label className="block mb-2 text-sm font-bold">Job Description</label>
      <textarea
        onChange={(e) => onDescriptionChange(e.target.value)}
        className="w-full px-4 py-2 border rounded-md"
      />
    </div>
  );
};

export default JobDescription;
