import React, { useState } from 'react';
import { Bell, User, Link as LinkIcon, ChevronDown, Activity, Download, Eye, MoreVertical, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Dashboard() {
  const [url, setUrl] = useState('');
  
  return (
    <div className="min-h-screen bg-[#111016] text-gray-200 font-sans flex flex-col items-center">
      <Navbar activeTab="Dashboard" />
      <main className="flex-1 w-full max-w-5xl px-4 py-12 flex flex-col items-center gap-10">
        
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#625885] to-[#CCBFF3] pb-2">The Obsidian Lens</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Extract precise analytical insights from Steam product reviews with our high-fidelity scraper engine.
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-[#1C1B22] w-full border border-[#2a2a35] rounded-xl p-8 shadow-2xl space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Product URL or ID</label>
            <div className="relative">
              <input
                type="text"
                placeholder="https://store.steampowered.com/app/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-[#111016] text-white border border-[#2a2a35] rounded-lg p-3 pr-10 focus:outline-none focus:border-[#625885] transition"
              />
              <LinkIcon className="absolute right-3 top-3.5 text-gray-500" size={18} />
            </div>
          </div>
          <div className="flex gap-6">
            <div className="w-1/2 space-y-2">
              <label className="text-sm font-medium text-gray-400">Max Reviews</label>
              <div className="relative border border-[#2a2a35] rounded-lg bg-[#111016]">
                <select className="w-full appearance-none bg-transparent p-3 text-white focus:outline-none">
                  <option className="bg-[#1C1B22] text-white">100 Reviews</option>
                  <option className="bg-[#1C1B22] text-white">500 Reviews</option>
                  <option className="bg-[#1C1B22] text-white">1000 Reviews</option>
                </select>
                <ChevronDown className="absolute right-3 top-3.5 text-gray-500 pointer-events-none" size={18} />
              </div>
            </div>
            <div className="w-1/2 space-y-2">
              <label className="text-sm font-medium text-gray-400">Sort Preference</label>
              <div className="relative border border-[#2a2a35] rounded-lg bg-[#111016]">
                <select className="w-full appearance-none bg-transparent p-3 text-white focus:outline-none">
                  <option className="bg-[#1C1B22] text-white">Most Helpful</option>
                  <option className="bg-[#1C1B22] text-white">Most Recent</option>
                </select>
                <ChevronDown className="absolute right-3 top-3.5 text-gray-500 pointer-events-none" size={18} />
              </div>
            </div>
          </div>
          <button className="w-full bg-gradient-to-r from-[#625885] to-[#CCBFF3] hover:opacity-90 hover:shadow-[0_0_10px_#CCBFF3] transition rounded-lg p-3 font-semibold text-white shadow-lg">
            Start Extraction
          </button>
        </div>

        {/* Stats Section */}
        <div className="w-full flex gap-6">
          <div className="bg-[#1C1B22] border border-[#2a2a35] rounded-xl p-6 flex-1 relative overflow-hidden">
            <h3 className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-2 flex justify-between">Global Status <Activity size={14} className="text-gray-400"/></h3>
            <div className="text-3xl font-bold text-white mb-4">4.8k <span className="text-sm font-normal text-gray-400">Total Reviews</span></div>
            <div className="w-full bg-[#111016] rounded-full h-1 mt-auto">
              <div className="bg-[#625885] h-1 rounded-full w-[65%] shadow-[0_0_10px_#625885]"></div>
            </div>
          </div>
          <div className="bg-[#1C1B22] border border-[#2a2a35] rounded-xl p-6 flex-[2] flex justify-between items-end">
            <div>
               <h3 className="text-xs text-gray-500 mb-1">System Latency</h3>
               <div className="text-2xl font-bold text-white">142<span className="text-sm font-normal text-gray-400">ms</span></div>
            </div>
            <div>
               <h3 className="text-xs text-gray-500 mb-1">Extraction Rate</h3>
               <div className="text-2xl font-bold text-white">98.2<span className="text-sm font-normal text-gray-400">%</span></div>
            </div>
            <div>
               <h3 className="text-xs text-gray-500 mb-1">Queue Position</h3>
               <div className="text-2xl font-bold text-white">#0</div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="w-full space-y-4 mt-4">
          <div className="flex justify-between items-center px-1">
             <h2 className="text-2xl font-bold text-white">Recent Extractions</h2>
             <div className="flex gap-3">
               <button className="flex items-center gap-2 px-4 py-2 bg-[#1C1B22] border border-[#2a2a35] rounded-lg text-sm hover:bg-[#2a2a35] hover:shadow-[0_0_10px_#CCBFF3] transition"><Download size={16}/> Export CSV</button>
               <button className="flex items-center gap-2 px-4 py-2 bg-[#1C1B22] border border-[#2a2a35] rounded-lg text-sm hover:bg-[#2a2a35] hover:shadow-[0_0_10px_#CCBFF3] transition"><Eye size={16}/> View Full Report</button>
             </div>
          </div>
          <div className="bg-[#1C1B22] border border-[#2a2a35] rounded-xl flex flex-col overflow-hidden">
             {/* Header */}
             <div className="px-6 py-4 grid grid-cols-[1fr_1fr_3fr_1fr_auto] gap-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-[#2a2a35] bg-[#1a1a23]">
                <div>Reviewer</div>
                <div>Rating</div>
                <div>Review Content</div>
                <div className="text-center">Sentiment</div>
                <div>Actions</div>
             </div>
             {/* Rows */}
             <div className="divide-y divide-[#2a2a35]">
                {/* Row 1 */}
                <div className="px-6 py-4 grid grid-cols-[1fr_1fr_3fr_1fr_auto] gap-4 items-center">
                   <div className="flex items-center gap-3">
                     <div className="h-8 w-8 rounded-full bg-[#2a2a35] flex items-center justify-center text-xs font-bold text-[#CCBFF3]">AK</div>
                     <div className="font-medium text-gray-200">Ananya K.</div>
                   </div>
                   <div className="flex text-gray-400">
                     {[1,2,3,4,5].map(i => <Star key={i} size={12} fill="#CCBFF3" color="#CCBFF3" />)}
                   </div>
                   <div className="text-sm text-gray-400 truncate pr-8">The graphics quality exceeded my expectations. Runs perfectly and looks...</div>
                   <div className="flex justify-center">
                      <span className="px-3 py-1 bg-[#2a2a35] border border-[#3e3e4a] text-[#CCBFF3] rounded-full text-xs font-medium">Positive</span>
                   </div>
                   <div className="text-gray-500 cursor-pointer hover:text-white px-2"><MoreVertical size={16}/></div>
                </div>
                {/* Row 2 */}
                <div className="px-6 py-4 grid grid-cols-[1fr_1fr_3fr_1fr_auto] gap-4 items-center">
                   <div className="flex items-center gap-3">
                     <div className="h-8 w-8 rounded-full bg-[#2a2a35] flex items-center justify-center text-xs font-bold text-gray-400">RV</div>
                     <div className="font-medium text-gray-200">Rohan V.</div>
                   </div>
                   <div className="flex text-gray-400">
                     {[1,2,3,4,5].map(i => <Star key={i} size={12} fill={i<4?"#CCBFF3":"transparent"} color={i<4?"#CCBFF3":"#4a4a5a"} />)}
                   </div>
                   <div className="text-sm text-gray-400 truncate pr-8">Gameplay was slightly delayed but the story is decent for the price point.</div>
                   <div className="flex justify-center">
                      <span className="px-3 py-1 bg-[#2a2a35] border border-[#3e3e4a] text-gray-400 rounded-full text-xs font-medium">Neutral</span>
                   </div>
                   <div className="text-gray-500 cursor-pointer hover:text-white px-2"><MoreVertical size={16}/></div>
                </div>
                {/* Row 3 */}
                <div className="px-6 py-4 grid grid-cols-[1fr_1fr_3fr_1fr_auto] gap-4 items-center">
                   <div className="flex items-center gap-3">
                     <div className="h-8 w-8 rounded-full bg-red-900/30 flex items-center justify-center text-xs font-bold text-red-400">SM</div>
                     <div className="font-medium text-gray-200">Sara M.</div>
                   </div>
                   <div className="flex text-gray-400">
                     {[1,2,3,4,5].map(i => <Star key={i} size={12} fill={i<2?"#CCBFF3":"transparent"} color={i<2?"#CCBFF3":"#4a4a5a"} />)}
                   </div>
                   <div className="text-sm text-gray-400 truncate pr-8">The performance is completely off. I ordered an RTX but it feels like an integrated...</div>
                   <div className="flex justify-center">
                      <span className="px-3 py-1 bg-red-900/20 border border-red-900/50 text-red-400 rounded-full text-xs font-medium">Negative</span>
                   </div>
                   <div className="text-gray-500 cursor-pointer hover:text-white px-2"><MoreVertical size={16}/></div>
                </div>
             </div>
          </div>
          
          {/* Pagination */}
          <div className="flex justify-between items-center text-sm text-gray-500 mt-2 px-1">
             <div>Showing 3 of 152 extraction results</div>
             <div className="flex gap-2">
                <button className="h-8 w-8 rounded bg-[#1C1B22] border border-[#2a2a35] flex items-center justify-center hover:bg-[#2a2a35]"><ChevronLeft size={16}/></button>
                <button className="h-8 w-8 rounded bg-[#625885] text-white flex items-center justify-center font-medium">1</button>
                <button className="h-8 w-8 rounded bg-[#1C1B22] border border-[#2a2a35] flex items-center justify-center hover:bg-[#2a2a35] hover:text-white text-gray-400 font-medium">2</button>
                <button className="h-8 w-8 rounded bg-[#1C1B22] border border-[#2a2a35] flex items-center justify-center hover:bg-[#2a2a35] hover:text-white text-gray-400 font-medium">3</button>
                <button className="h-8 w-8 rounded bg-[#1C1B22] border border-[#2a2a35] flex items-center justify-center hover:bg-[#2a2a35]"><ChevronRight size={16}/></button>
             </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}



