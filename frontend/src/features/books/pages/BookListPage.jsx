import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { fetchBooks, setFilters, setPage } from '../bookSlice';
import BookCard from '../components/BookCard';
import BookCarousel from '../components/BookCarousel';
import Loader from '../../../shared/components/Loader';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

const BookListPage = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { items, loading, total, page, pageSize, filters } = useSelector((state) => state.books);

    const isFiltered = filters.search || filters.category || filters.language;

    useEffect(() => {
        dispatch(fetchBooks({
            page,
            pageSize,
            ...filters
        }));
    }, [dispatch, page, pageSize, filters]);

    const handlePageChange = (newPage) => {
        dispatch(setPage(newPage));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const totalPages = Math.ceil(total / pageSize);

    const featuredBooks = items.filter(b => b.featured).slice(0, 10);
    const spiritualBooks = items.filter(b => b.categories?.some(c => c.slug === 'spirituality')).slice(0, 10);

    return (
        <div className="bg-white min-h-screen pb-20">
            {/* BAM Hero Section with Texture */}
            <div className="relative pt-20 pb-12 border-b border-gray-100 mb-12 overflow-hidden">
                {/* Subtle SVG Pattern Overlay */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23002f5d' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>

                <div className="container mx-auto px-4 text-center relative z-10">
                    <div className="inline-block mb-4">
                        <span className="bg-bam-red/10 text-bam-red text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em]">
                            Curated Collections
                        </span>
                    </div>
                    <h1 className="text-6xl font-black text-bam-navy tracking-tighter mb-4 font-serif leading-tight">
                        {filters.category ? filters.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'The Spiritual Library'}
                    </h1>
                    <div className="flex items-center justify-center gap-4 text-gray-400 italic font-serif text-xl">
                        <span className="h-[1px] w-12 bg-gray-200"></span>
                        <p className="tracking-wide">Deepen Your Understanding, Elevate Your Soul</p>
                        <span className="h-[1px] w-12 bg-gray-200"></span>
                    </div>
                </div>
            </div>

            {!isFiltered && page === 1 ? (
                <div className="space-y-4">
                    <BookCarousel
                        title={t('books.featured_title')}
                        subtitle={t('books.featured_subtitle')}
                        books={featuredBooks}
                        loading={loading}
                    />

                    <BookCarousel
                        title={t('books.popular_title')}
                        subtitle={t('books.popular_subtitle')}
                        books={spiritualBooks}
                        loading={loading}
                    />

                    <div className="container mx-auto px-4 mt-12">
                        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                            <h2 className="text-2xl font-bold text-bam-navy tracking-tight uppercase">{t('books.full_collection')}</h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                            {items.map((book) => (
                                <BookCard key={book.id} book={book} />
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                /* Full Width Results View */
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
                        <p className="text-gray-500 font-medium text-sm">
                            {t('books.showing_results', { count: items.length, total: total })}
                        </p>

                        <div className="flex items-center gap-3">
                            <span className="text-[11px] font-black text-bam-navy uppercase">{t('books.sort_by')}</span>
                            <select
                                value={filters.sort}
                                onChange={(e) => dispatch(setFilters({ sort: e.target.value }))}
                                className="bg-transparent text-sm font-bold border-none focus:ring-0 cursor-pointer text-bam-navy pl-0"
                            >
                                <option value="newest">{t('books.newest_arrivals') || 'Newest Arrivals'}</option>
                                <option value="popular">{t('books.most_popular') || 'Most Popular'}</option>
                                <option value="oldest">{t('books.oldest_first') || 'Oldest First'}</option>
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="h-64 flex items-center justify-center">
                            <Loader />
                        </div>
                    ) : items.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-12">
                            {items.map((book) => (
                                <BookCard key={book.id} book={book} />
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-3xl">
                            <Search size={48} className="mx-auto text-gray-200 mb-4" />
                            <h3 className="text-xl font-bold text-bam-navy mb-2">{t('books.no_results')}</h3>
                            <button
                                onClick={() => dispatch(setFilters({ search: '', category: '', language: '' }))}
                                className="mt-6 text-bam-red font-black uppercase text-xs tracking-widest hover:underline"
                            >
                                {t('books.clear_filters')}
                            </button>
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-16 border-t border-gray-100 pt-8">
                            <button
                                disabled={page === 1}
                                onClick={() => handlePageChange(page - 1)}
                                className="p-3 rounded-full hover:bg-gray-50 border border-transparent disabled:opacity-20 transition-all font-bold text-bam-navy"
                            >
                                <ChevronLeft size={24} />
                            </button>

                            <div className="flex items-center gap-1">
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => handlePageChange(i + 1)}
                                        className={`min-w-[44px] h-[44px] rounded-full font-black text-sm transition-all ${page === i + 1
                                            ? 'bg-bam-navy text-white shadow-xl'
                                            : 'text-gray-400 hover:text-bam-navy hover:bg-gray-50'
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>

                            <button
                                disabled={page === totalPages}
                                onClick={() => handlePageChange(page + 1)}
                                className="p-3 rounded-full hover:bg-gray-50 border border-transparent disabled:opacity-20 transition-all font-bold text-bam-navy"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default BookListPage;
