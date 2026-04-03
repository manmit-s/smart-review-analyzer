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
        <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
            <Navbar activeTab="History" />

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
                <div className="p-6 md:p-8 space-y-8 animate-fade-in">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
                                Extraction History
                            </h1>
                            <p className="text-gray-400 mt-1">
                                Browse and filter through all scraped review data locally.
                            </p>
                        </div>

                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${isFilterOpen || hasActiveFilters
                                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                                    : 'bg-slate-800 text-gray-300 hover:bg-slate-700 border border-slate-700'
                                }`}
                        >
                            <Filter className="w-4 h-4" />
                            Filters {hasActiveFilters && <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full ml-1 select-none">Active</span>}
                        </button>
                    </div>

                    {isFilterOpen && (
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 mb-6 animate-slide-up">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-semibold text-gray-200">Filter Records</h3>
                                {hasActiveFilters && (
                                    <button
                                        onClick={clearFilters}
                                        className="text-sm text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
                                    >
                                        <X className="w-3 h-3" /> Clear all
                                    </button>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Sentiment</label>
                                    <select
                                        value={sentiment}
                                        onChange={(e) => { setSentiment(e.target.value); setPage(1); }}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none"
                                    >
                                        <option value="">All Sentiments</option>
                                        <option value="Positive">Positive</option>
                                        <option value="Neutral">Neutral</option>
                                        <option value="Negative">Negative</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Rating</label>
                                    <select
                                        value={rating}
                                        onChange={(e) => { setRating(e.target.value); setPage(1); }}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none"
                                    >
                                        <option value="">All Ratings</option>
                                        <option value="5">5 Stars</option>
                                        <option value="4">4 Stars</option>
                                        <option value="3">3 Stars</option>
                                        <option value="2">2 Stars</option>
                                        <option value="1">1 Star</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Game ID</label>
                                    <div className="relative">
                                        <Search className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
                                        <input
                                            type="text"
                                            value={productId}
                                            onChange={(e) => { setProductId(e.target.value); setPage(1); }}
                                            placeholder="e.g. 730"
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Main Table Area */}
                    <div className="bg-slate-800/30 border border-slate-700 rounded-2xl overflow-hidden backdrop-blur-sm">
                        <div className="p-5 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
                            <div className="flex items-center gap-2">
                                <HistoryIcon className="w-5 h-5 text-indigo-400" />
                                <h2 className="text-lg font-bold text-white">Review Database</h2>
                            </div>
                            <span className="bg-slate-900 text-gray-300 px-3 py-1 rounded-full text-xs font-medium border border-slate-700">
                                {totalItems} Total Records
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            {loading ? (
                                <div className="flex justify-center items-center py-20">
                                    <RefreshCw className="w-8 h-8 text-blue-500 animate-spin opacity-50" />
                                </div>
                            ) : reviews.length === 0 ? (
                                <div className="text-center py-16 text-gray-400">
                                    <HistoryIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                    <p className="text-lg">No reviews found matching your filters.</p>
                                    {hasActiveFilters && (
                                        <button onClick={clearFilters} className="text-blue-400 hover:text-blue-300 mt-2 text-sm font-medium">
                                            Clear filters
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-900/50 text-gray-400 text-sm uppercase tracking-wider">
                                            <th className="px-6 py-4 font-medium border-b border-slate-700">Game</th>
                                            <th className="px-6 py-4 font-medium border-b border-slate-700 w-1/2">Review</th>
                                            <th className="px-6 py-4 font-medium border-b border-slate-700">Rating</th>
                                            <th className="px-6 py-4 font-medium border-b border-slate-700">Sentiment</th>
                                            <th className="px-6 py-4 font-medium border-b border-slate-700 text-right">Date Scraped</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-700/50 text-sm">
                                        {reviews.map((review) => (
                                            <tr key={review.id} className="hover:bg-slate-700/20 transition-colors group">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-gray-200">
                                                            {gameNames[review.product_id] ? gameNames[review.product_id] : (
                                                                <span className="animate-pulse bg-slate-700 h-4 w-24 rounded inline-block"></span>
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
                                                    <div className="flex items-center text-yellow-500 bg-yellow-500/10 w-min px-2 py-1 rounded-md">
                                                        <Star className="w-3.5 h-3.5 fill-current mr-1 text-yellow-500" />
                                                        <span className="font-bold">{review.rating}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${review.sentiment === 'Positive' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                            review.sentiment === 'Negative' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                                'bg-slate-500/10 text-slate-400 border-slate-500/20'
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
                            <div className="p-4 border-t border-slate-700 bg-slate-900/30 flex justify-between items-center">
                                <span className="text-sm text-gray-400">
                                    Showing <span className="text-white font-medium">{(page - 1) * limit + 1}</span> to <span className="text-white font-medium">{Math.min(page * limit, totalItems)}</span> of <span className="text-white font-medium">{totalItems}</span>
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="p-2 rounded-lg bg-slate-800 text-gray-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-600 transition-colors"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <div className="flex items-center px-4 bg-slate-800 rounded-lg border border-slate-600 text-sm font-medium">
                                        Page {page} of {totalPages}
                                    </div>
                                    <button
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        className="p-2 rounded-lg bg-slate-800 text-gray-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-600 transition-colors"
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