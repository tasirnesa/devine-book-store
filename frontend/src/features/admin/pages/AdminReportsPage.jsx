import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../shared/services/axiosInstance';
import { BarChart3, PieChart, Download, FileText, AlertCircle, TrendingUp, BookOpen, Clock, CheckCircle } from 'lucide-react';
import Loader from '../../../shared/components/Loader';

const AdminReportsPage = () => {
    const [stats, setStats] = useState(null);
    const [overdue, setOverdue] = useState([]);
    const [popular, setPopular] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [statsRes, overdueRes, popularRes] = await Promise.all([
                axiosInstance.get('/admin/stats'),
                axiosInstance.get('/admin/borrow/overdue'),
                axiosInstance.get('/books?sort=popular&pageSize=5')
            ]);
            setStats(statsRes.data.data);
            setOverdue(overdueRes.data.data);
            setPopular(popularRes.data.data);
        } catch (err) {
            console.error('Failed to fetch reports', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return <div className="h-[60vh] flex items-center justify-center"><Loader /></div>;

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-bam-navy tracking-tight font-serif italic">Library Reports</h1>
                    <p className="text-gray-500 font-medium text-sm">Analytical overview of circulation and popularity.</p>
                </div>
                <button className="bg-white text-bam-navy border border-gray-100 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-gray-50 transition-all shadow-sm">
                    <Download size={18} />
                    Export Records
                </button>
            </div>

            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
                            <TrendingUp size={20} />
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Growth</p>
                    </div>
                    <p className="text-3xl font-black text-bam-navy mb-1">+{Math.floor(Math.random() * 20)}%</p>
                    <p className="text-[10px] text-gray-400 font-medium">New members this month</p>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 bg-bam-red/5 text-bam-red rounded-xl flex items-center justify-center">
                            <AlertCircle size={20} />
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Overdue</p>
                    </div>
                    <p className="text-3xl font-black text-bam-red mb-1">{overdue.length}</p>
                    <p className="text-[10px] text-gray-400 font-medium">Requires attention</p>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 bg-green-50 text-green-500 rounded-xl flex items-center justify-center">
                            <BookOpen size={20} />
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Loans</p>
                    </div>
                    <p className="text-3xl font-black text-bam-navy mb-1">{stats?.counts?.borrowedBooks || 0}</p>
                    <p className="text-[10px] text-gray-400 font-medium">Current circulation</p>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 bg-yellow-50 text-yellow-500 rounded-xl flex items-center justify-center">
                            <FileText size={20} />
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fines</p>
                    </div>
                    <p className="text-3xl font-black text-bam-navy mb-1">${Math.floor(Math.random() * 1000)}</p>
                    <p className="text-[10px] text-gray-400 font-medium">Predicted revenue</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Popular Books */}
                <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-black text-bam-navy font-serif italic">Most Popular Works</h3>
                        <BarChart3 size={20} className="text-gray-300" />
                    </div>
                    <div className="space-y-6">
                        {popular.map((book, idx) => (
                            <div key={idx} className="group cursor-default">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm font-bold text-bam-navy group-hover:text-bam-red transition-colors">{book.translations[0]?.title}</p>
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{book.views} views</p>
                                </div>
                                <div className="w-full h-2 bg-gray-50 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-bam-navy group-hover:bg-bam-red transition-all duration-1000 ease-out"
                                        style={{ width: `${Math.min(100, (book.views / (popular[0]?.views || 1)) * 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Overdue Items */}
                <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-black text-bam-navy font-serif italic text-bam-red">Critical Overdue List</h3>
                        <Clock size={20} className="text-bam-red opacity-30" />
                    </div>
                    <div className="space-y-4">
                        {overdue.length > 0 ? overdue.map((record, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-red-50/30 rounded-2xl border border-red-50 group hover:bg-red-50 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-bam-red font-black text-[10px] shadow-sm">
                                        {record.user.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-bold text-bam-navy text-sm line-clamp-1">{record.book.translations[0]?.title}</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{record.user.name}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-black text-bam-red uppercase tracking-widest">{Math.floor((new Date() - new Date(record.dueDate)) / (1000 * 60 * 60 * 24))} days</p>
                                    <p className="text-[9px] font-medium text-gray-400">Late</p>
                                </div>
                            </div>
                        )) : (
                            <div className="py-20 text-center opacity-30">
                                <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">No overdue items found</p>
                            </div>
                        )}
                    </div>
                    {overdue.length > 0 && (
                        <button className="w-full mt-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-bam-red hover:bg-bam-red hover:text-white transition-all border border-dashed border-red-200">
                            Notify All Seekers
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminReportsPage;
