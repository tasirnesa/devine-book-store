import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { User, BookOpen, Bookmark, Calendar, Settings, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
    const { t } = useTranslation();
    const { user } = useSelector((state) => state.auth);

    // Mock stats for aesthetic purposes
    const stats = [
        { label: t('dashboard.books_saved'), value: '12', icon: Bookmark, color: 'text-bam-red' },
        { label: t('dashboard.currently_reading'), value: '3', icon: BookOpen, color: 'text-blue-600' },
        { label: t('dashboard.member_type'), value: user?.role === 'ADMIN' ? t('dashboard.admin_role') : t('dashboard.user_role'), icon: ShieldCheck, color: 'text-green-600' },
    ];

    return (
        <div className="min-h-[80vh] bg-gray-50/50 py-12">
            <div className="container mx-auto px-4">
                <div className="max-w-5xl mx-auto">
                    {/* Hero Header */}
                    <div className="bg-bam-navy rounded-3xl p-8 lg:p-12 mb-8 relative overflow-hidden shadow-2xl">
                        {/* Decorative Background Texture */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-bam-red/10 rounded-full -ml-10 -mb-10 blur-2xl"></div>

                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                            <div className="w-32 h-32 lg:w-40 lg:h-40 bg-white/10 rounded-full flex items-center justify-center border-2 border-white/20 backdrop-blur-sm shadow-inner group overflow-hidden">
                                <User size={60} className="text-white opacity-80 group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            
                            <div className="text-center md:text-left">
                                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                                    <h1 className="text-4xl lg:text-5xl font-serif font-black text-white tracking-tight italic">
                                        {user?.name}
                                    </h1>
                                    <span className="bg-bam-red text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                                        {user?.role}
                                    </span>
                                </div>
                                <p className="text-white/60 font-medium mb-6 text-lg max-w-xl">
                                    {t('dashboard.motto')}
                                </p>
                                
                                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full backdrop-blur-sm border border-white/10 text-white/80 text-xs font-bold uppercase tracking-widest">
                                        <Calendar size={14} className="text-bam-red" />
                                        {t('dashboard.joined')} {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                    </div>
                                    <button className="flex items-center gap-2 px-6 py-2 bg-bam-red hover:bg-white hover:text-bam-red text-white rounded-full transition-all shadow-lg font-black text-xs uppercase tracking-widest">
                                        {t('common.edit_profile')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-4 rounded-2xl bg-gray-50 group-hover:bg-bam-navy group-hover:text-white transition-colors ${stat.color}`}>
                                        <stat.icon size={24} />
                                    </div>
                                    <span className="text-4xl font-black text-bam-navy tracking-tighter">
                                        {stat.value}
                                    </span>
                                </div>
                                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">
                                    {stat.label}
                                </h4>
                            </div>
                        ))}
                    </div>

                    {/* Activity Section Placeholder */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Reading List */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="flex justify-between items-center px-4">
                                <h2 className="text-2xl font-serif font-black text-bam-navy">{t('nav.saved')}</h2>
                                <Link to="/books" className="text-bam-red text-xs font-black uppercase tracking-widest hover:underline flex items-center gap-2">
                                    {t('common.browse_all')} <ArrowRight size={14} />
                                </Link>
                            </div>
                            
                            <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm flex flex-col items-center justify-center text-center min-h-[300px]">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                    <Bookmark size={32} className="text-gray-200" />
                                </div>
                                <h3 className="text-xl font-bold text-bam-navy mb-2">{t('dashboard.no_saved_title')}</h3>
                                <p className="text-gray-500 max-w-xs mb-8">
                                    {t('dashboard.no_saved_desc')}
                                </p>
                                <Link to="/books" className="bg-bam-navy text-white px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:bg-bam-red transition-all shadow-xl">
                                    {t('dashboard.discover_books')}
                                </Link>
                            </div>
                        </div>

                        {/* Recent Activity / Settings */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-serif font-black text-bam-navy px-4">{t('dashboard.account')}</h2>
                            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                                <div className="p-2">
                                    <button className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-gray-100 rounded-lg text-gray-400 group-hover:bg-bam-navy group-hover:text-white transition-colors">
                                                <Settings size={20} />
                                            </div>
                                            <span className="font-bold text-bam-navy">{t('dashboard.account_settings')}</span>
                                        </div>
                                        <ArrowRight size={16} className="text-gray-300" />
                                    </button>
                                    <div className="h-px bg-gray-50 mx-4 my-1"></div>
                                    <button 
                                        onClick={() => {/* Logout logic handled by Navbar or Profile context if needed */}}
                                        className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors group text-bam-red"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-red-50 rounded-lg text-bam-red group-hover:bg-bam-red group-hover:text-white transition-colors">
                                                <User size={20} strokeWidth={3} className="rotate-180" />
                                            </div>
                                            <span className="font-bold">{t('common.sign_out')}</span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
