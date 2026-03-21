import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, Download, Maximize2, X, Info, Loader2 } from 'lucide-react';
import axiosInstance from '../../../shared/services/axiosInstance';
import Loader from '../../../shared/components/Loader';

const BookReaderPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBook = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get(`/books/${slug}?lang=${i18n.language}`);
                setBook(response.data.data || response.data);
            } catch (err) {
                console.error('Failed to fetch book for reader', err);
                setError(t('common.error_loading') || 'Failed to load the sacred manuscript.');
            } finally {
                setLoading(false);
            }
        };
        fetchBook();
    }, [slug, i18n.language, t]);

    const handleExit = () => {
        navigate(`/books/${slug}`);
    };

    if (loading) return (
        <div className="h-screen w-screen bg-bam-navy flex flex-col items-center justify-center text-white">
            <Loader2 className="animate-spin mb-4" size={48} />
            <p className="font-serif italic text-lg tracking-widest animate-pulse">Opening Sacred Archives...</p>
        </div>
    );

    if (error || !book?.fileUrl) {
        return (
            <div className="h-screen w-screen bg-white flex flex-col items-center justify-center p-6 text-center">
                <div className="max-w-md space-y-6">
                    <div className="w-20 h-20 bg-red-50 text-bam-red rounded-full flex items-center justify-center mx-auto mb-6">
                        <Info size={40} />
                    </div>
                    <h2 className="text-3xl font-black text-bam-navy tracking-tight">{error || 'Manuscript Not Available'}</h2>
                    <p className="text-gray-500 font-medium">This manuscript does not have a digital version available in our online archives at this time.</p>
                    <button 
                        onClick={handleExit}
                        className="inline-flex items-center gap-2 px-8 py-3 bg-bam-navy text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-bam-red transition-all"
                    >
                        <ChevronLeft size={16} /> Return to Details
                    </button>
                </div>
            </div>
        );
    }

    const { activeTranslation: translation } = book;
    const fileUrl = `${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}${book.fileUrl}`;

    return (
        <div className="h-screen w-screen bg-neutral-900 flex flex-col overflow-hidden">
            {/* Reader Header */}
            <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10 shadow-sm">
                <div className="flex items-center gap-4 truncate">
                    <button 
                        onClick={handleExit}
                        className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-bam-navy hover:bg-bam-red hover:text-white transition-all shadow-sm"
                        title="Exit Reader"
                    >
                        <X size={20} />
                    </button>
                    <div className="truncate">
                        <h1 className="font-serif font-black text-bam-navy italic truncate max-w-[200px] md:max-w-md leading-none mb-1">
                            {translation?.title}
                        </h1>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Digital Archive</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <a 
                        href={fileUrl} 
                        download
                        className="hidden md:flex items-center gap-2 px-6 py-2.5 bg-gray-50 text-bam-navy rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-bam-navy hover:text-white transition-all border border-gray-100"
                    >
                        <Download size={14} /> Download PDF
                    </a>
                    <button 
                        className="p-2.5 text-gray-400 hover:text-bam-navy transition-colors"
                        onClick={() => {
                            if (document.documentElement.requestFullscreen) {
                                if (!document.fullscreenElement) {
                                    document.documentElement.requestFullscreen();
                                } else {
                                    document.exitFullscreen();
                                }
                            }
                        }}
                    >
                        <Maximize2 size={20} />
                    </button>
                </div>
            </header>

            {/* Main Content Area: PDF Viewer */}
            <main className="flex-grow relative bg-neutral-800">
                <iframe 
                    src={`${fileUrl}#toolbar=1&navpanes=0&view=FitH`}
                    className="w-full h-full border-none"
                    title={translation?.title}
                />
            </main>

            {/* Mobile Download Footer */}
            <div className="md:hidden p-4 bg-white border-t border-gray-200">
                <a 
                    href={fileUrl} 
                    download
                    className="w-full h-12 flex items-center justify-center gap-2 bg-bam-navy text-white rounded-xl font-black text-[10px] uppercase tracking-widest active:scale-[0.98] transition-all"
                >
                    <Download size={16} /> Download Manuscript
                </a>
            </div>
        </div>
    );
};

export default BookReaderPage;
