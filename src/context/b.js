// import React, { useEffect, useState } from "react";
// import { useContract } from "../../context/contractContext";



// const LogCard: React.FC = () => {
//   const {logs} = useContract()
//   const [loading, setLoading] = useState(true);
//   const {} = useContract();

//   useEffect(() => {
//     // Fetch logs from the backend
//     const fetchLogs = async () => {
//       try {
//         const response = await fetch("/api/logs"); // Replace with your actual API endpoint
//         const data = await response.json();

//       } catch (error) {
//         console.error("Error fetching logs:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchLogs();
//   }, []);

//   return (
//     <div className="bg-black text-white p-4 rounded-lg shadow-lg overflow-y-auto h-full overflow-y-scroll">
//       {loading ? (
//         <p className="text-center text-lg">Loading...</p>
//       ) : (
//         <ul className="space-y-2">
//           {logs.map((log: any, index: any) => (
//             <li key={index} className="p-2 bg-gray-800 rounded-md text-white">
//               {log}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default LogCard;
