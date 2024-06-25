import axiosInstance from "./axiosInstance";

export const uploadFileToServer = async (resumeFile, walletAddress, jobDescription) => {
  if (!resumeFile) return;

  const formData = new FormData();
  formData.append("file", resumeFile);
  formData.append("json_data", JSON.stringify({ address: "folder", job_description: jobDescription }));

  try {
    const response = await axiosInstance.post("/upload/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};
