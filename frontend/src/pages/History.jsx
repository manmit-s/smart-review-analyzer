import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Search, Filter, History as HistoryIcon, Clock, ChevronLeft, ChevronRight, RefreshCw, Star, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function History() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const limit = 10;

    // Game name cache mapping
    const [gameNames, setGameNames] = useState({});

    // Filters
    const [sentiment, setSentiment] = useState('');
    const [rating, setRating] = useState('');
    const [productId, setProductId] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    useEffect(() => {
        fetchReviews();
    }, [page, sentiment, rating, productId]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const skip = (page - 1) * limit;

            let url = `http://localhost:8000/api/reviews?limit=${limit}&skip=${skip}`;
            if (sentiment) url += `&sentiment=${sentiment}`;
            if (rating) url += `&rating=${rating}`;
            if (productId) url += `&product_id=${productId}`;

            const response = await fetch(url);
            const data = await response.json();

            setReviews(data.items);
            setTotalItems(data.total);
            setTotalPages(Math.ceil(data.total / limit));

            // Batch fetch missing game names
            const missingIds = [...new Set(data.items.map(r => r.product_id))]
                .filter(id => !gameNames[id]);

            if (missingIds.length > 0) {
                missingIds.forEach(id => fetchGameName(id));
            }
        } catch (error) {
            console.error('Error fetching history:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchGameName = async (appId) => {
        if (!appId) return;
        try {
            const response = await fetch(`http://localhost:8000/api/games/${appId}`);
            const data = await response.json();
            if (data.name) {
                setGameNames(prev => ({ ...prev, [appId]: data.name }));
            }
        } catch (error) {
            console.error(`Error fetching game name for ${appId}:`, error);
        }
    };

    const clearFilters = () => {
        setSentiment('');
        setRating('');
        setProductId('');
        setPage(1);
    };

    const hasActiveFilters = sentiment || rating || productId;

    return (
        <div className="min-h-screen bg-[#111016] text-[#dfdee3] font-sans flex flex-col items-center">
            <Navbar activeTab="History" />

            <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center gap-10 animate-fade-in">
                <div className="w-full space-y-8 animate-fade-in">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#625885] to-[#CCBFF3]">
                                Extraction History
                            </h1>
                            <p className="text-gray-400 mt-2">
                                Browse and filter through all scraped review data locally.
                            </p>
                        </div>

                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${isFilterOpen || hasActiveFilters
                                ? 'bg-[#1C1B22] text-[#CCBFF3] border border-[#625885] shadow-[0_0_10px_rgba(204,191,243,0.2)]'
                                : 'bg-[#1C1B22] text-gray-300 hover:bg-[#2a2a35] border border-[#2a2a35]'
                                }`}
                        >
                            <Filter className="w-4 h-4" />
                            Filters {hasActiveFilters && <span className="bg-[#625885] text-white text-[10px] px-1.5 py-0.5 rounded-full ml-1 select-none uppercase tracking-wider">Active</span>}
                        </button>
                    </div>

                    {isFilterOpen && (
                        <div className="bg-[#1C1B22] border border-[#2a2a35] rounded-xl p-6 mb-6 animate-slide-up shadow-2xl">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-semibold text-gray-300">Filter Records</h3>
                                {hasActiveFilters && (
                                    <button
                                        onClick={clearFilters}
                                        className="text-sm text-gray-400 hover:text-[#CCBFF3] flex items-center gap-1 transition"
                                    >
                                        <X className="w-3 h-3" /> Clear all
                                    </button>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Sentiment</label>
                                    <div className="relative border border-[#2a2a35] rounded-lg bg-[#111016]">
                                        <select
                                            value={sentiment}
                                            onChange={(e) => { setSentiment(e.target.value); setPage(1); }}
                                            className="w-full appearance-none bg-transparent p-3 text-white focus:outline-none"
                                        >
                                            <option value="" className="bg-[#1C1B22]">All Sentiments</option>
                                            <option value="Positive" className="bg-[#1C1B22]">Positive</option>
                                            <option value="Neutral" className="bg-[#1C1B22]">Neutral</option>
                                            <option value="Negative" className="bg-[#1C1B22]">Negative</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Rating</label>
                                    <div className="relative border border-[#2a2a35] rounded-lg bg-[#111016]">
                                        <select
                                            value={rating}
                                            onChange={(e) => { setRating(e.target.value); setPage(1); }}
                                            className="w-full appearance-none bg-transparent p-3 text-white focus:outline-none"
                                        >
                                            <option value="" className="bg-[#1C1B22]">All Ratings</option>
                                            <option value="5" className="bg-[#1C1B22]">5 Stars</option>
                                            <option value="4" className="bg-[#1C1B22]">4 Stars</option>
                                            <option value="3" className="bg-[#1C1B22]">3 Stars</option>
                                            <option value="2" className="bg-[#1C1B22]">2 Stars</option>
                                            <option value="1" className="bg-[#1C1B22]">1 Star</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Game ID</label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-3.5 text-gray-500" size={18} />
                                        <input
                                            type="text"
                                            value={productId}
                                            onChange={(e) => { setProductId(e.target.value); setPage(1); }}
                                            placeholder="e.g. 730"
                                            className="w-full bg-[#111016] text-white border border-[#2a2a35] rounded-lg pl-10 pr-4 p-3 focus:outline-none focus:border-[#625885] transition"
                                            >
                                            
                                        </input>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Main Table Area */}
                    <div className="bg-[#1C1B22] border border-[#2a2a35] rounded-2xl overflow-hidden backdrop-blur-sm">
                        <div className="p-5 border-b border-[#2a2a35] flex justify-between items-center bg-[#1C1B22]">
                            <div className="flex items-center gap-2">
                                <HistoryIcon className="w-5 h-5 text-[#CCBFF3]" />
                                <h2 className="text-lg font-bold text-white">Review Database</h2>
                            </div>
                            <span className="bg-[#111016] text-gray-300 px-3 py-1 rounded-full text-xs font-medium border border-[#2a2a35]">
                                {totalItems} Total Records
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            {loading ? (
                                <div className="flex justify-center items-center py-20">
                                    <RefreshCw className="w-8 h-8 text-[#CCBFF3] animate-spin opacity-50" />
                                </div>
                            ) : reviews.length === 0 ? (
                                <div className="text-center py-16 text-gray-400">
                                    <HistoryIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                    <p className="text-lg">No reviews found matching your filters.</p>
                                    {hasActiveFilters && (
                                        <button onClick={clearFilters} className="text-[#CCBFF3] hover:text-white mt-2 text-sm font-medium">
                                            Clear filters
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-[#1a1a23] text-gray-400 text-sm uppercase tracking-wider">
                                            <th className="px-6 py-4 font-medium border-b border-[#2a2a35]">Game</th>
                                            <th className="px-6 py-4 font-medium border-b border-[#2a2a35] w-1/2">Review</th>
                                            <th className="px-6 py-4 font-medium border-b border-[#2a2a35]">Rating</th>
                                            <th className="px-6 py-4 font-medium border-b border-[#2a2a35]">Sentiment</th>
                                            <th className="px-6 py-4 font-medium border-b border-[#2a2a35] text-right">Date Scraped</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-700/50 text-sm">
                                        {reviews.map((review) => (
                                            <tr key={review.id} className="hover:bg-[#2a2a35]/20 transition-colors group">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-gray-200">
                                                            {gameNames[review.product_id] ? gameNames[review.product_id] : (
                                                                <span className="animate-pulse bg-[#2a2a35] h-4 w-24 rounded inline-block"></span>
                                                            )}
                                                        </span>
                                                        <span className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                                            AppID: {review.product_id}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-gray-300 line-clamp-2 title-ellipsis group-hover:line-clamp-none transition-all duration-300 max-w-xl">
                                                        {review.review_content}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center text-gray-300 bg-white/10 w-min px-2 py-1 rounded-md">
                                                        <Star className="w-3.5 h-3.5 fill-current mr-1 text-gray-300" />
                                                        <span className="font-bold">{review.rating}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${review.sentiment === 'Positive' ? 'bg-green-400/10 text-green-400 border-green-500/30' :
                                                        review.sentiment === 'Negative' ? 'bg-red-400/10 text-red-400 border-red-500/30' :
                                                            'bg-white/10 text-gray-400 border-[#3e3e4a]'
                                                        }`}>
                                                        {review.sentiment}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-gray-400 flex flex-col items-end justify-center h-full">
                                                    <div className="flex items-center gap-1 mt-2">
                                                        <Clock className="w-3.5 h-3.5 opacity-70" />
                                                        {new Date(review.created_at).toLocaleDateString()}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {/* Pagination Controls */}
                        {!loading && totalPages > 0 && (
                            <div className="p-4 border-t border-[#2a2a35] bg-[#111016]/30 flex justify-between items-center">
                                <span className="text-sm text-gray-400">
                                    Showing <span className="text-white font-medium">{(page - 1) * limit + 1}</span> to <span className="text-white font-medium">{Math.min(page * limit, totalItems)}</span> of <span className="text-white font-medium">{totalItems}</span>
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="p-2 rounded-lg bg-[#1C1B22] text-gray-300 hover:bg-[#2a2a35] disabled:opacity-50 disabled:cursor-not-allowed border border-[#2a2a35] transition-colors"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <div className="flex items-center px-4 bg-[#1C1B22] rounded-lg border border-[#2a2a35] text-sm font-medium">
                                        Page {page} of {totalPages}
                                    </div>
                                    <button
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        className="p-2 rounded-lg bg-[#1C1B22] text-gray-300 hover:bg-[#2a2a35] disabled:opacity-50 disabled:cursor-not-allowed border border-[#2a2a35] transition-colors"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
