import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Bookmark, BookOpen, Trash2, ChevronRight, Info, Search } from 'lucide-react';
import axiosInstance from '../../../shared/services/axiosInstance';
import Loader from '../../../shared/components/Loader';

const SavedBooksPage = () => {
    const { t, i18n } = useTranslation();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchFavorites = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/favorites?lang=${i18n.language}`);
            setFavorites(response.data.data || []);
        } catch (err) {
            console.error('Failed to fetch favorites', err);
            setError('Could not load your saved collection.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, [i18n.language]);

    const handleRemove = async (bookId) => {
        try {
            await axiosInstance.post('/favorites/toggle', { bookId });
            setFavorites(favorites.filter(f => f.id !== bookId));
            window.dispatchEvent(new CustomEvent('favoriteUpdated'));
        } catch (err) {
            console.error('Failed to remove favorite', err);
        }
    };

    if (loading) return <div className="min-h-[70vh] flex items-center justify-center"><Loader /></div>;

    return (
        <div className="bg-white min-h-screen pb-20">
            {/* Header Section */}
            <div className="bg-gray-50 border-b border-gray-100 mb-12">
                <div className="container mx-auto px-4 py-16 text-center">
                    <div className="w-20 h-20 bg-bam-navy text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                        <Bookmark size={40} fill="currentColor" />
                    </div>
                    <h1 className="text-5xl font-black text-bam-navy font-serif italic tracking-tight mb-4">
                        My Sacred Collection
                    </h1>
                    <p className="text-gray-500 font-medium tracking-wide uppercase text-xs">
                        {favorites.length} {favorites.length === 1 ? 'Manuscript' : 'Manuscripts'} Preserved in your Personal Archives
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4">
                {favorites.length === 0 ? (
                    <div className="text-center py-20 px-6 max-w-lg mx-auto border-2 border-dashed border-gray-100 rounded-[3rem]">
                        <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-bam-navy mb-4">Your archives are empty</h2>
                        <p className="text-gray-400 mb-8 font-medium">Begin your journey by exploring our ancient manuscripts and saving them to your collection for quick access.</p>
                        <Link 
                            to="/books" 
                            className="inline-flex items-center gap-2 px-10 py-4 bg-bam-red text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-bam-navy transition-all shadow-lg shadow-red-100"
                        >
                            Explore Manuscripts <ChevronRight size={18} />
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {favorites.map((book) => {
                            const translation = book.activeTranslation;
                            const coverUrl = book.coverUrl 
                                ? `${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}${book.coverUrl}` 
                                : 'https://via.placeholder.com/300x400?text=Sacred+Manuscript';

                            return (
                                <div key={book.id} className="group bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                                    <div className="relative aspect-[3/4] overflow-hidden">
                                        <img 
                                            src={coverUrl} 
                                            alt={translation?.title} 
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-bam-navy/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                                            <div className="flex gap-2 w-full">
                                                <Link 
                                                    to={`/books/${book.slug}`}
                                                    className="flex-grow h-12 flex items-center justify-center bg-white text-bam-navy rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-bam-red hover:text-white transition-all shadow-lg"
                                                >
                                                    View Details
                                                </Link>
                                                <button 
                                                    onClick={() => handleRemove(book.id)}
                                                    className="w-12 h-12 flex items-center justify-center bg-white/20 backdrop-blur-md text-white border border-white/30 rounded-xl hover:bg-red-500 hover:border-red-500 transition-all"
                                                    title="Remove from Collection"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-8 space-y-4">
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black text-bam-red uppercase tracking-[0.2em]">{book.category?.name || 'Manuscript'}</p>
                                            <h3 className="text-2xl font-black text-bam-navy font-serif italic leading-tight truncate">
                                                {translation?.title}
                                            </h3>
                                            <p className="text-sm text-gray-400 font-bold italic font-serif">by {translation?.authorName || 'Ancient Scholar'}</p>
                                        </div>
                                        
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <Info size={14} />
                                                <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                                                    {book.quantity > 0 ? 'Available' : 'Reserved'}
                                                </span>
                                            </div>
                                            {book.fileUrl && (
                                                <Link 
                                                    to={`/books/${book.slug}/read`}
                                                    className="flex items-center gap-2 text-bam-navy hover:text-bam-red transition-colors"
                                                >
                                                    <BookOpen size={18} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Read Online</span>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SavedBooksPage;
