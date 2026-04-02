import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full mt-auto border-t border-[#2a2a35] py-8 px-12 flex justify-between items-center text-sm bg-[#111016]">
      <div>
        <div className="text-white font-semibold text-base mb-1 uppercase">SteamReview Analyzer</div>
        <div className="text-gray-500 uppercase text-xs">&copy; 2026 SteamReview Analytics. All rights reserved.</div>
      </div>
      <div className="flex gap-8 text-gray-500 uppercase text-xs font-semibold">
        <a href="#" className="hover:text-white transition">Privacy Policy</a>
        <a href="#" className="hover:text-white transition">Terms of Service</a>
        <a href="#" className="hover:text-white transition">API Documentation</a>
      </div>
    </footer>
  );
}
