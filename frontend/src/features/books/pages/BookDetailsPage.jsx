import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../shared/services/axiosInstance';
import { useTranslation } from 'react-i18next';
import { BookOpen, Download, User, Calendar, Tag, Eye, ChevronLeft, Star, Heart, Share2, Info, BellRing } from 'lucide-react';
import { useSelector } from 'react-redux';
import Loader from '../../../shared/components/Loader';

const BookDetailsPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reserving, setReserving] = useState(false);
    const [reservationMsg, setReservationMsg] = useState(null);

    useEffect(() => {
        const fetchBook = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get(`/books/${slug}?lang=${i18n.language}`);
                setBook(response.data.data || response.data);
            } catch (err) {
                console.error('Failed to fetch book details', err);
                setError(t('common.error_loading') || 'Failed to load spiritual wisdom.');
            } finally {
                setLoading(false);
            }
        };
        fetchBook();
    }, [slug, i18n.language, t]);

    const handleReserve = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        setReserving(true);
        setReservationMsg(null);
        try {
            await axiosInstance.post('/reservations', { bookId: book.id });
            setReservationMsg({ type: 'success', text: 'Blessed! You are now in the reservation pool. We will notify you when it returns.' });
        } catch (err) {
            setReservationMsg({ type: 'error', text: err.response?.data?.message || 'Failed to reserve the manuscript.' });
        } finally {
            setReserving(false);
        }
    };

    if (loading) return <div className="h-[70vh] flex items-center justify-center"><Loader /></div>;

    if (error || !book) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <Info size={48} className="mx-auto text-gray-200 mb-4" />
                <h2 className="text-2xl font-bold text-bam-navy mb-4">{error || 'Book Not Found'}</h2>
                <Link to="/books" className="text-bam-red font-black uppercase text-xs tracking-widest hover:underline flex items-center justify-center gap-2">
                    <ChevronLeft size={16} /> {t('common.browse_all')}
                </Link>
            </div>
        );
    }

    const { activeTranslation: translation, categories, author } = book;
    const coverUrl = book.coverUrl 
        ? `${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}${book.coverUrl}` 
        : 'https://via.placeholder.com/600x800?text=Sacred+Archives';

    return (
        <div className="bg-white min-h-screen pb-24">
            {/* Breadcrumb / Back Button */}
            <div className="container mx-auto px-4 pt-10 pb-6">
                <Link to="/books" className="group inline-flex items-center gap-2 text-gray-400 hover:text-bam-navy transition-colors font-bold text-sm">
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-bam-navy group-hover:text-white transition-all">
                        <ChevronLeft size={18} />
                    </div>
                    {t('common.browse_all')}
                </Link>
            </div>

            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
                    
                    {/* Left Column: Cover & Quick Stats */}
                    <div className="lg:col-span-5 xl:col-span-4">
                        <div className="sticky top-24">
                            <div className="relative group perspective-1000">
                                <div className="aspect-[3/4] rounded-[2.5rem] shadow-2xl overflow-hidden border-8 border-white bg-gray-50 transform transition-transform duration-700 hover:rotate-y-6">
                                    <img 
                                        src={coverUrl} 
                                        alt={translation?.title}
                                        className="w-full h-full object-cover"
                                    />
                                    {/* Glass Overlay */}
                                    <div className="absolute inset-x-4 bottom-4 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl">
                                        <div className="flex items-center justify-between text-white">
                                            <div className="flex items-center gap-2">
                                                <Eye size={18} />
                                                <span className="text-xs font-black uppercase tracking-widest">{book.views} {t('common.views')}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Star size={16} className="text-yellow-400 fill-yellow-400" />
                                                <span className="text-sm font-black">4.9</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Social Actions */}
                            <div className="flex gap-4 mt-8">
                                <button className="flex-grow flex items-center justify-center gap-3 py-4 bg-gray-50 hover:bg-bam-red hover:text-white rounded-2xl transition-all font-black text-xs uppercase tracking-widest text-bam-navy shadow-sm">
                                    <Heart size={18} /> {t('common.save_to_list') || 'Save'}
                                </button>
                                <button className="p-4 bg-gray-50 hover:bg-bam-navy hover:text-white rounded-2xl transition-all text-bam-navy shadow-sm">
                                    <Share2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Book Details */}
                    <div className="lg:col-span-7 xl:col-span-8 space-y-10">
                        <div className="space-y-6">
                            {/* Categories Badge */}
                            <div className="flex flex-wrap gap-2">
                                {categories?.map(cat => (
                                    <span key={cat.id} className="bg-bam-red/10 text-bam-red text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] flex items-center gap-1.5">
                                        <Tag size={12} />
                                        {cat.name}
                                    </span>
                                ))}
                            </div>

                            <h1 className="text-5xl lg:text-7xl font-black text-bam-navy tracking-tighter font-serif italic leading-tight">
                                {translation?.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-8 py-6 border-y border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-bam-navy rounded-full flex items-center justify-center text-white shadow-lg">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Author</p>
                                        <p className="text-lg font-bold text-bam-navy italic font-serif">
                                            {translation?.authorName || author?.name || 'Ancient Master'}
                                        </p>
                                    </div>
                                </div>

                                <div className="h-10 w-px bg-gray-100 hidden md:block"></div>

                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-bam-red">
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Published</p>
                                        <p className="text-sm font-black text-bam-navy">
                                            {book.publishedAt ? new Date(book.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'Eternal Wisdom'}
                                        </p>
                                    </div>
                                </div>

                                {book.isbn && (
                                    <>
                                        <div className="h-10 w-px bg-gray-100 hidden md:block"></div>
                                        <div className="flex flex-col">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">ISBN</p>
                                            <p className="text-sm font-black text-bam-navy">{book.isbn}</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Description Section */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-black text-bam-navy font-serif italic flex items-center gap-3">
                                <div className="w-8 h-1 bg-bam-red rounded-full"></div>
                                {t('common.synopsis') || 'Sacred Synopsis'}
                            </h3>
                            <div className="prose prose-lg max-w-none prose-slate">
                                <p className="text-gray-600 leading-[1.8] font-medium text-lg whitespace-pre-wrap">
                                    {translation?.description}
                                </p>
                            </div>
                        </div>

                        {/* Reservation Alert Message */}
                        {reservationMsg && (
                            <div className={`p-4 rounded-2xl mb-6 text-xs font-black uppercase tracking-widest text-center border animate-in slide-in-from-top ${
                                reservationMsg.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-bam-red border-red-100'
                            }`}>
                                {reservationMsg.text}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col md:flex-row gap-6 pt-10">
                            {book.fileUrl ? (
                                <>
                                    <a 
                                        href={`${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}${book.fileUrl}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex-grow bg-bam-navy text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[.4em] flex items-center justify-center gap-4 hover:bg-bam-red transition-all shadow-2xl shadow-blue-200 hover:shadow-red-200 active:scale-[0.98]"
                                    >
                                        <BookOpen size={20} />
                                        {t('common.read_now') || 'Read Now'}
                                    </a>
                                    <a 
                                        href={`${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}${book.fileUrl}`} 
                                        download
                                        className="px-10 py-6 border-2 border-bam-navy rounded-2xl text-bam-navy font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-gray-50 transition-all active:scale-[0.98]"
                                    >
                                        <Download size={20} />
                                        {t('common.download_pdf') || 'Download PDF'}
                                    </a>
                                </>
                            ) : book.externalUrl ? (
                                <a 
                                    href={book.externalUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex-grow bg-bam-navy text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[.4em] flex items-center justify-center gap-4 hover:bg-bam-red transition-all shadow-2xl shadow-blue-200 hover:shadow-red-200"
                                >
                                    <BookOpen size={20} />
                                    {t('common.view_external_source') || 'View External Source'}
                                </a>
                            ) : (
                                <button 
                                    disabled
                                    className="flex-grow bg-gray-100 text-gray-400 py-6 rounded-2xl font-black text-xs uppercase tracking-[.4em] flex items-center justify-center gap-4 cursor-not-allowed"
                                >
                                    <Info size={20} />
                                    {t('common.content_unavailable') || 'Archives Unavailable'}
                                </button>
                            )}

                            {/* Physical Reservation Button */}
                            {book.quantity === 0 && (
                                <button 
                                    onClick={handleReserve}
                                    disabled={reserving}
                                    className="flex-grow md:flex-initial px-10 py-6 bg-bam-red text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-bam-navy transition-all shadow-xl shadow-red-100 active:scale-[0.98] disabled:opacity-50"
                                >
                                    {reserving ? <Loader /> : (
                                        <>
                                            <BellRing size={20} />
                                            Reserve Physical Copy
                                        </>
                                    )}
                                </button>
                            )}
                        </div>

                        {/* Meta Info Card */}
                        <div className="bg-gray-50 p-8 rounded-[2rem] flex flex-col md:flex-row md:items-center justify-between gap-6 border border-gray-100">
                            <div>
                                <h4 className="font-bold text-bam-navy mb-1">Book Availability</h4>
                                <p className="text-xs font-medium text-gray-500">
                                    {book.quantity > 0 
                                        ? 'This work is currently available in our physical and digital archives.' 
                                        : 'Digital study available. Physical copies are currently being studied by other seekers.'}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${book.fileUrl || book.externalUrl ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                                    {book.fileUrl || book.externalUrl ? 'Digital Copy Available' : 'No Digital Copy'}
                                </span>
                                {book.quantity > 0 ? (
                                    <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
                                        {book.quantity} Physical Copies
                                    </span>
                                ) : (
                                    <span className="bg-red-100 text-bam-red px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
                                        Out of Stock (Physical)
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDetailsPage;
