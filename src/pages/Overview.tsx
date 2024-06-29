import { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaCopy,
  FaDownload,
  FaRobot,
} from "react-icons/fa";
import { BsFileEarmarkText } from "react-icons/bs";
import { IoIosDocument } from "react-icons/io";
import Navbar from "../components/Common/Navbar";
import Footer from "../components/Common/Footer";
import { useContract } from "../context/contractContext";
import * as marked from "marked";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";

const Overview = () => {
  const { message, isResume } = useContract();
  const navigate = useNavigate();

  const [rawResume, setRawResume] = useState<string>("");
  const [coverLetter, setCoverLetter] = useState<string>("");
  const [analysis1, setAnalysis1] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("resume");
  const [downloadFormat, setDownloadFormat] = useState<string>("pdf");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showDownloadOptions, setShowDownloadOptions] =
    useState<boolean>(false);
  const [showStickyDialog, setShowStickyDialog] = useState<boolean>(true);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const indices = [2, 4, 6];
        for (const index of indices) {
          if (index >= 0 && index < message.length) {
            let text = message[index];
            let startIndex = text.indexOf("\n\n");
            let endIndex = text.lastIndexOf("\n\n");
            let processedText = "";

            if (startIndex !== -1 && endIndex !== -1) {
              processedText = text.substring(startIndex + 2, endIndex).trim();
            }

            const html = await marked.parse(processedText);

            switch (index) {
              case 2:
                setRawResume(html);
                break;
              case 4:
                setCoverLetter(html);
                break;
              case 6:
                setAnalysis1(html);
                break;
              default:
                break;
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!message) {
      if (isResume) {
        setIsLoading(true);
      } else {
        navigate("/dashboard");
      }
    } else {
      fetchData();
    }

    const handleBeforeUnload = (event: any) => {
      event.preventDefault();
      event.returnValue =
        "You have unsaved changes. Are you sure you want to leave?";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [message, isResume, navigate]);

  const handleCopy = (content: string, type: string) => {
    navigator.clipboard.writeText(content);
    alert(`${type} copied to clipboard!`);
  };
 

  const generatePDF = (htmlContent: string, filename: string) => {
    const element = document.createElement("div");
    element.innerHTML = htmlContent;
    element.style.textAlign = "center";
    document.body.appendChild(element);

    const options = {
      scale: 2,
      useCORS: true,
    };

   

    html2canvas(element, options).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(filename);
      document.body.removeChild(element);
    });
  };

  const handleDownload = (
    content: string,
    filename: string,
    format: string
  ) => {
    if (format === "pdf") {
      generatePDF(content, `${filename}.pdf`);
    } else if (format === "docx") {
      const element = document.createElement("div");
      element.innerHTML = content;
      const textContent = element.innerText;
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                alignment: "center",
                children: [new TextRun(textContent)],
              }),
            ],
          },
        ],
      });

      Packer.toBlob(doc).then((blob) => {
        saveAs(blob, `${filename}.docx`);
      });
    }
  };

  const switchTab = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <section className="bg-gray-100 py-12">
        <div className="container mx-auto text-center h-full overflow-y-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Resume and Cover Letter Previews
          </h2>
          <div className="flex justify-center space-x-4 mb-8">
            <button
              className={`py-2 px-4 rounded-lg ${
                activeTab === "resume"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-700"
              }`}
              onClick={() => switchTab("resume")}
            >
              Resume
            </button>
            <button
              className={`py-2 px-4 rounded-lg ${
                activeTab === "cover_letter"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-700"
              }`}
              onClick={() => switchTab("cover_letter")}
            >
              Cover Letter
            </button>
            <button
              className={`py-2 px-4 rounded-lg ${
                activeTab === "ats_analysis"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-700"
              }`}
              onClick={() => switchTab("ats_analysis")}
            >
              ATS Analysis
            </button>
          </div>
          <div className="flex justify-center space-x-8 scale-y-90 scale-x-75">
            {activeTab === "resume" && (
              <div
                className="bg-white rounded-lg shadow-lg p-6 w-full mx-20"
                style={{ width: "60vw", height: "300vh" }}
              >
                <div className="flex justify-between items-center mb-4">
                  <FaCopy
                    className="text-blue-500 cursor-pointer"
                    onClick={() => handleCopy(rawResume, "Resume")}
                  />
                  <div className="relative inline-block text-left">
                    <FaDownload
                      className="text-blue-500 cursor-pointer"
                      onClick={() =>
                        setShowDownloadOptions(!showDownloadOptions)
                      }
                    />
                    {showDownloadOptions && (
                      <div className="absolute right-0 mt-2 w-56 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg">
                        <div className="py-1" role="menu">
                          <button
                            className={`block px-4 py-2 text-sm ${
                              downloadFormat === "pdf"
                                ? "text-blue-700 font-bold"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                            onClick={() => {
                              setDownloadFormat("pdf");
                              handleDownload(rawResume, "resume", "pdf");
                            }}
                          >
                            Download as PDF
                          </button>
                          <button
                            className={`block px-4 py-2 text-sm ${
                              downloadFormat === "docx"
                                ? "text-blue-700 font-bold"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                            onClick={() => {
                              setDownloadFormat("docx");
                              handleDownload(rawResume, "resume", "docx");
                            }}
                          >
                            Download as DOCX
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
                  </div>
                ) : (
                  <div
                    className="resume-content text-center"
                    dangerouslySetInnerHTML={{ __html: rawResume }}
                  />
                )}
              </div>
            )}
            {activeTab === "cover_letter" && (
              <div
                className="bg-white rounded-lg shadow-lg p-6 w-full mx-20"
                style={{ width: "60vw", height: "300vh" }}
              >
                <div className="flex justify-between items-center mb-4">
                  <FaCopy
                    className="text-blue-500 cursor-pointer"
                    onClick={() => handleCopy(coverLetter, "Cover Letter")}
                  />
                  <div className="relative inline-block text-left">
                    <FaDownload
                      className="text-blue-500 cursor-pointer"
                      onClick={() =>
                        setShowDownloadOptions(!showDownloadOptions)
                      }
                    />
                    {showDownloadOptions && (
                      <div className="absolute right-0 mt-2 w-56 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg">
                        <div className="py-1" role="menu">
                          <button
                            className={`block px-4 py-2 text-sm ${
                              downloadFormat === "pdf"
                                ? "text-blue-700 font-bold"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                            onClick={() => {
                              setDownloadFormat("pdf");
                              handleDownload(
                                coverLetter,
                                "cover_letter",
                                "pdf"
                              );
                            }}
                          >
                            Download as PDF
                          </button>
                          <button
                            className={`block px-4 py-2 text-sm ${
                              downloadFormat === "docx"
                                ? "text-blue-700 font-bold"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                            onClick={() => {
                              setDownloadFormat("docx");
                              handleDownload(
                                coverLetter,
                                "cover_letter",
                                "docx"
                              );
                            }}
                          >
                            Download as DOCX
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
                  </div>
                ) : (
                  <div
                    className="cover-letter-content text-center"
                    dangerouslySetInnerHTML={{ __html: coverLetter }}
                  />
                )}
              </div>
            )}
            {activeTab === "ats_analysis" && (
              <div
                className="bg-white rounded-lg shadow-lg p-6 w-full mx-20 overflow-y-scroll"
                style={{ width: "60vw", maxHeight: "400vh", overflowY: "auto" }}
              >
                <h3 className="text-xl font-bold mb-4">ATS Analysis</h3>
                <div dangerouslySetInnerHTML={{ __html: analysis1 }} />
              </div>
            )}
          </div>
        </div>
      </section>

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

            <p>Please download your resume and cover letter before navigating away or refreshing the page to avoid losing your generated files.</p>
          </div>
        </div>
      )}

      {/* Your Footer component */}
      <Footer />
    </div>
  );
};

export default Overview;
