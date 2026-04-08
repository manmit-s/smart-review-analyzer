import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Activity, Clock, FileText, ExternalLink, CheckCircle, AlertCircle, PlayCircle } from 'lucide-react';

export default function Jobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchJobs();
        // Set up polling for running jobs
        const interval = setInterval(fetchJobs, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchJobs = async () => {
        try {
            const res = await fetch("http://localhost:8000/api/jobs");
            if (res.ok) {
                const data = await res.json();
                setJobs(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#111016] text-[#dfdee3] font-sans flex flex-col items-center">
            <Navbar activeTab="Jobs" />
            <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-12 flex flex-col items-center gap-10">
                <div className="w-full flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#625885] to-[#CCBFF3]">
                            Scraping Architecture Jobs
                        </h1>
                        <p className="text-gray-400 mt-2">
                            Live telemetry and extraction logs from the backend engine.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 bg-[#1C1B22] border border-[#2a2a35] px-4 py-2 rounded-lg text-sm text-gray-300">
                        <Activity className="w-4 h-4 text-green-400 animate-pulse" />
                        Engine Online
                    </div>
                </div>

                <div className="w-full bg-[#1C1B22] border border-[#2a2a35] rounded-xl overflow-hidden shadow-2xl">
                    <div className="p-6 border-b border-[#2a2a35] bg-[#1a1a23] font-semibold text-gray-400 text-xs uppercase tracking-wider grid grid-cols-[80px_140px_1fr_160px_200px] gap-6 items-center">
                        <div>ID</div>
                        <div>Status</div>
                        <div>Target Payload</div>
                        <div className="text-center">Extraction Count</div>
                        <div className="text-right">Timestamp</div>
                    </div>
                    
                    <div className="divide-y divide-[#2a2a35]">
                        {loading && jobs.length === 0 ? (
                            <div className="py-16 text-center text-gray-500">Loading system logs...</div>
                        ) : jobs.length === 0 ? (
                            <div className="py-16 text-center text-gray-500">System idle. No active or past jobs found.</div>
                        ) : (
                            jobs.map(job => (
                                <div key={job.id} className="px-6 py-5 grid grid-cols-[80px_140px_1fr_160px_200px] gap-6 items-center hover:bg-white/[0.02] transition-colors">
                                    <div className="font-mono text-sm text-[#625885] font-bold">
                                        #{job.id}
                                    </div>
                                    <div>
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] uppercase tracking-wider font-bold border ${
                                            job.status === 'Completed' ? 'bg-green-400/10 text-green-400 border-green-500/30' :
                                            job.status === 'Running' ? 'bg-blue-400/10 text-blue-400 border-blue-500/30 shadow-[0_0_8px_rgba(96,165,250,0.3)]' :
                                            job.status === 'Failed' ? 'bg-red-400/10 text-red-400 border-red-500/30' :
                                            'bg-gray-400/10 text-gray-400 border-gray-500/30'
                                        }`}>
                                            {job.status === 'Completed' && <CheckCircle className="w-3.5 h-3.5" />}
                                            {job.status === 'Failed' && <AlertCircle className="w-3.5 h-3.5" />}
                                            {job.status === 'Running' && <PlayCircle className="w-3.5 h-3.5 animate-spin" />}
                                            {job.status}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-300 truncate font-mono bg-black/20 py-1.5 px-3 rounded text-left border border-white/5" title={job.url}>
                                        {job.url}
                                    </div>
                                    <div className="text-sm text-gray-400 text-center font-medium">
                                        {job.status === 'Running' ? '-' : `${job.reviews_extracted} rows`}
                                    </div>
                                    <div className="text-right text-sm text-gray-500 flex items-center justify-end gap-1.5">
                                        <Clock className="w-4 h-4 opacity-50" />
                                        {new Date(job.created_at).toLocaleString()}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
