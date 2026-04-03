with open('frontend/src/pages/Analytics.jsx', 'w', encoding='utf-8') as f:
    f.write('''import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Database, Star, Smile, Zap, Sparkles } from 'lucide-react';

export default function Analytics() {
   const [data, setData] = React.useState(null);

   React.useEffect(() => {
      const fetchData = () => {
         fetch('http://localhost:8000/api/analytics')
         .then(res => res.json())
         .then(d => setData(d))
         .catch(e => console.error(e));
      };

      fetchData();
      
      // Live updates every 5 seconds
      const intervalId = setInterval(fetchData, 5000);
      return () => clearInterval(intervalId);
   }, []);

   const totalScraped = data?.total_scraped || 0;
   const avgRating = data?.avg_rating || 0;
   const sentimentScore = data?.sentiment_score || 0;
   const latency = data?.latency || 0;

   const renderStars = (rating) => {
      const fullStars = Math.floor(rating);
      return [1, 2, 3, 4, 5].map(i => (
         <Star key={i} size={14} fill={i <= fullStars ? "#CCBFF3" : "transparent"} color={i <= fullStars ? "#CCBFF3" : "#4a4a5a"} />
      ));
   };

   return (
      <div className="min-h-screen bg-[#111016] text-gray-200 font-sans flex flex-col items-center">
         <Navbar activeTab="Analytics" />
         <main className="flex-1 w-full max-w-[1200px] px-4 py-12 flex flex-col gap-6">
            {/* Header Section */}
            <div className="flex justify-between items-end mb-4">
               <div>
                  <h1 className="text-4xl font-extrabold tracking-tight text-[#CCBFF3] mb-2">Review Analytics</h1>
                  <p className="text-gray-400 text-sm">Real-time sentiment insights powered by your Database</p>
               </div>
               <div className="flex items-center gap-2 bg-[#1C1B22] border border-[#2a2a35] px-4 py-2 rounded-lg text-sm text-gray-300">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                  <span>Live Sync</span>
               </div>
            </div>

            {/* 4 Stats Cards */}
            <div className="grid grid-cols-4 gap-6 mb-4">
               <div className="bg-[#1C1B22] border border-[#2a2a35] rounded-xl p-6 transition-all hover:border-[#625885]">
                  <div className="flex justify-between items-center text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                     <span>Total Scraped</span>
                     <Database size={16} />
                  </div>
                  <div className="text-4xl font-bold text-white mb-1">{totalScraped.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">Rows in local database</div>
               </div>
               
               <div className="bg-[#1C1B22] border border-[#2a2a35] rounded-xl p-6 transition-all hover:border-[#625885]">
                  <div className="flex justify-between items-center text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                     <span>Avg Score</span>
                     <Star size={16} />
                  </div>
                  <div className="text-4xl font-bold text-white mb-2">{avgRating.toFixed(1)} <span className="text-base font-normal text-gray-500">/ 5.0</span></div>
                  <div className="flex gap-1">
                     {renderStars(avgRating)}
                  </div>
               </div>
               
               <div className="bg-[#1C1B22] border border-[#2a2a35] rounded-xl p-6 relative overflow-hidden transition-all hover:border-[#CCBFF3]">
                  <div className="flex justify-between items-center text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                     <span>Sentiment Score</span>
                     <Smile size={16} />
                  </div>
                  <div className="text-4xl font-bold text-white mb-4">{sentimentScore}<span className="text-2xl">%</span></div>
                  <div className="w-full bg-[#111016] rounded-full h-1.5 mt-auto">
                     <div className="bg-[#CCBFF3] h-1.5 rounded-full shadow-[0_0_10px_#CCBFF3] transition-all duration-1000" style={{ width: `${sentimentScore}%` }}></div>
                  </div>
               </div>
               
               <div className="bg-[#1C1B22] border border-[#2a2a35] rounded-xl p-6 transition-all hover:border-[#625885]">
                  <div className="flex justify-between items-center text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                     <span>System Latency</span>
                     <Zap size={16} />
                  </div>
                  <div className="text-4xl font-bold text-white mb-1">{latency}<span className="text-2xl">ms</span></div>
                  <div className="text-xs text-gray-500">API response time</div>
               </div>
            </div>

            {/* AI Analysis Built-in Banner */}
            <div className="bg-gradient-to-r from-[#1C1B22] to-[#1c1b26] border border-[#2a2a35] rounded-xl p-8 flex w-full items-center justify-between shadow-xl">
               <div className="flex items-center gap-6">
                  <div className="h-16 w-16 rounded-full bg-[#CCBFF3]/10 flex items-center justify-center">
                     <Sparkles className="text-[#CCBFF3]" size={32} />
                  </div>
                  <div>
                     <h2 className="text-2xl font-bold text-white mb-1">Lexicon NLP Engine Active</h2>
                     <p className="text-gray-400">Tokens are correctly mapping to sentiment polarities in real time via local processing.</p>
                  </div>
               </div>
            </div>
         </main>
         <Footer />
      </div>
   );
}''')
