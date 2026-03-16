import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { setFilters } from '../../features/books/bookSlice';
import LanguageSwitcher from '../../features/languages/components/LanguageSwitcher';
import { User, Bookmark, Search, ChevronDown, MapPin, Shield } from 'lucide-react';

const Navbar = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const { filters } = useSelector((state) => state.books);
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        dispatch(setFilters({ search: searchTerm }));
        navigate('/books');
    };

    return (
        <nav className="bg-white text-bam-navy border-b border-gray-100 shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-8 h-20">
                {/* Logo Section */}
                <Link to="/" className="flex flex-col items-center shrink-0">
                    <span className="text-3xl lg:text-4xl font-black text-bam-navy leading-none tracking-tighter uppercase">{t('common.app_name')}</span>
                    <span className="text-[10px] font-bold text-bam-navy tracking-[0.2em] leading-tight uppercase">Kuusaa Macaafaaa</span>
                </Link>

                {/* Search Bar Section */}
                <form
                    onSubmit={handleSearch}
                    className="flex-grow max-w-2xl hidden md:flex items-center bg-white border-2 border-bam-navy rounded shadow-sm overflow-hidden"
                >
                    <button type="button" className="bg-gray-50 px-4 h-11 flex items-center gap-2 border-r border-gray-200 text-sm font-bold hover:bg-gray-100 transition-colors">
                        <ChevronDown size={14} />
                    </button>
                    <input
                        type="text"
                        placeholder={t('common.search_placeholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-grow px-4 py-2 border-none focus:ring-0 text-sm font-medium placeholder-gray-400"
                    />
                    <button type="submit" className="bg-bam-navy text-white px-5 h-11 flex items-center justify-center hover:bg-opacity-90 transition-all">
                        <Search size={22} />
                    </button>
                </form>

                {/* Actions Section */}
                <div className="flex items-center space-x-6 shrink-0">
                    <div className="hidden xl:flex items-center gap-2">
                        <MapPin size={24} className="text-bam-navy" />
                    </div>

                    {isAuthenticated ? (
                        <div className="flex items-center space-x-6">
                            {/* Unified Dashboard Link */}
                            <Link 
                                to={user?.role === 'ADMIN' ? '/admin' : '/profile'} 
                                className={`flex flex-col items-center transition-colors ${
                                    user?.role === 'ADMIN' ? 'text-bam-red hover:text-bam-navy' : 'text-bam-navy hover:text-bam-red'
                                }`}
                            >
                                {user?.role === 'ADMIN' ? (
                                    <Shield size={26} strokeWidth={1.5} className="text-bam-red" />
                                ) : (
                                    <User size={26} strokeWidth={1.5} />
                                )}
                                <span className="text-[10px] font-black uppercase tracking-widest mt-0.5">
                                    {user?.role === 'ADMIN' ? t('nav.admin') : user?.name?.split(' ')[0]}
                                </span>
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="flex flex-col items-center text-bam-navy hover:text-bam-red transition-colors"
                                title="Logout"
                            >
                                <User size={26} strokeWidth={1.5} className="rotate-180" />
                                <span className="text-[10px] font-bold uppercase tracking-widest mt-0.5">{t('nav.sign_out') || 'Sign Out'}</span>
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="flex flex-col items-center text-bam-navy hover:text-bam-red transition-colors group">
                            <User size={26} strokeWidth={1.5} />
                            <span className="text-[10px] font-bold uppercase tracking-widest mt-0.5 group-hover:underline underline-offset-2 decoration-2 decoration-bam-red">{t('nav.sign_in')}</span>
                        </Link>
                    )}

                    <Link to="/saved" className="flex flex-col items-center text-bam-navy hover:text-bam-red transition-colors group">
                        <div className="relative">
                            <Bookmark size={26} strokeWidth={1.5} />
                            <span className="absolute -top-1.5 -right-2 bg-bam-red text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">0</span>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest mt-0.5 group-hover:underline underline-offset-2 decoration-2 decoration-bam-red">{t('nav.saved')}</span>
                    </Link>

                    <div className="h-10 w-[1px] bg-gray-100 hidden sm:block"></div>

                    <div className="hidden sm:block">
                        <LanguageSwitcher />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
