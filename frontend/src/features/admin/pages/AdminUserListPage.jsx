import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../shared/services/axiosInstance';
import { Users, Mail, Shield, ShieldCheck, MoreVertical, Search, Filter } from 'lucide-react';
import Loader from '../../../shared/components/Loader';

const AdminUserListPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axiosInstance.get('/admin/users');
                setUsers(response.data.data);
            } catch (err) {
                console.error('Failed to fetch users', err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-bam-navy tracking-tight font-serif">User Management</h1>
                    <p className="text-gray-500 text-sm">Monitor and manage access to the library.</p>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by username or email..."
                        className="w-full bg-gray-50 border-none rounded-xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-bam-navy/5 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button className="bg-gray-50 p-3 rounded-xl text-bam-navy hover:bg-gray-100 transition-colors border border-gray-100">
                        <Filter size={20} />
                    </button>
                    <p className="text-xs font-black text-bam-navy uppercase tracking-widest whitespace-nowrap">
                        Total: <span className="text-bam-red">{users.length} Users</span>
                    </p>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">User</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Role</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Joined Date</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            <tr>
                                <td colSpan="4" className="py-20 text-center"><Loader /></td>
                            </tr>
                        ) : filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-bam-navy font-black border border-gray-200 uppercase">
                                                {user.username.substring(0, 2)}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-bam-navy text-sm">{user.username}</h4>
                                                <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                                                    <Mail size={12} />
                                                    <span>{user.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 w-fit ${user.role === 'admin' ? 'bg-bam-red/10 text-bam-red' : 'bg-blue-50 text-blue-500'
                                            }`}>
                                            {user.role === 'admin' ? <ShieldCheck size={12} /> : <Shield size={12} />}
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-bold text-gray-500">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors">
                                            <MoreVertical size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="py-20 text-center text-gray-400 font-bold">No users found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUserListPage;
