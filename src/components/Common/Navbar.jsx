import { Link } from 'react-router-dom';
import { useContract } from '../../context/contractContext';
import { motion } from 'framer-motion';
import { FaArrowRight, FaRobot } from 'react-icons/fa';

const Navbar = () => {
  const {connectToWallet} = useContract()
  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">ResumeGen</Link>
      
        <div className="space-x-4" onClick={connectToWallet}>
          <div onClick={connectToWallet} className="text-white hover:underline cursor-pointer">Connect Wallet</div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
