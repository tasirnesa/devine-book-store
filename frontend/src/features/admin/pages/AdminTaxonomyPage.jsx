import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../shared/services/axiosInstance';
import { Tag, User, Plus, Edit2, Trash2, Search, X, Layers, UserPlus } from 'lucide-react';
import Loader from '../../../shared/components/Loader';

const AdminTaxonomyPage = () => {
    const [activeTab, setActiveTab] = useState('categories'); // 'categories' or 'authors'
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({ name: '', slug: '', bio: '', icon: '' });

    const fetchData = async () => {
        setLoading(true);
        try {
            const endpoint = activeTab === 'categories' ? '/categories' : '/authors';
            const response = await axiosInstance.get(endpoint);
            setData(response.data.data);
        } catch (err) {
            console.error('Failed to fetch data', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        setSearchTerm('');
    }, [activeTab]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const endpoint = activeTab === 'categories' ? '/categories' : '/authors';
            if (editingItem) {
                await axiosInstance.put(`${endpoint}/${editingItem.id}`, formData);
            } else {
                await axiosInstance.post(endpoint, formData);
            }
            setIsModalOpen(false);
            setEditingItem(null);
            setFormData({ name: '', slug: '', bio: '', icon: '' });
            fetchData();
        } catch (err) {
            console.error('Save failed', err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm(`Are you sure you want to delete this ${activeTab === 'categories' ? 'category' : 'author'}?`)) return;
        try {
            const endpoint = activeTab === 'categories' ? '/categories' : '/authors';
            await axiosInstance.delete(`${endpoint}/${id}`);
            fetchData();
        } catch (err) {
            console.error('Delete failed', err);
        }
    };

    const openEditModal = (item) => {
        setEditingItem(item);
        setFormData({
            name: item.name || '',
            slug: item.slug || '',
            bio: item.bio || '',
            icon: item.icon || ''
        });
        setIsModalOpen(true);
    };

    const filteredData = data.filter(item => 
        (item.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-bam-navy tracking-tight font-serif italic">Taxonomy Management</h1>
                    <p className="text-gray-500 text-sm font-medium">Categorize and organize spiritual wisdom.</p>
                </div>
                <button
                    onClick={() => { setEditingItem(null); setFormData({ name: '', slug: '', bio: '', icon: '' }); setIsModalOpen(true); }}
                    className="bg-bam-navy text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-bam-red transition-all shadow-xl shadow-blue-100 hover:shadow-red-50"
                >
                    <Plus size={18} />
                    Add {activeTab === 'categories' ? 'Category' : 'Author'}
                </button>
            </div>

            {/* Tabs */}
            <div className="flex p-1 bg-gray-100 rounded-2xl w-fit">
                <button
                    onClick={() => setActiveTab('categories')}
                    className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'categories' ? 'bg-white text-bam-navy shadow-sm' : 'text-gray-400 hover:text-bam-navy'}`}
                >
                    Categories
                </button>
                <button
                    onClick={() => setActiveTab('authors')}
                    className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'authors' ? 'bg-white text-bam-navy shadow-sm' : 'text-gray-400 hover:text-bam-navy'}`}
                >
                    Authors
                </button>
            </div>

            {/* Controls */}
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder={`Search ${activeTab}...`}
                        className="w-full bg-gray-50 border-none rounded-xl py-4 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-bam-navy/5 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                    {activeTab === 'categories' ? 'Category Name' : 'Author Name'}
                                </th>
                                <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Slug</th>
                                {activeTab === 'authors' && <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Bio Snapshot</th>}
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={activeTab === 'authors' ? "4" : "3"} className="py-24 text-center">
                                        <Loader />
                                    </td>
                                </tr>
                            ) : filteredData.length > 0 ? (
                                filteredData.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50/30 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-bam-navy/5 rounded-xl flex items-center justify-center text-bam-navy">
                                                    {activeTab === 'categories' ? <Tag size={18} /> : <User size={18} />}
                                                </div>
                                                <span className="font-bold text-bam-navy text-sm">{item.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-xs font-medium text-gray-400">/{item.slug}</td>
                                        {activeTab === 'authors' && (
                                            <td className="px-6 py-5">
                                                <p className="text-[11px] text-gray-500 line-clamp-1 max-w-xs">{item.bio || 'No bio provided'}</p>
                                            </td>
                                        )}
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => openEditModal(item)} className="p-2.5 text-gray-400 hover:text-bam-navy hover:bg-gray-100 rounded-xl transition-all">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(item.id)} className="p-2.5 text-gray-400 hover:text-bam-red hover:bg-red-50 rounded-xl transition-all">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={activeTab === 'authors' ? "4" : "3"} className="py-24 text-center opacity-30">
                                        <Layers size={48} className="mx-auto mb-4" />
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">No entries found</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-bam-navy/50 backdrop-blur-sm animate-in fade-in" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl animate-in zoom-in duration-300 overflow-hidden">
                        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-serif font-black text-bam-navy italic">{editingItem ? 'Edit' : 'Add'} {activeTab === 'categories' ? 'Category' : 'Author'}</h2>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-bam-red transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Name</label>
                                <input
                                    required
                                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-bam-navy focus:ring-2 focus:ring-bam-navy/5"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    placeholder={`Enter ${activeTab} name...`}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Slug</label>
                                <input
                                    required
                                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-bam-navy focus:ring-2 focus:ring-bam-navy/5"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                                    placeholder="e.g. ancient-wisdom"
                                />
                            </div>

                            {activeTab === 'authors' && (
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Biography</label>
                                    <textarea
                                        className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-medium text-gray-600 focus:ring-2 focus:ring-bam-navy/5"
                                        rows="4"
                                        value={formData.bio}
                                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                        placeholder="Enter author biography..."
                                    ></textarea>
                                </div>
                            )}

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="w-full bg-bam-navy text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-blue-200 hover:bg-bam-red hover:shadow-red-200 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                                >
                                    {editingItem ? 'Save Changes' : `Add ${activeTab === 'categories' ? 'Category' : 'Author'}`}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminTaxonomyPage;
