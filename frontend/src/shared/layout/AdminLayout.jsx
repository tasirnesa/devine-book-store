import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar';
import Footer from '../components/Footer';
import { LayoutDashboard, Book, Users, Settings, LogOut, ChevronLeft } from 'lucide-react';

const AdminLayout = () => {
    const location = useLocation();

    const menuItems = [
        { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/admin/books', label: 'Manage Books', icon: Book },
        { path: '/admin/borrow', label: 'Borrow & Return', icon: ChevronLeft },
        { path: '/admin/users', label: 'Members', icon: Users },
        { path: '/admin/taxonomy', label: 'Taxonomy', icon: LayoutDashboard },
        { path: '/admin/reports', label: 'Reports', icon: LayoutDashboard },
        { path: '/admin/settings', label: 'Settings', icon: Settings },
    ];

    const isActive = (path) => {
        if (path === '/admin') return location.pathname === '/admin';
        return location.pathname.startsWith(path);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50/50">
            <AdminNavbar />
            <div className="flex-grow flex container mx-auto px-4 py-8 gap-8">
                {/* Admin Sidebar */}
                <aside className="w-72 shrink-0 hidden lg:block">
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sticky top-24">
                        <div className="flex items-center gap-3 mb-10 px-2">
                            <div className="w-10 h-10 bg-bam-navy rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
                                <Settings size={20} />
                            </div>
                            <div>
                                <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">Admin Panel</h2>
                                <p className="text-sm font-black text-bam-navy">Control Center</p>
                            </div>
                        </div>

                        <nav className="space-y-1">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl font-black text-xs uppercase tracking-[0.15em] transition-all group ${isActive(item.path)
                                        ? 'bg-bam-navy text-white shadow-xl shadow-blue-100'
                                        : 'text-gray-400 hover:bg-gray-50 hover:text-bam-navy'
                                        }`}
                                >
                                    <item.icon size={18} className={isActive(item.path) ? 'text-bam-red' : 'group-hover:text-bam-red transition-colors'} />
                                    {item.label}
                                </Link>
                            ))}
                        </nav>

                        {/* Removed Exit Admin section to prevent switching for admins */}
                    </div>
                </aside>

                {/* Content Area */}
                <main className="flex-grow">
                    <div className="bg-transparent">
                        <Outlet />
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default AdminLayout;
