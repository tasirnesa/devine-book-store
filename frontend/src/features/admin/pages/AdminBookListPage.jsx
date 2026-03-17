import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooks } from '../../books/bookSlice';
import { Edit2, Trash2, Plus, Search, Filter, MoreVertical, Eye, X, BookOpen, User, Tag, Hash, FileText, Upload, CheckCircle } from 'lucide-react';
import Loader from '../../../shared/components/Loader';
import axiosInstance from '../../../shared/services/axiosInstance';

const AdminBookListPage = () => {
    const dispatch = useDispatch();
    const { items, loading, total, page, pageSize } = useSelector((state) => state.books);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    
    const [categories, setCategories] = useState([]);
    const [authors, setAuthors] = useState([]);
    
    const [formData, setFormData] = useState({
        title: '',
        authorId: '',
        categoryIds: [],
        isbn: '',
        quantity: 1,
        description: '',
        coverUrl: ''
    });

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
                const [catsRes, authorsRes] = await Promise.all([
                    axiosInstance.get('/categories'),
                    axiosInstance.get('/authors')
                ]);
                setCategories(catsRes.data.data);
                setAuthors(authorsRes.data.data);
            } catch (err) {
                console.error('Failed to fetch support data', err);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCategoryToggle = (catId) => {
        setFormData(prev => ({
            ...prev,
            categoryIds: prev.categoryIds.includes(catId)
                ? prev.categoryIds.filter(id => id !== catId)
                : [...prev.categoryIds, catId]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // Format data for the backend (as expected by book.service.js)
            // Backend expects translations as an array
            const payload = {
                ...formData,
                authorId: parseInt(formData.authorId),
                quantity: parseInt(formData.quantity),
                categories: formData.categoryIds,
                translations: [
                    {
                        languageId: 1, // Defaulting to 1 (usually English)
                        title: formData.title,
                        description: formData.description,
                        authorName: authors.find(a => a.id === parseInt(formData.authorId))?.name || ''
                    }
                ]
            };

            if (editingBook) {
                await axiosInstance.put(`/books/${editingBook.id}`, payload);
            } else {
                await axiosInstance.post('/books', payload);
            }
            setIsModalOpen(false);
            setEditingBook(null);
            resetForm();
            dispatch(fetchBooks({ page, pageSize }));
        } catch (err) {
            console.error('Save failed', err);
        } finally {
            setIsSubmitting(false);
        }
    };

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

    const openEditModal = (book) => {
        setEditingBook(book);
        setFormData({
            title: book.activeTranslation?.title || '',
            authorId: book.authorId || '',
            categoryIds: book.categories?.map(c => c.id) || [],
            isbn: book.isbn || '',
            quantity: book.quantity || 1,
            description: book.activeTranslation?.description || '',
            coverUrl: book.coverUrl || ''
        });
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setFormData({
            title: '',
            authorId: '',
            categoryIds: [],
            isbn: '',
            quantity: 1,
            description: '',
            coverUrl: ''
        });
    };

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-bam-navy tracking-tight font-serif italic">Library Catalog</h1>
                    <p className="text-gray-500 font-medium">Librarian's ledger for spiritual growth and management.</p>
                </div>
                <button
                    onClick={() => { setEditingBook(null); resetForm(); setIsModalOpen(true); }}
                    className="bg-bam-navy text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-bam-red transition-all flex items-center justify-center gap-3 shadow-2xl shadow-blue-100 hover:shadow-red-100"
                >
                    <Plus size={20} />
                    Acquire New Volume
                </button>
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
                                                <button onClick={() => openEditModal(book)} className="p-3 text-blue-500 bg-blue-50/50 hover:bg-blue-500 hover:text-white rounded-2xl transition-all" title="Edit">
                                                    <Edit2 size={18} />
                                                </button>
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

            {/* Full CRUD Modal (Side Drawer) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-end">
                    <div className="absolute inset-0 bg-bam-navy/60 backdrop-blur-md animate-in fade-in" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative w-full max-w-2xl h-full bg-white shadow-2xl animate-in slide-in-from-right duration-500 p-12 flex flex-col overflow-y-auto">
                        <div className="flex items-center justify-between mb-12">
                            <div>
                                <h1 className="text-4xl font-serif font-black text-bam-navy italic">{editingBook ? 'Edit Volume' : 'New Acquisition'}</h1>
                                <p className="text-gray-400 text-xs font-black uppercase tracking-widest mt-2">{editingBook ? 'Updating Archives' : 'Adding to Spiritual Collection'}</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-4 bg-gray-50 rounded-3xl text-gray-400 hover:text-bam-red hover:rotate-90 transition-all">
                                <X size={28} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-10 pb-12">
                            {/* Title & Author */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2">Book Title</label>
                                    <div className="relative">
                                        <BookOpen className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                        <input
                                            type="text"
                                            name="title"
                                            required
                                            className="w-full bg-gray-50 border-none rounded-3xl py-5 pl-14 pr-6 text-sm font-bold text-bam-navy focus:ring-4 focus:ring-bam-navy/5"
                                            placeholder="The Celestial Path"
                                            value={formData.title}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2">Author</label>
                                    <div className="relative">
                                        <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                        <select
                                            name="authorId"
                                            required
                                            className="w-full bg-gray-50 border-none rounded-3xl py-5 pl-14 pr-6 text-sm font-bold text-bam-navy focus:ring-4 focus:ring-bam-navy/5 appearance-none"
                                            value={formData.authorId}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select Author</option>
                                            {authors.map(author => <option key={author.id} value={author.id}>{author.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Categories Selection */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between ml-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Spiritual Categories</label>
                                    <span className="text-[10px] font-bold text-bam-red bg-red-50 px-2 py-0.5 rounded uppercase tracking-widest">{formData.categoryIds.length} Selected</span>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {categories.map(cat => (
                                        <button
                                            key={cat.id}
                                            type="button"
                                            onClick={() => handleCategoryToggle(cat.id)}
                                            className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all flex items-center gap-2 ${formData.categoryIds.includes(cat.id)
                                                ? 'bg-bam-navy text-white border-bam-navy shadow-lg shadow-blue-100'
                                                : 'bg-white text-gray-400 border-gray-100 hover:border-bam-navy/20'
                                                }`}
                                        >
                                            {formData.categoryIds.includes(cat.id) && <CheckCircle size={14} />}
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* ISBN & Quantity */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2">ISBN / Identifer</label>
                                    <div className="relative">
                                        <Hash className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                        <input
                                            type="text"
                                            name="isbn"
                                            className="w-full bg-gray-50 border-none rounded-3xl py-5 pl-14 pr-6 text-sm font-bold text-bam-navy focus:ring-4 focus:ring-bam-navy/5"
                                            placeholder="978-XXXXXXXXXX"
                                            value={formData.isbn}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2">Total Quantity</label>
                                    <div className="relative">
                                        <Tag className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                        <input
                                            type="number"
                                            name="quantity"
                                            min="0"
                                            required
                                            className="w-full bg-gray-50 border-none rounded-3xl py-5 pl-14 pr-6 text-sm font-bold text-bam-navy focus:ring-4 focus:ring-bam-navy/5"
                                            value={formData.quantity}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Cover URL (Placeholder for actual upload) */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2">Cover Art URL</label>
                                <div className="relative">
                                    <Upload className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                    <input
                                        type="text"
                                        name="coverUrl"
                                        className="w-full bg-gray-50 border-none rounded-3xl py-5 pl-14 pr-6 text-sm font-bold text-bam-navy focus:ring-4 focus:ring-bam-navy/5"
                                        placeholder="https://example.com/cover.jpg"
                                        value={formData.coverUrl}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2">Archives Description (English)</label>
                                <div className="relative">
                                    <FileText className="absolute left-5 top-7 text-gray-300" size={18} />
                                    <textarea
                                        name="description"
                                        rows="6"
                                        className="w-full bg-gray-50 border-none rounded-[2rem] py-6 pl-14 pr-6 text-sm font-bold text-bam-navy focus:ring-4 focus:ring-bam-navy/5 resize-none"
                                        placeholder="Describe the wisdom contained within..."
                                        value={formData.description}
                                        onChange={handleChange}
                                    ></textarea>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-10 flex flex-col md:flex-row gap-6">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 bg-bam-navy text-white py-6 rounded-3xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-blue-200 hover:bg-bam-red hover:shadow-red-200 transition-all flex items-center justify-center gap-4 active:scale-95"
                                >
                                    {isSubmitting ? <Loader /> : (editingBook ? 'Seal Updates' : 'Acquire Volume')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setIsModalOpen(false); setEditingBook(null); resetForm(); }}
                                    className="px-12 py-6 rounded-3xl text-gray-400 font-black text-xs uppercase tracking-[0.3em] hover:bg-gray-100 transition-all border border-gray-100"
                                >
                                    Discard
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminBookListPage;
