import React, { useEffect, useState } from "react";
import Navbar from "../components/Common/Navbar";
import Footer from "../components/Common/Footer";
import UploadResume from "../components/Dashboard/UploadResume";
import JobDescription from "../components/Dashboard/JobDescription";
import GeneratedResume from "../components/Dashboard/GeneratedResume";
import AnimatedButton from "../components/Common/AnimatedButton";
import { uploadFileToServer } from "../services/api";
import { useContract } from "../context/contractContext";
import LogCard from "../components/Dashboard/LogCard"; // Adjust the import path as needed

const Dashboard = () => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [generatedResume, setGeneratedResume] = useState<string | null>(null);

  const { generateResumeContent, walletAdress, handleCid, handleLogsData, cid } = useContract();

  const handleGenerateResume = async () => {
    setGeneratedResume("Generated resume content");
    generateResumeContent(jobDescription);
  };

  useEffect(() => {
    const uploadFile = async () => {
      if (resumeFile) {
        try {
          handleLogsData(["uploading resume file into knowledge base ..."])
          const response = await uploadFileToServer(resumeFile, walletAdress);
          handleLogsData([response.message, response.output])
          handleLogsData(["Authorize wallet to save resume file onchain "])
          handleCid(response.cid);
        } catch (err) {
          console.log("Error uploading file:", err);
        }
      }
    };

    uploadFile();
  }, [resumeFile]);

  const onDocumentLoadSuccess = () => {
    setNumPages(numPages);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow p-8 bg-gray-100">
        <div className="container mx-auto flex">
          <div className="w-1/2 bg-white p-6 rounded shadow-md mr-4">
            <UploadResume onFileUpload={setResumeFile} />
            <JobDescription onDescriptionChange={setJobDescription} />
            <AnimatedButton
              text="Generate Resume"
              onClick={handleGenerateResume}
            />
            {generatedResume && <GeneratedResume content={generatedResume} />}
          </div>
          <div className="w-1/2 bg-white p-6 rounded shadow-md">
            <LogCard />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
