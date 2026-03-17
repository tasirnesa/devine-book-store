import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../shared/services/axiosInstance';
import { Users, Mail, Shield, ShieldCheck, MoreVertical, Search, Filter, Plus, X, UserPlus, Lock, Key, Clock, Book, Edit } from 'lucide-react';
import Loader from '../../../shared/components/Loader';

const AdminUserListPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'USER'
    });
    const [isEditing, setIsEditing] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formError, setFormError] = useState('');

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/admin/users');
            setUsers(response.data.data);
        } catch (err) {
            console.error('Failed to fetch users', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        setIsSubmitting(true);

        try {
            if (isEditing) {
                await axiosInstance.patch(`/admin/users/${selectedUser.id}`, formData);
            } else {
                await axiosInstance.post('/admin/users', formData);
            }
            setIsModalOpen(false);
            setFormData({ name: '', email: '', password: '', role: 'USER' });
            setIsEditing(false);
            setSelectedUser(null);
            fetchUsers();
        } catch (err) {
            setFormError(err.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} user`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (user) => {
        setIsEditing(true);
        setSelectedUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            password: '', // Leave empty if not changing
            role: user.role
        });
        setIsModalOpen(true);
    };

    const openAddModal = () => {
        setIsEditing(false);
        setSelectedUser(null);
        setFormData({ name: '', email: '', password: '', role: 'USER' });
        setIsModalOpen(true);
    };

    const toggleUserStatus = async (id) => {
        try {
            await axiosInstance.patch(`/admin/users/${id}/toggle-status`);
            fetchUsers();
        } catch (err) {
            console.error('Failed to toggle status', err);
        }
    };

    const [historyUser, setHistoryUser] = useState(null);
    const [borrowHistory, setBorrowHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    const viewHistory = async (user) => {
        setHistoryUser(user);
        setLoadingHistory(true);
        try {
            const response = await axiosInstance.get(`/admin/users/${user.id}/history`);
            setBorrowHistory(response.data.data);
        } catch (err) {
            console.error('Failed to fetch history', err);
        } finally {
            setLoadingHistory(false);
        }
    };

    const filteredUsers = users.filter(user =>
        (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-bam-navy tracking-tight font-serif italic">User Management</h1>
                    <p className="text-gray-500 text-sm font-medium">Control access and roles for the spiritual community.</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="bg-bam-navy text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-bam-red transition-all shadow-xl shadow-blue-100 hover:shadow-red-50"
                >
                    <UserPlus size={18} />
                    Add New User
                </button>
            </div>

            {/* Controls */}
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className="w-full bg-gray-50 border-none rounded-xl py-4 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-bam-navy/5 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-4 px-2">
                    <button className="bg-gray-50 p-3.5 rounded-xl text-bam-navy hover:bg-gray-100 transition-colors border border-gray-100">
                        <Filter size={20} />
                    </button>
                    <div className="h-8 w-[1px] bg-gray-100 hidden md:block"></div>
                    <p className="text-xs font-black text-bam-navy uppercase tracking-widest whitespace-nowrap">
                        Total: <span className="text-bam-red font-serif italic text-base ml-1">{users.length}</span>
                    </p>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">User Profile</th>
                                <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Role & Access</th>
                                <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Member Since</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading && users.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-24 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <Loader />
                                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Loading Users...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50/30 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 bg-bam-navy/5 rounded-2xl flex items-center justify-center text-bam-navy font-black border border-bam-navy/10 uppercase text-lg shadow-inner">
                                                    {(user.name || 'U').substring(0, 2)}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-bam-navy text-base tracking-tight">{user.name}</h4>
                                                    <div className="flex items-center gap-1.5 text-gray-400 text-xs font-medium">
                                                        <Mail size={12} strokeWidth={2.5} />
                                                        <span>{user.email}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 w-fit shadow-sm border ${user.role?.toUpperCase() === 'ADMIN'
                                                ? 'bg-bam-red text-white border-bam-red shadow-red-100'
                                                : 'bg-white text-bam-navy border-gray-100'
                                                }`}>
                                                {user.role?.toUpperCase() === 'ADMIN' ? <ShieldCheck size={12} strokeWidth={3} /> : <Shield size={12} strokeWidth={3} />}
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${user.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                {user.isActive ? 'Active' : 'Blocked'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-xs font-bold text-gray-400 tracking-wide">
                                            {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(user)}
                                                    className="p-2.5 text-gray-400 hover:text-bam-navy hover:bg-gray-100 rounded-xl transition-all"
                                                    title="Edit User"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => viewHistory(user)}
                                                    className="p-2.5 text-gray-400 hover:text-bam-navy hover:bg-gray-100 rounded-xl transition-all"
                                                    title="View Borrow History"
                                                >
                                                    <Clock size={16} />
                                                </button>
                                                <button
                                                    onClick={() => toggleUserStatus(user.id)}
                                                    className={`p-2.5 rounded-xl transition-all ${user.isActive ? 'text-gray-400 hover:text-red-500 hover:bg-red-50' : 'text-green-500 hover:bg-green-50'}`}
                                                    title={user.isActive ? 'Block User' : 'Unblock User'}
                                                >
                                                    {user.isActive ? <Lock size={16} /> : <ShieldCheck size={16} />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="py-24 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-30">
                                            <Users size={64} className="text-gray-300" strokeWidth={1} />
                                            <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No spiritual seekers found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Borrow History Modal */}
            {historyUser && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-bam-navy/60 backdrop-blur-md animate-in fade-in" onClick={() => setHistoryUser(null)}></div>
                    <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl animate-in zoom-in duration-300 overflow-hidden">
                        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-serif font-black text-bam-navy italic">Borrow History</h2>
                                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1">Records for {historyUser.name}</p>
                            </div>
                            <button onClick={() => setHistoryUser(null)} className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-bam-red transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-8 max-h-[60vh] overflow-y-auto">
                            {loadingHistory ? (
                                <div className="py-20 flex flex-col items-center gap-4">
                                    <Loader />
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Retrieving archives...</p>
                                </div>
                            ) : borrowHistory.length > 0 ? (
                                <div className="space-y-4">
                                    {borrowHistory.map((record) => (
                                        <div key={record.id} className="bg-gray-50 p-6 rounded-3xl flex items-center justify-between group hover:bg-white hover:shadow-xl hover:shadow-blue-50/50 transition-all border border-transparent hover:border-blue-50">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-16 bg-white rounded-xl shadow-sm overflow-hidden flex-shrink-0 border border-gray-100">
                                                    {record.book?.coverUrl ? (
                                                        <img src={`${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}${record.book.coverUrl}`} className="w-full h-full object-cover" alt="" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                                                            <Book size={20} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-bam-navy text-sm leading-tight mb-1">{record.book?.translations[0]?.title || 'Unknown Work'}</h4>
                                                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                                        <span>Issued: {new Date(record.issueDate).toLocaleDateString()}</span>
                                                        <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                                                        <span className={record.status === 'OVERDUE' ? 'text-bam-red' : ''}>
                                                            {record.status === 'RETURNED' ? `Returned: ${new Date(record.returnDate).toLocaleDateString()}` : `Due: ${new Date(record.dueDate).toLocaleDateString()}`}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.15em] ${
                                                    record.status === 'RETURNED' ? 'bg-green-100 text-green-600' :
                                                    record.status === 'OVERDUE' ? 'bg-red-100 text-red-600' :
                                                    'bg-blue-100 text-blue-600'
                                                }`}>
                                                    {record.status}
                                                </span>
                                                {record.fineAmount > 0 && (
                                                    <p className="text-[10px] font-black text-bam-red mt-2 tracking-widest">Fine: ${record.fineAmount}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-20 text-center opacity-30">
                                    <Clock size={48} className="mx-auto text-gray-300 mb-4" strokeWidth={1} />
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">This seeker has no past records</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Add User Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-end">
                    <div className="absolute inset-0 bg-bam-navy/40 backdrop-blur-sm animate-in fade-in" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative w-full max-w-md h-full bg-white shadow-2xl animate-in slide-in-from-right duration-500 p-8 flex flex-col">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h2 className="text-3xl font-serif font-black text-bam-navy italic">{isEditing ? 'Edit User' : 'Add User'}</h2>
                                <p className="text-gray-400 text-xs font-black uppercase tracking-widest mt-1">{isEditing ? 'Modify Member Details' : 'Manual Member Entry'}</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-bam-red transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        {formError && (
                            <div className="bg-red-50 text-bam-red p-4 rounded-2xl mb-8 text-xs font-black uppercase tracking-widest border border-red-100 flex items-center gap-3">
                                <Shield className="shrink-0" size={16} />
                                {formError}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6 flex-grow">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Full Name</label>
                                <div className="relative">
                                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-bam-navy focus:ring-2 focus:ring-bam-navy/5"
                                        placeholder="Enter full name"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-bam-navy focus:ring-2 focus:ring-bam-navy/5"
                                        placeholder="name@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Temporary Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                    <input
                                        type="password"
                                        name="password"
                                        required
                                        className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-bam-navy focus:ring-2 focus:ring-bam-navy/5"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Initial Role</label>
                                <div className="relative">
                                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                    <select
                                        name="role"
                                        className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-bam-navy focus:ring-2 focus:ring-bam-navy/5 appearance-none shadow-inner"
                                        value={formData.role}
                                        onChange={handleChange}
                                    >
                                        <option value="USER">USER - Standard Seeker</option>
                                        <option value="ADMIN">ADMIN - Librarian Access</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-8">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-bam-navy text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-blue-200 hover:bg-bam-red hover:shadow-red-200 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                                >
                                    {isSubmitting ? <Loader /> : (
                                        <>
                                            <ShieldCheck size={18} />
                                            {isEditing ? 'Update Member' : 'Activate Member'}
                                        </>
                                    )}
                                </button>
                                <p className="text-[10px] text-gray-400 text-center mt-6 font-medium leading-relaxed uppercase tracking-widest italic">
                                    By activating, this user will have immediate access based on their assigned role.
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUserListPage;
