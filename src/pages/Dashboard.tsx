import { useEffect, useState } from "react";
import Navbar from "../components/Common/Navbar";
import Footer from "../components/Common/Footer";
import UploadResume from "../components/Dashboard/UploadResume";
import JobDescription from "../components/Dashboard/JobDescription";
import GeneratedResume from "../components/Dashboard/GeneratedResume";
import AnimatedButton from "../components/Common/AnimatedButton";
import { uploadFileToServer } from "../services/api";
import { useContract } from "../context/contractContext";
import LogCard from "../components/Dashboard/LogCard";
import InfoCard from "../components/Dashboard/InfoCard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaRobot } from "react-icons/fa";

const Dashboard = () => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [generatedResume, setGeneratedResume] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [canProceed, setCanProceed] = useState(false);
  const [showStickyDialog, setShowStickyDialog] = useState<boolean>(false);

  const { walletAddress, handleCid, handleLogsData, isFileUpload } =
    useContract();

  const uploadFile = async () => {
    setCanProceed(false);

    if (resumeFile && jobDescription) {
      setResumeFile(null);
      setJobDescription("");
      try {
        setIsUploading(true);
        handleLogsData(["Initiating file upload to AI Knowledge Base..."]);
        await new Promise((resolve) => setTimeout(resolve, 4000));
        handleLogsData(["Uploading files, please wait..."]);
        await new Promise((resolve) => setTimeout(resolve, 4000));
        handleLogsData(["Files almost uploaded..."]);
        await new Promise((resolve) => setTimeout(resolve, 6000));
        handleLogsData(["uploading..."]);
        const response = await uploadFileToServer(
          resumeFile,
          walletAddress,
          jobDescription
        );
        [response.message, response.output].forEach((item) => {
          handleLogsData([item]);
        });

        handleLogsData(["Please Authorize your wallet"]);
        handleCid(response.cid);
      } catch (err) {
        console.log("Error uploading file:", err);
        setIsUploading(false);
      }
    }
  };

  useEffect(() => {
    setCanProceed(false);
    if (isFileUpload) {
      setGeneratedResume(
        "Click the button to use AI and generate a new resume tailored to your job description."
      );
      setIsUploading(false);
    }
    if (resumeFile && jobDescription) {
      setCanProceed(true);
    }
    if (walletAddress === null) {
      setShowStickyDialog(true);
    }else{
      setShowStickyDialog(false);
    }
  }, [isFileUpload, resumeFile, jobDescription, walletAddress]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow p-8 bg-gray-100 flex">
        <div className="container mx-auto flex flex-grow">
          <div className="w-1/2 bg-white p-6 rounded shadow-md mr-4 flex flex-col h-full">
            <UploadResume onFileUpload={setResumeFile} />
            <JobDescription
              onDescriptionChange={setJobDescription}
              jobDescription={jobDescription}
            />
            <AnimatedButton
              text="Upload Documents"
              onClick={uploadFile}
              canProceed={canProceed}
            />
            {generatedResume && <GeneratedResume content={generatedResume} />}
          </div>
          <div className="w-1/2 bg-white p-6 rounded shadow-md flex flex-col h-full">
            {isUploading ? <LogCard /> : <InfoCard />}
          </div>
        </div>
        {showStickyDialog && (
          <div className="fixed bottom-0 right-0 m-4 bg-yellow-200 text-yellow-800 p-4 rounded-lg shadow-lg text-right z-50 flex items-center max-w-lg gap-2">
            <div className="flex flex-col items-center ">
              <button
                className="ml-4 px-4 py-2 bg-yellow-300 text-yellow-900 rounded"
                onClick={() => setShowStickyDialog(false)}
              >
                Close
              </button>
            </div>
            <div className="w-full">
              <div className="flex gap-2 justify-end items-center">
                <FaRobot className="text-yellow-800 mr-2" />
                <p className="font-bold">Attention!</p>
              </div>
              <p>
                Please connect your wallet address before proceeding. Without a
                connected wallet address, you will not be able to continue.
              </p>
            </div>
          </div>
        )}
      </main>
      <Footer />
      <ToastContainer autoClose={3000} />
    </div>
  );
};

export default Dashboard;
