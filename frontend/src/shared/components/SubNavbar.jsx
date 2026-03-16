import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters } from '../../features/books/bookSlice';
import axiosInstance from '../services/axiosInstance';
import { ChevronDown, Globe } from 'lucide-react';

const SubNavbar = () => {
    const dispatch = useDispatch();
    const { filters } = useSelector((state) => state.books);
    const { items: languages } = useSelector((state) => state.languages);
    const [categories, setCategories] = useState([]);
    const [showLangDropdown, setShowLangDropdown] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axiosInstance.get('/categories');
                setCategories(response.data.data);
            } catch (err) {
                console.error('Failed to fetch categories', err);
            }
        };
        fetchCategories();
    }, []);

    const handleFilterChange = (type, value) => {
        dispatch(setFilters({ [type]: value }));
        setShowLangDropdown(false);
    };

    return (
        <div className="bg-white border-b border-gray-200 shadow-sm hidden lg:block overflow-visible relative z-[40]">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between py-2">
                    {/* Categories List */}
                    <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide py-1">
                        <button
                            onClick={() => handleFilterChange('category', '')}
                            className={`text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-colors ${!filters.category ? 'text-bam-red border-b-2 border-bam-red' : 'text-bam-navy hover:text-bam-red'
                                }`}
                        >
                            All Categories
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => handleFilterChange('category', cat.slug)}
                                className={`text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-colors py-1 ${filters.category === cat.slug ? 'text-bam-red border-b-2 border-bam-red' : 'text-bam-navy hover:text-bam-red'
                                    }`}
                            >
                                {cat.name}
                            </button>
                        ))}

                        {/* Static BAM Links style */}
                        <span className="h-4 w-[1px] bg-gray-200 mx-2"></span>
                        <button className="text-[11px] font-serif italic text-lg text-bam-navy hover:text-bam-red whitespace-nowrap transform -rotate-1">
                            Autographed
                        </button>
                        <button className="text-[11px] font-black uppercase tracking-widest text-bam-red hover:underline whitespace-nowrap">
                            Sale
                        </button>
                    </div>

                    {/* Language Filter Dropdown */}
                    <div className="relative ml-8 border-l border-gray-100 pl-8">
                        <button
                            onClick={() => setShowLangDropdown(!showLangDropdown)}
                            className="flex items-center gap-2 text-[11px] font-black text-bam-navy uppercase tracking-widest hover:text-bam-red transition-colors"
                        >
                            <Globe size={14} className="text-gray-400" />
                            {filters.language ? languages.find(l => l.code === filters.language)?.name : 'Language'}
                            <ChevronDown size={14} className={`transition-transform duration-200 ${showLangDropdown ? 'rotate-180' : ''}`} />
                        </button>

                        {showLangDropdown && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setShowLangDropdown(false)}
                                ></div>
                                <div className="absolute right-0 mt-3 w-48 bg-white shadow-2xl rounded-xl border border-gray-100 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <button
                                        onClick={() => handleFilterChange('language', '')}
                                        className={`w-full text-left px-4 py-2 text-xs font-bold rounded-lg transition-colors ${!filters.language ? 'bg-gray-100 text-bam-navy' : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        All Languages
                                    </button>
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.id}
                                            onClick={() => handleFilterChange('language', lang.code)}
                                            className={`w-full text-left px-4 py-2 text-xs font-bold rounded-lg transition-colors ${filters.language === lang.code ? 'bg-gray-100 text-bam-navy' : 'text-gray-600 hover:bg-gray-50'
                                                }`}
                                        >
                                            {lang.name}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubNavbar;
