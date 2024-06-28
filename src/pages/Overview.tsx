import React, { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaCopy,
  FaDownload,
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

const Overview = () => {
  const { message } = useContract();

  const [rawResume, setRawResume] = useState<string>("");
  const [coverLetter, setCoverLetter] = useState<string>("");
  const [analysis1, setAnalysis1] = useState<string>("");
  const [analysis2, setAnalysis2] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("resume");
  const [downloadFormat, setDownloadFormat] = useState<string>("pdf");

  useEffect(() => {
    const fetchData = async () => {
      if (message) {
        const indices = [2, 4, 6];
        for (const index of indices) {
          if (index >= 0 && index < message.length) {
            let text = message[index];

            // Extract text after the first \n\n and before the last \n\n
            let startIndex = text.indexOf("\n\n");
            let endIndex = text.lastIndexOf("\n\n");
            let processedText = "";

            if (startIndex !== -1 && endIndex !== -1) {
              processedText = text.substring(startIndex + 2, endIndex).trim();
            }

            // Convert Markdown to HTML using marked
            const html = await marked.parse(processedText);

            // Update state based on index
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
              case 8:
                setAnalysis2(html);
                break;
              default:
                break;
            }
          }
        }
      }
    };

    fetchData();
  }, [message]);

  const handleCopy = (content: string, type: string) => {
    navigator.clipboard.writeText(content);
    alert(`${type} copied to clipboard!`);
  };

  const generatePDF = (htmlContent: string, filename: string) => {
    const element = document.createElement("div");
    element.innerHTML = htmlContent;
    document.body.appendChild(element);

    const options = {
      scale: 2, // Increase the scale for better quality
      useCORS: true, // Enable CORS to allow loading of images from different domains
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

  const handleDownload = (content: string, filename: string, format: string) => {
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

  const atsStandards = [
    {
      id: 1,
      icon: <FaCheckCircle className="text-green-500" />,
      text: "Optimized with relevant keywords",
    },
    {
      id: 2,
      icon: <FaCheckCircle className="text-green-500" />,
      text: "Formatted for ATS compatibility",
    },
    {
      id: 3,
      icon: <FaCheckCircle className="text-green-500" />,
      text: "Clean and professional layout",
    },
    {
      id: 4,
      icon: <FaTimesCircle className="text-red-500" />,
      text: "No graphics or images",
    },
    {
      id: 5,
      icon: <BsFileEarmarkText className="text-blue-500" />,
      text: "Text-based format",
    },
    {
      id: 6,
      icon: <IoIosDocument className="text-blue-500" />,
      text: "PDF format",
    },
  ];

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
                        handleDownload(
                          rawResume,
                          "resume",
                          downloadFormat
                        )
                      }
                    />
                    <div className="absolute right-0 mt-2 w-56 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg">
                      <div className="py-1" role="menu">
                        <button
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setDownloadFormat("pdf")}
                        >
                          Download as PDF
                        </button>
                        <button
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setDownloadFormat("docx")}
                        >
                          Download as DOCX
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="resume-content text-center">
                  <div
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: rawResume }}
                  />
                </div>
              </div>
            )}
            {activeTab === "cover_letter" && (
              <div
                className="bg-white rounded-lg shadow-lg p-6 w-full mx-20"
                style={{ width: "60vw", height: "200vh" }}
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
                        handleDownload(
                          coverLetter,
                          "cover_letter",
                          downloadFormat
                        )
                      }
                    />
                    <div className="absolute right-0 mt-2 w-56 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg">
                      <div className="py-1" role="menu">
                        <button
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setDownloadFormat("pdf")}
                        >
                          Download as PDF
                        </button>
                        <button
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setDownloadFormat("docx")}
                        >
                          Download as DOCX
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="cover-letter-content text-center">
                  <div
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: coverLetter }}
                  />
                </div>
              </div>
            )}
            {activeTab === "ats_analysis" && (
              <div className="ats-analysis-content text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  ATS Standards and Changes
                </h3>
                <table className="table-auto w-full text-left mb-4">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">Status</th>
                      <th className="px-4 py-2">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {atsStandards.map((item) => (
                      <tr key={item.id}>
                        <td className="border px-4 py-2">{item.icon}</td>
                        <td className="border px-4 py-2">{item.text}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {analysis1 && (
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">
                      Analysis 1
                    </h3>
                    <div
                      className="text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: analysis1 }}
                    />
                  </div>
                )}
                {analysis2 && (
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">
                      Analysis 2
                    </h3>
                    <div
                      className="text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: analysis2 }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Overview;
