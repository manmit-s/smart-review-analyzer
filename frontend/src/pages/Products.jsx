import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Package, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch("http://localhost:8000/api/products");
            if (res.ok) {
                const data = await res.json();
                setProducts(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#111016] text-[#dfdee3] font-sans flex flex-col items-center">
            <Navbar activeTab="Products" />
            <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-12 flex flex-col items-center gap-10">
                <div className="w-full">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#625885] to-[#CCBFF3]">
                        Tracked Products
                    </h1>
                    <p className="text-gray-400 mt-2">
                        Directory of all Steam games extracted and maintained in the analytics database.
                    </p>
                </div>

                {loading ? (
                    <div className="py-20 text-gray-500 animate-pulse">Loading games directory...</div>
                ) : products.length === 0 ? (
                    <div className="py-20 text-center text-gray-500 bg-[#1C1B22] w-full border border-[#2a2a35] rounded-xl shadow-lg">
                        <Package className="w-12 h-12 mx-auto mb-4 opacity-30" />
                        No products tracked yet. Extract a game on the Dashboard first.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                        {products.map(product => (
                            <div key={product.id} className="bg-[#1C1B22] border border-[#2a2a35] rounded-xl p-6 hover:border-[#625885] hover:shadow-[0_0_15px_rgba(98,88,133,0.3)] transition-all flex flex-col justify-between group">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-200 group-hover:text-white transition-colors line-clamp-2" title={product.name}>
                                        {product.name}
                                    </h3>
                                    <div className="mt-2 text-xs font-mono text-[#625885] bg-[#111016] inline-block px-2 py-1 rounded">
                                        AppID: {product.id}
                                    </div>
                                </div>
                                <div className="mt-6 flex flex-col gap-3">
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Calendar className="w-4 h-4 opacity-70" />
                                        <span>First tracked: {new Date(product.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <Link to={`/history`} className="text-center w-full bg-[#111016] border border-[#2a2a35] hover:border-[#CCBFF3] text-[#CCBFF3] hover:text-white py-2 rounded-lg text-sm font-semibold transition">
                                        View Reviews
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
