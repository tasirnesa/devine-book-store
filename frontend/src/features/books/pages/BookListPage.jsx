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

    const isFiltered = filters.search || filters.category;

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
            {/* Minimalist Hero Section */}
            <div className="container mx-auto px-6 pt-16 pb-12">
                <h1 className="text-4xl md:text-5xl font-serif text-slate-900 tracking-tight mb-12">
                    Discover books by
                </h1>

                {/* Filter and Stats Bar */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-100 pb-12 mb-12">
                    {/* Dropdown Filters */}
                    <div className="flex flex-wrap items-center gap-4">
                        {[
                            { label: 'IMPRINT', value: filters.category || 'All' },
                            { label: 'AUTHOR', value: 'All' },
                            { label: 'SERIES', value: 'All' },
                            { label: 'TOPIC', value: 'All' }
                        ].map((filter) => (
                            <div key={filter.label} className="relative group">
                                <button className="flex items-center gap-8 bg-slate-50 border border-slate-100 px-6 py-3 rounded-full transition-all hover:bg-white hover:border-slate-200">
                                    <div className="flex flex-col items-start">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{filter.label}</span>
                                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">{filter.value}</span>
                                    </div>
                                    <ChevronDown size={14} className="text-slate-400 group-hover:text-slate-800 transition-colors" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Results and Controls */}
                    <div className="flex items-center gap-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        <div className="flex items-center gap-2">
                            <span className="text-slate-900">{total}</span>
                            <span>Results</span>
                        </div>

                        <div className="flex items-center gap-3 group cursor-pointer">
                            <span className="group-hover:text-slate-900 transition-colors">{pageSize} Per Page</span>
                            <ChevronDown size={12} />
                        </div>

                        <div className="flex items-center gap-3 group cursor-pointer">
                            <span className="group-hover:text-slate-900 transition-colors">
                                {filters.sort === 'newest' ? 'Publication (Newest)' : 'Publication (Oldest)'}
                            </span>
                            <ChevronDown size={12} />
                        </div>
                    </div>
                </div>

                {/* Books Grid */}
                {loading ? (
                    <div className="h-96 flex items-center justify-center">
                        <Loader />
                    </div>
                ) : items.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-8 gap-y-16">
                        {items.map((book) => (
                            <BookCard key={book.id} book={book} />
                        ))}
                    </div>
                ) : (
                    <div className="py-32 text-center bg-slate-50 rounded-3xl border border-slate-100">
                        <Search size={48} className="mx-auto text-slate-200 mb-6" />
                        <h3 className="text-xl font-serif text-slate-900 mb-2">No books found in this spiritual collection</h3>
                        <button
                            onClick={() => dispatch(setFilters({ search: '', category: '', language: '' }))}
                            className="mt-6 text-xs font-black uppercase tracking-[0.3em] text-bam-red hover:underline"
                        >
                            Reset Archives
                        </button>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-24">
                        <button
                            disabled={page === 1}
                            onClick={() => handlePageChange(page - 1)}
                            className="w-12 h-12 flex items-center justify-center rounded-full border border-slate-100 text-slate-400 hover:text-slate-900 hover:border-slate-300 disabled:opacity-20 transition-all font-bold"
                        >
                            <ChevronLeft size={20} />
                        </button>

                        <div className="flex items-center gap-2">
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => handlePageChange(i + 1)}
                                    className={`w-12 h-12 rounded-full font-black text-xs uppercase tracking-tighter transition-all ${page === i + 1
                                        ? 'bg-slate-900 text-white shadow-lg'
                                        : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>

                        <button
                            disabled={page === totalPages}
                            onClick={() => handlePageChange(page + 1)}
                            className="w-12 h-12 flex items-center justify-center rounded-full border border-slate-100 text-slate-400 hover:text-slate-900 hover:border-slate-300 disabled:opacity-20 transition-all font-bold"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookListPage;
