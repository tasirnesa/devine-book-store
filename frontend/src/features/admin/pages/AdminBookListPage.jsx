import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchBooks } from '../../books/bookSlice';
import { Edit2, Trash2, Plus, Search, Filter, MoreVertical, Eye, X, BookOpen, User, Tag, Hash, FileText, Upload, CheckCircle } from 'lucide-react';
import Loader from '../../../shared/components/Loader';
import axiosInstance from '../../../shared/services/axiosInstance';

const AdminBookListPage = () => {
    const dispatch = useDispatch();
    const { items, loading, total, page, pageSize } = useSelector((state) => state.books);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [categories, setCategories] = useState([]);
    
    const [filters, setFilters] = useState({
        category: '',
        status: 'all'
    });

    useEffect(() => {
        dispatch(fetchBooks({ page, pageSize, search: searchTerm, ...filters }));
    }, [dispatch, page, pageSize, searchTerm, filters]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const catsRes = await axiosInstance.get('/categories');
                setCategories(catsRes.data.data);
            } catch (err) {
                console.error('Failed to fetch support data', err);
            }
        };
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this spiritual work?')) {
            try {
                await axiosInstance.delete(`/books/${id}`);
                dispatch(fetchBooks({ page, pageSize }));
            } catch (err) {
                console.error('Delete failed', err);
            }
        }
    };

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-bam-navy tracking-tight font-serif italic">Library Catalog</h1>
                    <p className="text-gray-500 font-medium">Librarian's ledger for spiritual growth and management.</p>
                </div>
                <Link
                    to="/admin/books/add"
                    className="bg-bam-navy text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-bam-red transition-all flex items-center justify-center gap-3 shadow-2xl shadow-blue-100 hover:shadow-red-100"
                >
                    <Plus size={20} />
                    Acquire New Volume
                </Link>
            </div>

            {/* Premium Filters & Search */}
            <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col xl:flex-row items-center gap-6">
                <div className="relative flex-grow w-full">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by Title, Author, or ISBN..."
                        className="w-full bg-gray-50 border-none rounded-2xl py-5 pl-16 pr-6 text-sm font-bold text-bam-navy focus:ring-2 focus:ring-bam-navy/5 placeholder:text-gray-300 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
                    <select 
                        className="bg-gray-50 border-none rounded-2xl py-5 px-6 text-xs font-black uppercase tracking-widest text-bam-navy"
                        value={filters.category}
                        onChange={(e) => setFilters(f => ({ ...f, category: e.target.value }))}
                    >
                        <option value="">All Categories</option>
                        {categories.map(cat => <option key={cat.id} value={cat.slug}>{cat.name}</option>)}
                    </select>
                    <div className="h-10 w-[1px] bg-gray-100 hidden lg:block"></div>
                    <div className="bg-gray-50 px-6 py-5 rounded-2xl flex items-center gap-3">
                        <Filter size={18} className="text-bam-red" />
                        <span className="text-xs font-black text-bam-navy uppercase tracking-widest whitespace-nowrap">
                            Total: <span className="text-bam-red font-serif italic text-base ml-1">{total}</span>
                        </span>
                    </div>
                </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/30 border-b border-gray-100">
                                <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Spiritual Volume</th>
                                <th className="px-8 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Author / Category</th>
                                <th className="px-8 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Inventory</th>
                                <th className="px-8 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Status</th>
                                <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="py-32 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <Loader />
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Consulting Archives...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : items.length > 0 ? (
                                items.map((book) => (
                                    <tr key={book.id} className="hover:bg-gray-50/50 transition-all group">
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-24 bg-gray-100 rounded-xl overflow-hidden border border-gray-100 shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                                                    <img
                                                        src={book.coverUrl ? (book.coverUrl.startsWith('http') ? book.coverUrl : `${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}${book.coverUrl}`) : 'https://via.placeholder.com/300x400'}
                                                        alt=""
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="max-w-[280px]">
                                                    <h4 className="font-bold text-bam-navy text-base leading-tight mb-1 group-hover:text-bam-red transition-colors">{book.activeTranslation?.title || 'Unknown Title'}</h4>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                                                            <Hash size={10} />
                                                            {book.slug || 'no-slug'}
                                                        </span>
                                                        <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                                                            <Eye size={10} />
                                                            {book.views}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="space-y-2">
                                                <p className="text-xs font-black text-bam-navy uppercase tracking-widest">{book.activeTranslation?.authorName || 'Anonymous'}</p>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {book.categories?.map(cat => (
                                                        <span key={cat.id} className="bg-gray-50 text-gray-400 text-[9px] font-black px-2 py-1 rounded-lg uppercase border border-gray-100">
                                                            {cat.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xl font-black text-bam-navy font-serif italic">{book.quantity || 0}</span>
                                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Total Copies</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${book.quantity > 0 ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                                                {book.quantity > 0 ? 'Available' : 'Out of Stock'}
                                            </span>
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                                <Link to={`/admin/books/edit/${book.id}`} className="p-3 text-blue-500 bg-blue-50/50 hover:bg-blue-500 hover:text-white rounded-2xl transition-all" title="Edit">
                                                    <Edit2 size={18} />
                                                </Link>
                                                <button onClick={() => handleDelete(book.id)} className="p-3 text-red-500 bg-red-50/50 hover:bg-bam-red hover:text-white rounded-2xl transition-all" title="Delete">
                                                    <Trash2 size={18} />
                                                </button>
                                                <button className="p-3 text-gray-400 hover:bg-gray-100 rounded-2xl transition-all">
                                                    <MoreVertical size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="py-32 text-center opacity-40">
                                        <BookOpen size={64} className="mx-auto text-gray-300 mb-6" strokeWidth={1} />
                                        <p className="text-sm font-black text-gray-400 uppercase tracking-widest">The archives are currently empty.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminBookListPage;
