import axiosInstance from './axiosInstance';

export const uploadFileToServer = async (file) => {
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);  // Make sure the key matches the Flask backend

  try {
    const response = await axiosInstance.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};
