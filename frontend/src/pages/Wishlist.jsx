import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import wishlistService from '../services/wishlist.service';

const Wishlist = () => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const response = await wishlistService.getWishlist();
                setWishlist(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching wishlist:', err);
                setLoading(false);
            }
        };

        fetchWishlist();
    }, []);

    const handleToggleWishlist = async (productId) => {
        try {
            await wishlistService.toggleWishlist(productId);
            // Update local state by removing the item
            setWishlist(wishlist.filter(item => item._id !== productId));
        } catch (err) {
            console.error('Error removing from wishlist:', err);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-slate-50 dark:bg-slate-950">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-12 px-6">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12">
                    <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white mb-2">My Wishlist</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Keep track of the devices you love.</p>
                </header>

                {wishlist.length === 0 ? (
                    <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl p-12 text-center border border-white/20 shadow-xl">
                        <span className="material-symbols-outlined text-7xl text-slate-300 dark:text-slate-700 mb-4">favorite</span>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Your wishlist is empty</h2>
                        <p className="text-slate-500 dark:text-slate-400 mb-8">Start adding some amazing phones to your list!</p>
                        <Link 
                            to="/products" 
                            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-blue-600/25"
                        >
                            Go Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {wishlist.map((product) => (
                            <div 
                                key={product._id} 
                                className="group relative bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-3xl overflow-hidden border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                            >
                                <button 
                                    onClick={() => handleToggleWishlist(product._id)}
                                    className="absolute top-4 right-4 z-10 bg-white/90 dark:bg-slate-800/90 p-2 rounded-full shadow-md text-red-500 hover:scale-110 active:scale-90 transition-all duration-300"
                                >
                                    <span className="material-symbols-outlined fill-current">favorite</span>
                                </button>

                                <Link to={`/products/${product._id}`}>
                                    <div className="aspect-[4/5] overflow-hidden bg-slate-100 dark:bg-slate-800">
                                        <img 
                                            src={product.images && product.images[0] ? product.images[0] : 'https://placehold.co/600x800?text=No+Image'} 
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 truncate">{product.name}</h3>
                                        <p className="text-blue-600 dark:text-blue-400 font-bold text-xl mb-4">
                                            ${product.price.toLocaleString()}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                            </span>
                                            <span className="material-symbols-outlined text-slate-400 group-hover:text-blue-600 transition-colors duration-300">arrow_forward</span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
