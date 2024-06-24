import { useEffect, useState } from "react";
import { useContract } from "../../context/contractContext";

const JobDescription: React.FC<any> = ({ onDescriptionChange }) => {
  const { canProceed } = useContract();
  const [isJobDesc, setIsJobDesc] = useState(false);

  return (
    <div className="mb-4">
      <label className="block mb-2 text-sm font-bold">Job Description</label>
      <textarea
        onChange={(e) => onDescriptionChange(e.target.value)}
        className={`w-full px-4 py-2 border rounded-md  ${
          !canProceed ? "cursor-not-allowed" : "cursor-pointer"
        }`}
        disabled={!canProceed} // Disable the textarea if cid is null or undefined
      />
    </div>
  );
};

export default JobDescription;
