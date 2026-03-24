import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { setFilters } from '../../features/books/bookSlice';
import LanguageSwitcher from '../../features/languages/components/LanguageSwitcher';
import { User, Bookmark, Search, ShoppingBag, Globe, Shield, Command } from 'lucide-react';
import axiosInstance from '../services/axiosInstance';

import AdminNotificationBell from './AdminNotificationBell';
import UserNotificationBell from './UserNotificationBell';

const Navbar = () => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const { filters } = useSelector((state) => state.books);
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [favoriteCount, setFavoriteCount] = useState(0);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    useEffect(() => {
        const fetchFavoriteCount = async () => {
            if (isAuthenticated) {
                try {
                    const response = await axiosInstance.get('/favorites');
                    setFavoriteCount(response.data.data?.length || 0);
                } catch (error) {
                    console.error('Failed to fetch favorite count', error);
                }
            } else {
                setFavoriteCount(0);
            }
        };
        fetchFavoriteCount();

        const handleFavoriteUpdate = () => fetchFavoriteCount();
        window.addEventListener('favoriteUpdated', handleFavoriteUpdate);
        return () => window.removeEventListener('favoriteUpdated', handleFavoriteUpdate);
    }, [isAuthenticated]);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        dispatch(setFilters({ search: searchTerm }));
        setIsSearchOpen(false);
        navigate('/books');
    };

    const navLinks = [
        { name: t('nav.books') || 'BOOKS', path: '/books' },
        { name: t('nav.about') || 'ABOUT', path: '/about' },
        { name: t('nav.journal') || 'JOURNAL', path: '/journal' }
    ];

    return (
        <nav className="bg-slate-50/50 text-slate-800 border-b border-slate-100 sticky top-0 z-50 backdrop-blur-md">
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                
                {/* Logo Section - Left */}
                <Link to="/" className="flex items-center gap-3 group shrink-0">
                    <div className="text-sky-500 group-hover:text-bam-red transition-colors">
                        <Command size={32} strokeWidth={1.5} />
                    </div>
                    <span className="text-lg font-medium tracking-tight text-slate-900">Christian Focus</span>
                </Link>

                {/* Right Side Section: Nav Links + Icons */}
                <div className="flex items-center gap-10">
                    {/* Navigation Links (Right Aligned) */}
                    <div className="hidden lg:flex items-center gap-10">
                        {navLinks.map((link) => (
                            <Link 
                                key={link.path} 
                                to={link.path}
                                className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-sky-500 ${
                                    location.pathname === link.path ? 'text-sky-500' : 'text-slate-500'
                                }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Icons Section */}
                    <div className="flex items-center gap-6 border-l border-slate-200 pl-8 ml-2">
                        {/* Search Icon */}
                        <button 
                            onClick={() => setIsSearchOpen(true)}
                            className="text-slate-500 hover:text-slate-900 transition-colors"
                        >
                            <Search size={22} strokeWidth={1.5} />
                        </button>

                        {/* Shopping Bag (Saved Books) */}
                        <Link to="/saved" className="relative group text-slate-500 hover:text-slate-900 transition-colors">
                            <ShoppingBag size={22} strokeWidth={1.5} />
                            {favoriteCount >= 0 && (
                                <span className="absolute -top-1.5 -right-1.5 bg-sky-500 text-white text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white">
                                    {favoriteCount}
                                </span>
                            )}
                        </Link>

                        {/* User Profile with Text */}
                        <div className="flex flex-col items-center">
                            <Link 
                                to={isAuthenticated ? (user?.role === 'ADMIN' ? '/admin' : '/profile') : '/login'}
                                className="flex flex-col items-center gap-0.5 group"
                            >
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-900 transition-colors">
                                    {isAuthenticated ? (user?.name?.split(' ')[0] || 'USER') : 'SIGN IN'}
                                </span>
                                <User size={22} strokeWidth={1.5} className="text-slate-500 group-hover:text-slate-900 transition-colors" />
                            </Link>
                        </div>

                        {/* Language Switcher with Text */}
                        <div className="flex flex-col items-center">
                            <div className="flex flex-col items-center gap-0.5 group cursor-pointer">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-900 transition-colors">
                                    {i18n.language.toUpperCase() === 'EN' ? 'ROM' : i18n.language.toUpperCase()}
                                </span>
                                <Globe size={22} strokeWidth={1.5} className="text-slate-500 group-hover:text-slate-900 transition-colors" />
                            </div>
                        </div>

                        {/* Notifications (Optional / If needed) */}
                        {(isAuthenticated && (user?.role === 'ADMIN' || user?.role === 'USER')) && (
                            <div className="ml-2">
                                {user?.role === 'ADMIN' ? <AdminNotificationBell /> : <UserNotificationBell />}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Search Overlay (Functional) */}
            {isSearchOpen && (
                <div className="absolute inset-x-0 top-0 h-20 bg-white z-[60] flex items-center px-10 border-b border-slate-100 animate-in slide-in-from-top duration-300">
                    <form onSubmit={handleSearch} className="container mx-auto flex items-center gap-6">
                        <Search size={22} className="text-slate-400" />
                        <input 
                            autoFocus
                            type="text" 
                            placeholder="Search archives..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-grow bg-transparent border-none focus:ring-0 text-lg font-medium placeholder-slate-300"
                        />
                        <button 
                            type="button" 
                            onClick={() => setIsSearchOpen(false)}
                            className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900"
                        >
                            Esc
                        </button>
                    </form>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
