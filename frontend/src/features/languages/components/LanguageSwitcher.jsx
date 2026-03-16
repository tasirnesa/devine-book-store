import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters } from '../../books/bookSlice';
import { Globe, ChevronDown, Check } from 'lucide-react';

const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'ar', name: 'Arabic', native: 'العربية' },
    { code: 'am', name: 'Amharic', native: 'አማርኛ' },
    { code: 'om', name: 'Oromo', native: 'Afaan Oromoo' },
];

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const dispatch = useDispatch();
    const { filters } = useSelector((state) => state.books);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const currentLanguage = languages.find(l => l.code === i18n.language) || languages[0];

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        document.dir = lng === 'ar' ? 'rtl' : 'ltr';
        
        // Sync with Redux filters to trigger book refetch
        dispatch(setFilters({ language: lng }));
        setIsOpen(false);
    };

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Initial sync
    useEffect(() => {
        if (filters.language !== i18n.language) {
            dispatch(setFilters({ language: i18n.language }));
            document.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
        }
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-full border border-gray-100 bg-white hover:border-bam-red hover:shadow-md transition-all group"
            >
                <Globe size={18} className="text-bam-navy group-hover:text-bam-red" />
                <span className="text-[11px] font-black text-bam-navy uppercase tracking-widest hidden lg:block">
                    {currentLanguage.code}
                </span>
                <ChevronDown size={14} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-2xl z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2">
                    <div className="p-2 border-b border-gray-50">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 py-2 block">
                            Select Language
                        </span>
                    </div>
                    <div className="p-1">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => changeLanguage(lang.code)}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all ${
                                    i18n.language === lang.code
                                        ? 'bg-bam-navy text-white'
                                        : 'text-bam-navy hover:bg-gray-50'
                                }`}
                            >
                                <div className="flex flex-col items-start px-1">
                                    <span className={`font-bold ${i18n.language === lang.code ? 'text-white' : 'text-bam-navy'}`}>
                                        {lang.native}
                                    </span>
                                    <span className={`text-[10px] opacity-60 font-medium ${i18n.language === lang.code ? 'text-white' : ''}`}>
                                        {lang.name}
                                    </span>
                                </div>
                                {i18n.language === lang.code && <Check size={16} />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher;
