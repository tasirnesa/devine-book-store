import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Eye, User, BookOpen, Star, ShoppingCart, Search as SearchIcon } from 'lucide-react';

const BookCard = ({ book, variant = 'full' }) => {
    const { t } = useTranslation();
    const translation = book.activeTranslation || {};
    const categories = book.categories || [];
    const isCompact = variant === 'compact';
    const [isHovered, setIsHovered] = useState(false);

    // Mock rating for aesthetic purposes
    const rating = (book.id % 2 === 0) ? 4.5 : 5;
    const reviewCount = (book.id * 13) % 100 + 10;

    return (
        <div
            className={`group bg-white overflow-hidden transition-all duration-500 flex flex-col h-full relative ${isCompact ? 'border-none' : 'rounded-2xl shadow-sm hover:shadow-2xl border border-gray-100 hover:-translate-y-1'
                }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Badges */}
            {!isCompact && (
                <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                    {book.featured && (
                        <span className="bg-bam-red text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg uppercase tracking-tighter animate-pulse">
                            {t('books.featured')}
                        </span>
                    )}
                    {book.id % 3 === 0 && (
                        <span className="bg-green-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg uppercase tracking-tighter">
                            {t('books.new_arrival')}
                        </span>
                    )}
                </div>
            )}

            {/* Cover Image Container */}
            <div className={`relative aspect-[3/4] overflow-hidden bg-gray-50 ${isCompact ? 'rounded-xl mb-4' : 'rounded-t-2xl'}`}>
                <img
                    src={book.coverUrl ? `${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}${book.coverUrl}` : 'https://via.placeholder.com/300x400?text=No+Cover'}
                    alt={translation.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />

                {/* Hover Overlay with Actions */}
                <div className={`absolute inset-0 bg-bam-navy/40 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                    <Link to={`/books/${book.slug}`} className="bg-white text-bam-navy px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest hover:bg-bam-red hover:text-white transition-all transform hover:scale-105 shadow-xl">
                        {t('common.view_details')}
                    </Link>
                </div>

                {!isCompact && (
                    <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
                        {categories.slice(0, 2).map((cat) => (
                            <span key={cat.id} className="bg-white/90 text-bam-navy text-[9px] font-black px-2 py-1 rounded shadow-sm uppercase tracking-wider backdrop-blur-sm">
                                {cat.name}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Content Container */}
            <div className={`${isCompact ? 'px-0 py-2' : 'p-6'} flex flex-col flex-grow`}>
                {/* Author */}
                <div className={`flex items-center gap-1.5 text-gray-400 uppercase tracking-widest mb-2 ${isCompact ? 'text-[9px]' : 'text-[10px] font-black'}`}>
                    <span className="text-bam-red">{t('common.by') || 'By'}</span>
                    <span className="truncate hover:text-bam-navy cursor-pointer transition-colors">
                        {translation.authorName || book.author?.name || 'Unknown Author'}
                    </span>
                </div>

                {/* Title */}
                <h3 className={`font-serif font-black text-bam-navy mb-2 line-clamp-2 transition-colors group-hover:text-bam-red ${isCompact ? 'text-sm leading-tight' : 'text-xl'}`}>
                    {translation.title}
                </h3>

                {/* Ratings (Premium Touch) */}
                <div className="flex items-center gap-1 mb-3">
                    <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={isCompact ? 10 : 14} fill={i < Math.floor(rating) ? "currentColor" : "none"} />
                        ))}
                    </div>
                    <span className="text-gray-400 text-[10px] font-bold">({reviewCount})</span>
                </div>

                {!isCompact && (
                    <p className="text-gray-600 text-sm line-clamp-3 mb-6 flex-grow leading-relaxed font-medium opacity-80">
                        {translation.description}
                    </p>
                )}

                {/* Footer Section */}
                <div className={`flex items-center justify-between mt-auto ${isCompact ? 'pt-1' : 'pt-5 border-t border-gray-100'}`}>
                    <div className="flex flex-col">
                        <span className={`${isCompact ? 'text-sm' : 'text-lg'} font-black text-bam-navy tracking-tighter`}>
                            {book.views} {t('common.views')}
                        </span>
                        {!isCompact && <span className="text-[10px] text-green-600 font-bold uppercase tracking-tight">{t('books.available_to_read') || 'Available to Read'}</span>}
                    </div>

                    <Link
                        to={`/books/${book.slug}`}
                        className={`flex items-center justify-center gap-2 font-black transition-all ${isCompact
                            ? 'text-bam-navy hover:text-bam-red'
                            : 'bg-bam-navy text-white px-5 py-2.5 rounded-xl hover:bg-bam-red shadow-lg hover:shadow-bam-red/30'
                            }`}
                    >
                        {isCompact ? <Eye size={18} /> : (
                            <>
                                <span className="text-xs uppercase tracking-widest">{t('common.read')}</span>
                                <BookOpen size={16} />
                            </>
                        )}
                    </Link>
                </div>
            </div>
        </div>
    );
};
export default BookCard;
