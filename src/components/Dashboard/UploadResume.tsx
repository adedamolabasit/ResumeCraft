import {useEffect} from 'react';
import { FaUpload } from 'react-icons/fa';
import io from 'socket.io-client';


const UploadResume:React.FC<any> = ({ onFileUpload }) => {

  const socket = io('http://127.0.0.1:8000/upload');

  useEffect(() => {
    socket.on('connect', () => {
        console.log('Connected to WebSocket');
    });

    socket.on('script_output', (data: any) => {
        console.log('Script output event received:', data);
        // Handle the received data (output or error) as needed
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from WebSocket');
    });

    return () => {
        socket.disconnect(); // Clean up on unmount
    };
}, []);

  return (
    <div className="mb-4">
      <label className="block mb-2 text-sm font-bold">Upload your resume</label>
      <div className="flex items-center">
        <label className="w-full flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue-500 hover:text-white">
          <FaUpload className="text-3xl" />
          <span className="mt-2 text-base leading-normal">Select a file</span>
          <input
            type="file"
            className="hidden"
            onChange={(e) => onFileUpload(e.target.files ? e.target.files[0] : null)}
          />
        </label>
      </div>
    </div>
  );
};

export default UploadResume;
