import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ activeTab }) {
  return (
    <nav className="w-full flex justify-between items-center py-4 px-8 border-b border-[#2a2a35] bg-[#111016]">
      <div className="font-bold text-xl tracking-wide text-white uppercase">Obsidian Lens</div>

      <div className="flex space-x-6 text-sm font-medium uppercase tracking-wider text-gray-500 mt-1">
        <Link to="/" className={`pb-1 transition ${activeTab === 'Dashboard' ? 'border-b-2 border-[#CCBFF3] text-white' : 'hover:text-gray-200'}`}>Dashboard</Link>
        <Link to="/products" className={`pb-1 transition ${activeTab === 'Products' ? 'border-b-2 border-[#CCBFF3] text-white' : 'hover:text-gray-200'}`}>Products</Link>
        <Link to="/jobs" className={`pb-1 transition ${activeTab === 'Jobs' ? 'border-b-2 border-[#CCBFF3] text-white' : 'hover:text-gray-200'}`}>Jobs</Link>
        <Link to="/analytics" className={`pb-1 transition ${activeTab === 'Analytics' ? 'border-b-2 border-[#CCBFF3] text-white' : 'hover:text-gray-200'}`}>Analytics</Link>
        <Link to="/history" className={`pb-1 transition ${activeTab === 'History' ? 'border-b-2 border-[#CCBFF3] text-white' : 'hover:text-gray-200'}`}>History</Link>
      </div>
    </nav>
  );
}



