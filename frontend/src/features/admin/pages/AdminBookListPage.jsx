import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchBooks } from '../../books/bookSlice';
import { Edit2, Trash2, Plus, Search, Filter, MoreVertical, Eye } from 'lucide-react';
import Loader from '../../../shared/components/Loader';
import axiosInstance from '../../../shared/services/axiosInstance';

const AdminBookListPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items, loading, total, page, pageSize } = useSelector((state) => state.books);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(fetchBooks({ page, pageSize }));
    }, [dispatch, page, pageSize]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this book? This action cannot be undone.')) {
            try {
                await axiosInstance.delete(`/books/${id}`);
                dispatch(fetchBooks({ page, pageSize }));
                alert('Book deleted successfully');
            } catch (err) {
                console.error('Failed to delete book', err);
                alert('Error deleting book. Please check permissions.');
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-bam-navy tracking-tight font-serif">Library Catalog</h1>
                    <p className="text-gray-500 text-sm">Manage your collection of spiritual works.</p>
                </div>
                <button
                    onClick={() => navigate('/admin/books/add')}
                    className="bg-bam-red text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-red-100"
                >
                    <Plus size={18} />
                    Add New Book
                </button>
            </div>

            {/* Table Controls */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by title, author, or ISBN..."
                        className="w-full bg-gray-50 border-none rounded-xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-bam-navy/5 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button className="bg-gray-50 p-3 rounded-xl text-bam-navy hover:bg-gray-100 transition-colors border border-gray-100">
                        <Filter size={20} />
                    </button>
                    <div className="hidden md:block h-6 w-[1px] bg-gray-200 mx-2"></div>
                    <p className="text-xs font-black text-bam-navy uppercase tracking-widest whitespace-nowrap">
                        Total: <span className="text-bam-red">{total} Books</span>
                    </p>
                </div>
            </div>

            {/* Books Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Book Details</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Category</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Stats</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Date Added</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="py-20 text-center"><Loader /></td>
                                </tr>
                            ) : items.length > 0 ? (
                                items.map((book) => (
                                    <tr key={book.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-16 bg-gray-100 rounded-lg overflow-hidden border border-gray-100 shrink-0">
                                                    <img
                                                        src={book.coverUrl ? `${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}${book.coverUrl}` : 'https://via.placeholder.com/300x400'}
                                                        alt=""
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="max-w-[200px]">
                                                    <h4 className="font-bold text-bam-navy text-sm truncate">{book.activeTranslation?.title || 'Unknown Title'}</h4>
                                                    <p className="text-xs text-gray-400 truncate">By {book.activeTranslation?.authorName || 'Unknown Author'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {book.categories?.slice(0, 2).map(cat => (
                                                    <span key={cat.id} className="bg-gray-100 text-bam-navy text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-tighter">
                                                        {cat.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-gray-400 text-xs font-bold">
                                                <Eye size={14} className="text-bam-red" />
                                                <span>{book.views} views</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-bold text-gray-500">
                                            {new Date(book.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => navigate(`/admin/books/edit/${book.id}`)}
                                                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(book.id)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                                <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors">
                                                    <MoreVertical size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="py-20 text-center text-gray-400 font-bold">No books found in catalog.</td>
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
