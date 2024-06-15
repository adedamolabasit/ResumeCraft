import React, { useState } from 'react';
import Navbar from '../components/Common/Navbar';
import Footer from '../components/Common/Footer';
import UploadResume from '../components/Dashboard/UploadResume';
import JobDescription from '../components/Dashboard/JobDescription';
import GeneratedResume from '../components/Dashboard/GeneratedResume';
import AnimatedButton from '../components/Common/AnimatedButton';
// import { Document, Page } from 'react-pdf';
// import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
// import 'react-pdf/dist/esm/Document/Document.css';

const Dashboard = () => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [generatedResume, setGeneratedResume] = useState<string | null>(null);

  const handleGenerateResume = async () => {
    // Logic to handle resume generation
    setGeneratedResume('Generated resume content...');
  };

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
            <AnimatedButton text="Generate Resume" onClick={handleGenerateResume} />
            {generatedResume && <GeneratedResume content={generatedResume} />}
          </div>
          <div className="w-1/2 bg-white p-6 rounded shadow-md">
            {/* {resumeFile && (
              <Document
                file={URL.createObjectURL(resumeFile)}
                onLoadSuccess={onDocumentLoadSuccess}
              >
                {Array.from(new Array(numPages), (el, index) => (
                  <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                ))}
              </Document>
            )} */}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
