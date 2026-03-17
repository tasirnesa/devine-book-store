import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UserPlus, ArrowRight } from 'lucide-react';
import { register, clearError } from '../authSlice';
import Loader from '../../../shared/components/Loader';

const RegisterPage = () => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [validationError, setValidationError] = useState('');

    const { name, email, password, confirmPassword } = formData;
    const dispatch = useDispatch();
    const navigate = useNavigate();

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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setValidationError('');

        if (password !== confirmPassword) {
            setValidationError('Passwords do not match');
            return;
        }

        dispatch(register({ name, email, password }));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50/50 py-12 px-4 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-20 right-20 w-64 h-64 bg-bam-navy/5 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-bam-red/5 rounded-full blur-3xl"></div>

            <div className="max-w-md w-full relative z-10">
                <div className="bg-white/80 backdrop-blur-xl p-10 lg:p-12 rounded-[2.5rem] shadow-2xl border border-white flex flex-col items-center">
                    {/* Logo/Icon */}
                    <div className="w-16 h-16 bg-bam-red rounded-2xl flex items-center justify-center text-white mb-8 shadow-xl shadow-red-100/50 ring-4 ring-gray-50">
                        <UserPlus size={30} strokeWidth={1.5} />
                    </div>

                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-serif font-black text-bam-navy italic tracking-tight mb-3">
                            Join the Archives
                        </h1>
                        <p className="text-sm font-medium text-gray-400 uppercase tracking-[0.2em]">
                            Begin Your Spiritual Journey
                        </p>
                    </div>

                    {(error || validationError) && (
                        <div className="w-full bg-red-50 text-bam-red p-4 rounded-2xl mb-8 text-xs border border-red-100 text-center font-black uppercase tracking-widest animate-shake">
                            {error || validationError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="w-full space-y-5">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-4">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={name}
                                onChange={handleChange}
                                className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl py-3.5 px-6 text-sm focus:outline-none focus:border-bam-red focus:bg-white transition-all shadow-inner placeholder:text-gray-300"
                                placeholder="Your Name"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-4">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={email}
                                onChange={handleChange}
                                className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl py-3.5 px-6 text-sm focus:outline-none focus:border-bam-red focus:bg-white transition-all shadow-inner placeholder:text-gray-300"
                                placeholder="name@domain.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-4">Password</label>
                            <input
                                type="password"
                                name="password"
                                required
                                value={password}
                                onChange={handleChange}
                                className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl py-3.5 px-6 text-sm focus:outline-none focus:border-bam-red focus:bg-white transition-all shadow-inner placeholder:text-gray-300"
                                placeholder="••••••••"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-4">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                required
                                value={confirmPassword}
                                onChange={handleChange}
                                className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl py-3.5 px-6 text-sm focus:outline-none focus:border-bam-red focus:bg-white transition-all shadow-inner placeholder:text-gray-300"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-bam-navy hover:bg-bam-red text-white py-4 rounded-2xl flex items-center justify-center font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-100 hover:scale-[1.02] active:scale-95 disabled:opacity-50 mt-4"
                        >
                            {loading ? <div className="scale-75"><Loader /></div> : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-12 text-center space-y-4">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            Already a member?
                        </p>
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 text-bam-red font-black text-xs uppercase tracking-widest hover:underline group block"
                        >
                            {t('nav.sign_in')}
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <div className="pt-4 border-t border-gray-50">
                            <Link
                                to="/books"
                                className="text-[10px] font-black text-gray-300 uppercase tracking-widest hover:text-bam-navy transition-colors"
                            >
                                ← Back to Library
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
