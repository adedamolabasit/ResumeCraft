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
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = () => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [generatedResume, setGeneratedResume] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [canProceed, setCanProceed] = useState(false);

  const {
    walletAdress,
    handleCid,
    handleLogsData,
    isFileUpload,
  } = useContract();

  const uploadFile = async () => {
    setCanProceed(false);

    if (resumeFile && jobDescription) {
      setResumeFile(null);
      setJobDescription("");
      try {
        setIsUploading(true);
        handleLogsData(["Uploading files into AI Knowledge base"]);
        await new Promise((resolve) => setTimeout(resolve, 4000));
        handleLogsData(["please wait..."]);
        await new Promise((resolve) => setTimeout(resolve, 4000));
        handleLogsData(["Almost there..."]);
        const response = await uploadFileToServer(
          resumeFile,
          walletAdress,
          jobDescription
        );
        [response.message, response.output].forEach((item) => {
          handleLogsData([item]);
        });

        handleLogsData(["Authorize Wallet..."]);
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
  }, [isFileUpload, resumeFile, jobDescription]);


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
      </main>
      <Footer />
      <ToastContainer autoClose={3000} />
    </div>
  );
};

export default Dashboard;
