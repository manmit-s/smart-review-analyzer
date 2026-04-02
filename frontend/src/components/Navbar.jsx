import React from 'react';
import { Bell, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar({ activeTab }) {
  return (
    <nav className="w-full flex justify-between items-center py-4 px-8 border-b border-[#2a2a35] bg-[#111016]">
      <div className="flex flex-row items-center space-x-8">
        <div className="font-bold text-xl tracking-wide text-white uppercase">SteamReview Analyzer</div>
        <div className="flex space-x-6 text-sm font-medium uppercase tracking-wider text-gray-500 mt-1">
          <Link to="/" className={`pb-1 transition ${activeTab === 'Dashboard' ? 'border-b-2 border-[#CCBFF3] text-white' : 'hover:text-gray-200'}`}>Dashboard</Link>
          <Link to="/analytics" className={`pb-1 transition ${activeTab === 'Analytics' ? 'border-b-2 border-[#CCBFF3] text-white' : 'hover:text-gray-200'}`}>Analytics</Link>
          <Link to="#" className={`pb-1 transition ${activeTab === 'History' ? 'border-b-2 border-[#CCBFF3] text-white' : 'hover:text-gray-200'}`}>History</Link>
        </div>
      </div>
      <div className="flex space-x-4">
        <button className="p-2 text-gray-400 hover:text-white rounded-full hover:shadow-[0_0_10px_#CCBFF3] transition bg-[#1C1B22] border border-[#2a2a35]"><Bell size={18} /></button>
        <button className="p-2 text-gray-400 hover:text-white rounded-full hover:shadow-[0_0_10px_#CCBFF3] transition bg-[#1C1B22] border border-[#2a2a35]"><User size={18} /></button>
      </div>
    </nav>
  );
}



