import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../shared/services/axiosInstance';
import { Book, Users, Layers, TrendingUp, Clock, ChevronRight } from 'lucide-react';
import Loader from '../../../shared/components/Loader';

const AdminDashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axiosInstance.get('/admin/stats');
                setStats(response.data.data);
            } catch (err) {
                console.error('Failed to fetch admin stats', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <Loader />;

    const statCards = [
        { label: 'Total Books', value: stats?.counts?.books || 0, icon: Book, color: 'bg-blue-500' },
        { label: 'Total Users', value: stats?.counts?.users || 0, icon: Users, color: 'bg-purple-500' },
        { label: 'Categories', value: stats?.counts?.categories || 0, icon: Layers, color: 'bg-orange-500' },
        { label: 'Active Readers', value: '1,284', icon: TrendingUp, color: 'bg-green-500' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-bam-navy tracking-tight font-serif">Welcome back, Admin</h1>
                    <p className="text-gray-500">Here's what's happening in your library today.</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-black text-bam-navy uppercase tracking-widest">System Online</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6">
                        <div className={`${stat.color} p-4 rounded-2xl text-white shadow-lg shadow-${stat.color.split('-')[1]}-200`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                            <h3 className="text-2xl font-black text-bam-navy tracking-tighter">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                        <h2 className="text-lg font-black text-bam-navy uppercase tracking-widest flex items-center gap-2">
                            <Clock size={18} className="text-bam-red" />
                            Recent Additions
                        </h2>
                        <button className="text-[10px] font-black text-bam-red uppercase tracking-widest hover:underline">View All</button>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {stats?.recentBooks?.map((book) => (
                            <div key={book.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                                        <img
                                            src={book.coverUrl ? `${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}${book.coverUrl}` : 'https://via.placeholder.com/300x400'}
                                            alt=""
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-bam-navy text-sm">{book.translations?.[0]?.title || 'Untitled Book'}</h4>
                                        <p className="text-xs text-gray-400">Added on {new Date(book.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <ChevronRight className="text-gray-300 group-hover:text-bam-navy transition-colors" size={18} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* System Health / Quick Tips */}
                <div className="bg-bam-navy rounded-3xl p-8 text-white relative overflow-hidden">
                    <div className="relative z-10 space-y-6">
                        <h3 className="text-xl font-serif font-black italic">Pro Librarian Tip</h3>
                        <p className="text-sm opacity-70 leading-relaxed font-medium">
                            "Keeping your book descriptions detailed and adding correct categories helps users find their next spiritual journey faster."
                        </p>
                        <div className="pt-4">
                            <button className="bg-bam-red text-white px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-xl shadow-red-900/50">
                                Add New Book
                            </button>
                        </div>
                    </div>
                    {/* Decorative element */}
                    <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
