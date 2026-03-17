import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../shared/services/axiosInstance';
import { Book, Users, Layers, TrendingUp, Clock, ChevronRight, BookmarkCheck, Inbox, Activity, Calendar } from 'lucide-react';
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

    if (loading) return (
        <div className="h-[60vh] flex items-center justify-center">
            <Loader />
        </div>
    );

    const statCards = [
        { label: 'Total Books', value: stats?.counts?.books || 0, icon: Book, color: 'bg-bam-navy', sub: 'Across all languages' },
        { label: 'Available', value: stats?.counts?.availableBooks || 0, icon: BookmarkCheck, color: 'bg-green-500', sub: 'Ready to borrow' },
        { label: 'Borrowed', value: stats?.counts?.borrowedBooks || 0, icon: Inbox, color: 'bg-bam-red', sub: 'Currently issued' },
        { label: 'Total Members', value: stats?.counts?.users || 0, icon: Users, color: 'bg-purple-600', sub: 'Spiritual community' },
    ];

    return (
        <div className="space-y-10 pb-12">
            <div>
                <h1 className="text-4xl font-black text-bam-navy tracking-tight font-serif italic">Library Overview</h1>
                <p className="text-gray-500 font-medium">Monitoring the pulse of our spiritual collections.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, idx) => (
                    <div key={idx} className="bg-white p-7 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col gap-6 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div className={`${stat.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                            <stat.icon size={26} />
                        </div>
                        <div>
                            <h3 className="text-4xl font-black text-bam-navy tracking-tighter mb-1">{stat.value}</h3>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{stat.label}</p>
                            <p className="text-xs text-gray-400 mt-2 font-medium opacity-0 group-hover:opacity-100 transition-opacity">{stat.sub}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Borrow Trends (Mock Visualization) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-xl font-black text-bam-navy uppercase tracking-widest flex items-center gap-2">
                                    <TrendingUp size={20} className="text-bam-red" />
                                    Borrow Trends
                                </h2>
                                <p className="text-xs text-gray-400 font-medium mt-1">Book issuance activity over the last 7 days</p>
                            </div>
                            <select className="bg-gray-50 border-none rounded-xl text-xs font-black uppercase tracking-widest px-4 py-2 text-bam-navy">
                                <option>Weekly</option>
                                <option>Monthly</option>
                            </select>
                        </div>
                        
                        {/* CSS Bar Chart */}
                        <div className="flex items-end justify-between h-48 gap-4 px-2">
                            {[65, 40, 85, 50, 95, 70, 60].map((height, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                                    <div 
                                        className="w-full bg-gray-50 group-hover:bg-bam-navy/10 rounded-t-xl transition-all duration-500 relative"
                                        style={{ height: `${height}%` }}
                                    >
                                        <div className="absolute inset-x-2 bottom-2 bg-bam-navy/5 rounded-lg h-1/2 group-hover:bg-bam-red/20 transition-colors"></div>
                                    </div>
                                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Transactions / Activities */}
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                            <h2 className="text-xl font-black text-bam-navy uppercase tracking-widest flex items-center gap-2">
                                <Activity size={20} className="text-bam-red" />
                                Recent Activities
                            </h2>
                            <Calendar size={20} className="text-gray-300" />
                        </div>
                        <div className="divide-y divide-gray-50">
                            {[1, 2, 3].map((_, i) => (
                                <div key={i} className="p-6 hover:bg-gray-50/50 transition-colors flex items-center justify-between group">
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-bam-navy group-hover:bg-white transition-colors border border-gray-100">
                                            <Inbox size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-bam-navy text-sm">Book Issued: "The Journey Within"</h4>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-xs text-gray-400 font-medium whitespace-nowrap">Member: John Doe</span>
                                                <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                                                <span className="text-xs text-gray-400 font-medium whitespace-nowrap">2 hours ago</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest border border-blue-100">
                                        Issued
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-8">
                    {/* Recent Books */}
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-8 border-b border-gray-50">
                            <h2 className="text-lg font-black text-bam-navy uppercase tracking-widest flex items-center gap-2">
                                <Clock size={18} className="text-bam-red" />
                                New Arrivals
                            </h2>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {stats?.recentBooks?.map((book) => (
                                <div key={book.id} className="p-5 hover:bg-gray-50 transition-colors flex items-center justify-between group">
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-16 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-100 shadow-sm transition-transform group-hover:scale-105">
                                            <img
                                                src={book.coverUrl ? `${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}${book.coverUrl}` : 'https://via.placeholder.com/300x400'}
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-bam-navy text-sm leading-tight group-hover:text-bam-red transition-colors">{book.translations?.[0]?.title || 'Untitled Book'}</h4>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Librarian: Admin</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="text-gray-200 group-hover:text-bam-navy transition-colors translate-x-3 group-hover:translate-x-0" size={18} />
                                </div>
                            ))}
                        </div>
                        <div className="p-6 bg-gray-50/50 text-center">
                            <button className="text-[10px] font-black text-bam-navy uppercase tracking-[0.2em] hover:text-bam-red transition-colors">
                                View Full Collection
                            </button>
                        </div>
                    </div>

                    {/* Quick Action / Promo */}
                    <div className="bg-bam-red rounded-[2.5rem] p-10 text-white relative overflow-hidden group shadow-2xl shadow-red-200">
                        <div className="relative z-10 space-y-6">
                            <h3 className="text-2xl font-serif font-black italic">Manage Inventory</h3>
                            <p className="text-sm opacity-80 leading-relaxed font-medium">
                                Ready to expand our spiritual resources? Add a new volume to the library.
                            </p>
                            <div className="pt-4">
                                <button className="bg-white text-bam-red px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-xl active:scale-95 shadow-red-900/20">
                                    Issue Book
                                </button>
                            </div>
                        </div>
                        {/* Decorative element */}
                        <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-white/10 rounded-full blur-3xl transition-transform group-hover:scale-110"></div>
                        <Activity className="absolute top-8 right-8 text-white/10" size={64} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
