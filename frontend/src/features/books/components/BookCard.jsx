import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BookOpen, Eye } from 'lucide-react';

const BookCard = ({ book }) => {
    const { t } = useTranslation();
    const translation = book.activeTranslation || {};

    return (
        <Link 
            to={`/books/${book.slug}`}
            className="group flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
            {/* Image Container with Light Box Aesthetic */}
            <div className="relative aspect-[3/4] bg-slate-50 rounded-2xl overflow-hidden mb-6 flex items-center justify-center p-8 transition-all hover:bg-slate-100">
                <img
                    src={book.coverUrl ? `${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}${book.coverUrl}` : 'https://via.placeholder.com/300x400?text=No+Cover'}
                    alt={translation.title}
                    className="w-full h-full object-contain shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-transform duration-700 ease-out group-hover:scale-105"
                />
                
                {/* Secondary Hover State (Subtle) */}
                <div className="absolute inset-0 bg-slate-900/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* Featured Badge (Minimalist) */}
                {book.featured && (
                    <div className="absolute top-4 right-4 animate-in zoom-in">
                        <span className="bg-slate-900 text-white text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-xl">
                            Featured
                        </span>
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="flex flex-col flex-grow">
                {/* Title */}
                <h3 className="font-serif text-lg text-slate-900 leading-snug mb-2 group-hover:text-bam-red transition-colors line-clamp-2">
                    {translation.title}
                </h3>

                {/* Author */}
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">
                    {translation.authorName || book.author?.name || 'By Spiritual Archives'}
                </p>

                {/* Bottom Stats Meta (Price-like aesthetic) */}
                <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-xs font-black text-slate-900 uppercase tracking-tighter">
                            {book.views || 0}
                        </span>
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">Views</span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-slate-300">
                        {book.fileUrl && (
                            <div className="flex items-center gap-1 group/icon">
                                <BookOpen size={14} className="group-hover/icon:text-slate-900 transition-colors" />
                            </div>
                        )}
                        <Eye size={14} className="hover:text-slate-900 transition-colors" />
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default BookCard;
