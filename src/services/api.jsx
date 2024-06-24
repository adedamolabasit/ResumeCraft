import axiosInstance from './axiosInstance';
const axios = require('axios');

export const uploadFileToServer = async (file, address) => {
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);  // Make sure the key matches the Flask backend
  formData.append('address', address)

  try {
    const response = await axiosInstance.post('/upload/', formData, {
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

export const getDataFromPinata = async (cid) => {
  try {
    const url = `https://gateway.pinata.cloud/ipfs/${cid}`;
    const response = await axios.get(url);

    if (response.status === 200) {
      console.log("Data retrieved successfully:", response.data);
      return response.data;
    } else {
      console.error("Failed to retrieve data:", response.status, response.statusText);
      return null;
    }
  } catch (error) {
    console.error("Error fetching data from Pinata:", error);
    return null;
  }
};

// Example usage:
// (async () => {
//   const cid = 'QmXGL96tsxR3HCBd7yDAPKsTSsvSr4cQKcCyNLSL1zw6s9';
//   const data = await getDataFromPinata(cid);
//   console.log("Retrieved Data:", data);
// })();
