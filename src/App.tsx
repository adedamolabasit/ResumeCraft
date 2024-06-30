import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Overview from './pages/Overview';
import { wakeServer } from './services/api'; 
import 'tailwindcss/tailwind.css';

const App = () => {
  useEffect(() => {
    const wakeUpServerInterval = setInterval(async () => {
      try {
        await wakeServer();
        console.log("Server wake-up successful at", new Date().toLocaleTimeString());
      } catch (error) {
        console.error("Error waking up server:", error);
      }
    }, 120000); 

    return () => clearInterval(wakeUpServerInterval);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/overview" element={<Overview />} />
      </Routes>
    </Router>
  );
};

export default App;
