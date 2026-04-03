import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Calendar, Database, Star, Smile, Zap, Sparkles, ArrowRight } from 'lucide-react';

export default function Analytics() {
   const [data, setData] = React.useState(null);

   React.useEffect(() => {
      fetch('http://localhost:8000/api/analytics')
         .then(res => res.json())
         .then(d => setData(d))
         .catch(e => console.error(e));
   }, []);

   const totalScraped = data?.total_scraped || 1245679;
   const recentStats = data?.recent_stats || { positive: 0, negative: 0, neutral: 0 };
   const { positive, negative, neutral } = recentStats;
   const totalRecent = (positive + negative + neutral) || 1;
   const posRate = ((positive / totalRecent) * 100).toFixed(1) + "%";

   return (
      <div className="min-h-screen bg-[#111016] text-gray-200 font-sans flex flex-col items-center">
         <Navbar activeTab="Analytics" />
         <main className="flex-1 w-full max-w-[1200px] px-4 py-12 flex flex-col gap-6">

            {/* Header Section */}
            <div className="flex justify-between items-end mb-4">
               <div>
                  <h1 className="text-4xl font-extrabold tracking-tight text-[#CCBFF3] mb-2">Review Analytics</h1>
                  <p className="text-gray-400 text-sm">Real-time sentiment insights for Steam Catalog</p>
               </div>
               <div className="flex items-center gap-2 bg-[#1C1B22] border border-[#2a2a35] px-4 py-2 rounded-lg text-sm text-gray-300">
                  <Calendar size={16} className="text-gray-400" />
                  <span>Oct 01, 2026 - Oct 31, 2026</span>
               </div>
            </div>

            {/* 4 Stats Cards */}
            <div className="grid grid-cols-4 gap-6">
               <div className="bg-[#1C1B22] border border-[#2a2a35] rounded-xl p-6">
                  <div className="flex justify-between items-center text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                     <span>Total Scraped</span>
                     <Database size={16} />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">12,842</div>
                  <div className="text-xs text-gray-500"><span className="text-[#CCBFF3]">&#8599; +14%</span> from last month</div>
               </div>
               <div className="bg-[#1C1B22] border border-[#2a2a35] rounded-xl p-6">
                  <div className="flex justify-between items-center text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                     <span>Avg Rating</span>
                     <Star size={16} />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">4.8 <span className="text-sm font-normal text-gray-500">/ 5.0</span></div>
                  <div className="flex text-[#CCBFF3]">
                     {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} fill={i < 5 ? "#CCBFF3" : "transparent"} color="#CCBFF3" />)}
                  </div>
               </div>
               <div className="bg-[#1C1B22] border border-[#2a2a35] rounded-xl p-6 relative overflow-hidden">
                  <div className="flex justify-between items-center text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                     <span>Sentiment Score</span>
                     <Smile size={16} />
                  </div>
                  <div className="text-3xl font-bold text-white mb-4">82<span className="text-xl">%</span></div>
                  <div className="w-full bg-[#111016] rounded-full h-1.5 mt-auto">
                     <div className="bg-[#CCBFF3] h-1.5 rounded-full w-[82%] shadow-[0_0_10px_#CCBFF3]"></div>
                  </div>
               </div>
               <div className="bg-[#1C1B22] border border-[#2a2a35] rounded-xl p-6">
                  <div className="flex justify-between items-center text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                     <span>Latency</span>
                     <Zap size={16} />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">240<span className="text-xl">ms</span></div>
                  <div className="text-xs text-gray-500">P95 extraction speed</div>
               </div>
            </div>

            <div className="flex gap-6">
               {/* Sentiment Trend Chart placeholder */}
               <div className="bg-[#1C1B22] border border-[#2a2a35] rounded-xl p-6 flex-[2] flex flex-col">
                  <div className="flex justify-between items-center mb-10">
                     <h2 className="text-lg font-bold text-white">Sentiment Trend</h2>
                     <div className="flex gap-4 text-xs font-semibold uppercase text-gray-400">
                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#CCBFF3]"></div> Positive</div>
                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-gray-500"></div> Neutral</div>
                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#625885]"></div> Negative</div>
                     </div>
                  </div>
                  {/* Mock visual placeholder for chart area */}
                  <div className="flex-1 relative min-h-[180px] w-full border-b border-[#2a2a35] flex items-end">
                     <svg className="w-full h-full absolute inset-0 preserve-aspect-ratio-none" viewBox="0 0 500 150">
                        <defs>
                           <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#CCBFF3" stopOpacity="0.2" />
                              <stop offset="100%" stopColor="#CCBFF3" stopOpacity="0" />
                           </linearGradient>
                        </defs>
                        {/* Positive Line */}
                        <path d="M0 100 Q 50 60 100 80 T 200 40 T 300 70 T 400 30 T 500 45 L 500 150 L 0 150 Z" fill="url(#grad)" />
                        <path d="M0 100 Q 50 60 100 80 T 200 40 T 300 70 T 400 30 T 500 45" fill="none" stroke="#CCBFF3" strokeWidth="2" />
                        {/* Neutral Line */}
                        <path d="M0 110 Q 150 100 250 110 T 500 105" fill="none" stroke="#68687a" strokeWidth="1" />
                        {/* Negative Line */}
                        <path d="M0 130 Q 150 120 250 130 T 500 125" fill="none" stroke="#625885" strokeWidth="1" />
                     </svg>
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-500 mt-2 font-semibold uppercase tracking-widest">
                     <span>Week 1</span>
                     <span>Week 2</span>
                     <span>Week 3</span>
                     <span>Week 4</span>
                  </div>
               </div>

               {/* Rating Distribution */}
               <div className="bg-[#1C1B22] border border-[#2a2a35] rounded-xl p-6 flex-1 flex flex-col">
                  <h2 className="text-lg font-bold text-white mb-6">Rating Distribution</h2>
                  <div className="space-y-4 text-xs font-semibold text-gray-300">
                     {[
                        { stars: 5, perc: '64%', w: '64%', c: 'bg-[#CCBFF3] shadow-[0_0_8px_#CCBFF3]' },
                        { stars: 4, perc: '22%', w: '22%', c: 'bg-[#625885] shadow-[0_0_8px_#625885]' },
                        { stars: 3, perc: '8%', w: '8%', c: 'bg-[#4a4a5a] shadow-[0_0_8px_#4a4a5a]' },
                        { stars: 2, perc: '4%', w: '4%', c: 'bg-[#3e3e4a] shadow-[0_0_8px_#3e3e4a]' },
                        { stars: 1, perc: '2%', w: '2%', c: 'bg-[#2a2a35] shadow-[0_0_8px_#2a2a35]' }
                     ].map(r => (
                        <div key={r.stars}>
                           <div className="flex justify-between mb-1">
                              <span>{r.stars} {r.stars === 1 ? 'STAR' : 'STARS'}</span>
                              <span>{r.perc}</span>
                           </div>
                           <div className="w-full bg-[#111016] rounded-sm h-1.5">
                              <div className={`${r.c} h-1.5 rounded-sm`} style={{ width: r.w }}></div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            <div className="flex gap-6 mt-2">
               {/* Top Keywords */}
               <div className="bg-[#1C1B22] border border-[#2a2a35] rounded-xl p-6 flex-1">
                  <div className="flex justify-between items-center mb-6">
                     <h2 className="text-lg font-bold text-white">Top Keywords</h2>
                     <a href="#" className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-white hover:text-shadow-[0_0_8px_#CCBFF3] transition">Full List <ArrowRight size={12} /></a>
                  </div>
                  <div className="flex flex-wrap gap-3">
                     <span className="px-4 py-2 bg-[#CCBFF3] text-[#111016] rounded-full text-sm font-semibold shadow-lg">Good Story</span>
                     <span className="px-4 py-2 border border-[#2a2a35] bg-[#111016] text-gray-300 rounded-full text-sm">Great Graphics</span>
                     <span className="px-4 py-2 border border-[#2a2a35] bg-[#111016] text-gray-300 rounded-full text-sm font-semibold">Masterpiece</span>
                     <span className="px-4 py-2 bg-[#625885] text-white rounded-full text-sm shadow-md italic">Optimized</span>
                     <span className="px-4 py-2 border border-[#2a2a35] bg-[#111016] text-gray-300 rounded-full text-sm">Multiplayer</span>
                     <span className="px-4 py-2 border border-[#2a2a35] bg-[#111016] text-gray-300 rounded-full text-sm">DLC</span>
                     <span className="px-4 py-2 border border-[#2a2a35] bg-[#111016] text-gray-400 rounded-full text-sm">Buggy</span>
                     <span className="px-4 py-2 border border-[#2a2a35] bg-[#111016] text-gray-300 rounded-full text-sm">Soundtrack</span>
                     <span className="px-4 py-2 bg-[#3e3e4a] text-white rounded-full text-sm font-bold">RPG</span>
                     <span className="px-4 py-2 border border-[#2a2a35] bg-[#111016] text-gray-500 rounded-full text-sm uppercase">FPS</span>
                  </div>
               </div>

               {/* AI Analysis Enable Banner */}
               <div className="bg-gradient-to-br from-[#1C1B22] to-[#1a2b2b] border border-[#2a2a35] rounded-xl p-8 flex-[1.2] flex flex-col items-center justify-center text-center relative overflow-hidden">
                  {/* Simple tech background pattern mock */}
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_#35e1be_0%,_transparent_70%)] pointer-events-none"></div>

                  <Sparkles className="text-[#35e1be] mb-4" size={32} />
                  <h2 className="text-2xl font-bold text-white mb-2 z-10">AI Analysis Enabled</h2>
                  <p className="text-sm text-gray-400 max-w-[280px] z-10">
                     Proprietary NLP engines are processing 438 new reviews every hour to maintain accuracy.
                  </p>
               </div>
            </div>

         </main>
         <Footer />
      </div>
   );
}




