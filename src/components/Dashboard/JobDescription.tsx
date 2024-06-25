import { useEffect, useState } from "react";
import { useContract } from "../../context/contractContext";
import { FaCheckCircle } from "react-icons/fa";

const JobDescription: React.FC<any> = ({
  onDescriptionChange,
  jobDescription,
}) => {
  const { canProceed } = useContract();
  const [isJobDesc, setIsJobDesc] = useState(false);

  return (
    <div className="h-full mb-4">
      <label className="block mb-2 text-sm font-bold">Job Description</label>
      <textarea
        onChange={(e) => onDescriptionChange(e.target.value)}
        className={`w-full h-[75%] px-4 py-2 border rounded-md`}
      />
      {jobDescription && (
        <div className="flex items-center justify-end mt-2 text-sm gap-2">
          <FaCheckCircle className="text-green-500" />
        </div>
      )}
    </div>
  );
};

export default JobDescription;
