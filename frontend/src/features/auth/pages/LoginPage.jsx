import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, ArrowRight } from 'lucide-react';
import { login, clearError } from '../authSlice';
import Loader from '../../../shared/components/Loader';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated && user) {
            if (user.role === 'ADMIN') {
                navigate('/admin');
            } else {
                navigate('/profile');
            }
        }
        return () => {
            dispatch(clearError());
        };
    }, [isAuthenticated, user, navigate, dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(login({ email, password }));
    };

    return (
        <div className="min-h-[85vh] flex items-center justify-center bg-gray-50/50 py-12 px-4 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-20 left-20 w-64 h-64 bg-bam-navy/5 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-bam-red/5 rounded-full blur-3xl"></div>

            <div className="max-w-md w-full relative z-10">
                <div className="bg-white/80 backdrop-blur-xl p-10 lg:p-12 rounded-[2.5rem] shadow-2xl border border-white flex flex-col items-center">
                    {/* Logo/Icon */}
                    <div className="w-16 h-16 bg-bam-navy rounded-2xl flex items-center justify-center text-white mb-8 shadow-xl shadow-blue-100/50 ring-4 ring-gray-50">
                        <User size={30} strokeWidth={1.5} />
                    </div>

                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-serif font-black text-bam-navy italic tracking-tight mb-3">
                            {t('nav.sign_in')}
                        </h1>
                        <p className="text-sm font-medium text-gray-400 uppercase tracking-[0.2em]">
                            Spiritual Library Access
                        </p>
                    </div>

                    {error && (
                        <div className="w-full bg-red-50 text-bam-red p-4 rounded-2xl mb-8 text-xs border border-red-100 text-center font-black uppercase tracking-widest animate-shake">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="w-full space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-4">
                                Email Address
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-bam-red focus:bg-white transition-all shadow-inner placeholder:text-gray-300"
                                placeholder="name@domain.com"
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-4">
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-bam-red focus:bg-white transition-all shadow-inner placeholder:text-gray-300"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-bam-navy hover:bg-bam-red text-white py-4 rounded-2xl flex items-center justify-center font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-100 hover:scale-[1.02] active:scale-95 disabled:opacity-50 mt-4"
                        >
                            {loading ? <div className="scale-75"><Loader /></div> : t('nav.sign_in')}
                        </button>
                    </form>

                    <div className="mt-12 text-center">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                            First time here?
                        </p>
                        <Link 
                            to="/register" 
                            className="inline-flex items-center gap-2 text-bam-red font-black text-xs uppercase tracking-widest hover:underline group"
                        >
                            {t('nav.register')}
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
