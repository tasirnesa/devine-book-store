import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../shared/services/axiosInstance';
import { Book, Users, Clock, CheckCircle, AlertCircle, Search, Plus, X, Calendar, ArrowRight, Bookmark, DollarSign } from 'lucide-react';
import Loader from '../../../shared/components/Loader';

const AdminBorrowPage = () => {
    const [activeTab, setActiveTab] = useState('loans'); // 'loans' or 'reservations'
    const [records, setRecords] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form data for issuing
    const [formData, setFormData] = useState({
        userId: '',
        bookId: '',
        reservationId: null,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Default 14 days
    });

    // Lookup data
    const [users, setUsers] = useState([]);
    const [books, setBooks] = useState([]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [recordsRes, usersRes, booksRes, reservationsRes] = await Promise.all([
                axiosInstance.get('/admin/borrow'),
                axiosInstance.get('/admin/users'),
                axiosInstance.get('/books?pageSize=100'),
                axiosInstance.get('/reservations/admin')
            ]);
            setRecords(recordsRes.data.data);
            setUsers(usersRes.data.data);
            setBooks(booksRes.data.data.books);
            setReservations(reservationsRes.data.data);
        } catch (err) {
            console.error('Failed to fetch data', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleIssueBook = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (formData.reservationId) {
                // Fulfill existing reservation
                await axiosInstance.post(`/reservations/${formData.reservationId}/fulfill`, {
                    dueDate: formData.dueDate
                });
            } else {
                // Standard issue
                await axiosInstance.post('/admin/borrow/issue', formData);
            }
            
            setIsModalOpen(false);
            setFormData({
                userId: '',
                bookId: '',
                reservationId: null,
                dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            });
            fetchData();
        } catch (err) {
            console.error('Operation failed', err);
            alert(err.response?.data?.message || 'Failed to process request');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFulfillClick = (reservation) => {
        setFormData({
            userId: reservation.userId,
            bookId: reservation.bookId,
            reservationId: reservation.id,
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        });
        setIsModalOpen(true);
    };

    const handleReturnBook = async (id) => {
        if (!window.confirm('Mark this book as returned?')) return;
        try {
            await axiosInstance.post(`/admin/borrow/return/${id}`);
            fetchData();
        } catch (err) {
            console.error('Return failed', err);
        }
    };

    const filteredRecords = records.filter(record => 
        record.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.book.translations[0]?.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredReservations = reservations.filter(res => 
        res.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.book.translations[0]?.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-bam-navy tracking-tight font-serif italic">Circulation</h1>
                    <p className="text-gray-500 text-sm font-medium">Manage loans and seeker reservations.</p>
                </div>
                <button
                    onClick={() => {
                        setFormData({
                            userId: '',
                            bookId: '',
                            reservationId: null,
                            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                        });
                        setIsModalOpen(true);
                    }}
                    className="bg-bam-navy text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-bam-red transition-all shadow-xl shadow-blue-100 hover:shadow-red-50"
                >
                    <Plus size={18} />
                    Issue New Work
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl w-fit">
                <button 
                    onClick={() => setActiveTab('loans')}
                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'loans' ? 'bg-white text-bam-navy shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    Active Loans
                </button>
                <button 
                    onClick={() => setActiveTab('reservations')}
                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'reservations' ? 'bg-white text-bam-navy shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    Seeker Reservations
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
                    <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
                        <Bookmark size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Loans</p>
                        <p className="text-2xl font-black text-bam-navy">{records.filter(r => r.status === 'ISSUED').length}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
                    <div className="w-12 h-12 bg-red-50 text-bam-red rounded-2xl flex items-center justify-center">
                        <AlertCircle size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Overdue Items</p>
                        <p className="text-2xl font-black text-bam-red">{records.filter(r => r.status === 'OVERDUE').length}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
                    <div className="w-12 h-12 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center">
                        <CheckCircle size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Today's Returns</p>
                        <p className="text-2xl font-black text-bam-navy">
                            {records.filter(r => r.status === 'RETURNED' && new Date(r.returnDate).toDateString() === new Date().toDateString()).length}
                        </p>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by member or work title..."
                        className="w-full bg-gray-50 border-none rounded-xl py-4 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-bam-navy/5 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Records Table */}
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    {activeTab === 'loans' ? (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Seeker (Member)</th>
                                    <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Spiritual Work</th>
                                    <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Issuance / Due</th>
                                    <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="py-24 text-center">
                                            <Loader />
                                        </td>
                                    </tr>
                                ) : filteredRecords.length > 0 ? (
                                    filteredRecords.map((record) => (
                                        <tr key={record.id} className="hover:bg-gray-50/30 transition-colors">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-bam-navy/5 rounded-full flex items-center justify-center text-bam-navy text-[10px] font-black">
                                                        {record.user.name.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-bam-navy text-sm">{record.user.name}</p>
                                                        <p className="text-[10px] text-gray-400 font-medium">{record.user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-14 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
                                                        {record.book.coverUrl ? (
                                                            <img src={`${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}${record.book.coverUrl}`} className="w-full h-full object-cover" alt="" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                                <Book size={16} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <p className="font-bold text-bam-navy text-sm line-clamp-2 max-w-[200px]">
                                                        {record.book.translations[0]?.title || 'Unknown Title'}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="space-y-1">
                                                    <p className="text-xs font-bold text-gray-500 flex items-center gap-2">
                                                        <Calendar size={12} />
                                                        {new Date(record.issueDate).toLocaleDateString()}
                                                    </p>
                                                    <p className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${new Date(record.dueDate) < new Date() && record.status === 'ISSUED' ? 'text-bam-red' : 'text-gray-400'}`}>
                                                        <ArrowRight size={10} />
                                                        Due: {new Date(record.dueDate).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                                    record.status === 'ISSUED' ? 'bg-blue-100 text-blue-600' :
                                                    record.status === 'RETURNED' ? 'bg-green-100 text-green-600' :
                                                    'bg-red-100 text-red-600'
                                                }`}>
                                                    {record.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                {record.status === 'ISSUED' && (
                                                    <button
                                                        onClick={() => handleReturnBook(record.id)}
                                                        className="bg-white border border-gray-100 text-bam-navy px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-bam-navy hover:text-white transition-all shadow-sm"
                                                    >
                                                        Process Return
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="py-24 text-center text-gray-400 opacity-50">
                                            <Bookmark size={48} className="mx-auto mb-4" />
                                            <p className="text-xs font-black uppercase tracking-widest">No active loans found</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Seeker (Member)</th>
                                    <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Spiritual Work</th>
                                    <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Reserved On</th>
                                    <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="py-24 text-center">
                                            <Loader />
                                        </td>
                                    </tr>
                                ) : filteredReservations.length > 0 ? (
                                    filteredReservations.map((res) => (
                                        <tr key={res.id} className="hover:bg-gray-50/30 transition-colors">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-bam-navy/5 rounded-full flex items-center justify-center text-bam-navy text-[10px] font-black">
                                                        {res.user.name.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-bam-navy text-sm">{res.user.name}</p>
                                                        <p className="text-[10px] text-gray-400 font-medium">{res.user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <p className="font-bold text-bam-navy text-sm">
                                                        {res.book.translations[0]?.title || res.book.slug}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-xs font-bold text-gray-500">
                                                {new Date(res.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                                    res.status === 'NOTIFIED' ? 'bg-amber-100 text-amber-600' :
                                                    res.status === 'PENDING' ? 'bg-gray-100 text-gray-600' :
                                                    'bg-green-100 text-green-600'
                                                }`}>
                                                    {res.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                {(res.status === 'PENDING' || res.status === 'NOTIFIED') && (
                                                    <button
                                                        onClick={() => handleFulfillClick(res)}
                                                        className="bg-bam-navy text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-bam-red transition-all shadow-md"
                                                    >
                                                        Approve & Issue
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="py-24 text-center text-gray-400 opacity-50">
                                            <BellRing size={48} className="mx-auto mb-4" />
                                            <p className="text-xs font-black uppercase tracking-widest">No reservations found</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Issue Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-bam-navy/50 backdrop-blur-sm animate-in fade-in" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl animate-in zoom-in duration-300 overflow-hidden">
                        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div>
                                <h2 className="text-2xl font-serif font-black text-bam-navy italic">Issue Spiritual Work</h2>
                                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1">Lend a volume to a seeker</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-3 bg-white rounded-2xl text-gray-400 hover:text-bam-red transition-colors shadow-sm">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleIssueBook} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Select Spiritual Seeker (Member)</label>
                                <div className="relative">
                                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                    <select
                                        required
                                        className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-bam-navy focus:ring-2 focus:ring-bam-navy/5 appearance-none"
                                        value={formData.userId}
                                        onChange={(e) => setFormData({...formData, userId: e.target.value})}
                                    >
                                        <option value="">Choose a member...</option>
                                        {users.filter(u => u.isActive).map(u => (
                                            <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Select Spiritual Work</label>
                                <div className="relative">
                                    <Book className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                    <select
                                        required
                                        className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-bam-navy focus:ring-2 focus:ring-bam-navy/5 appearance-none"
                                        value={formData.bookId}
                                        onChange={(e) => setFormData({...formData, bookId: e.target.value})}
                                    >
                                        <option value="">Choose a work...</option>
                                        {books.map(b => (
                                            <option key={b.id} value={b.id}>{b.activeTranslation?.title || b.slug}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Due Date for Return</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                    <input
                                        type="date"
                                        required
                                        className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-bam-navy focus:ring-2 focus:ring-bam-navy/5"
                                        value={formData.dueDate}
                                        onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-bam-navy text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-blue-200 hover:bg-bam-red hover:shadow-red-200 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                                >
                                    {isSubmitting ? <Loader /> : (
                                        <>
                                            <CheckCircle size={18} />
                                            Confirm Issuance
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminBorrowPage;
