import React from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, HelpCircle, Gift, Users, Calendar } from 'lucide-react';

const TopBar = () => {
    const { t } = useTranslation();

    return (
        <div className="bg-white border-b border-gray-100 py-2 hidden md:block">
            {/* <div className="container mx-auto px-4 flex justify-between items-center text-[11px] font-medium text-bam-navy uppercase tracking-wider">
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1.5 hover:text-bam-red transition-colors">
                        <MapPin size={12} className="text-gray-400" />
                        <span>Set My Store</span>
                    </button>
                    <div className="h-3 w-[1px] bg-gray-200"></div>
                    <button className="hover:text-bam-red transition-colors">Find a Store</button>
                </div>

                <div className="flex items-center gap-6">
                    <a href="#" className="hover:text-bam-red transition-colors flex items-center gap-1">
                        <Users size={12} /> Educators
                    </a>
                    <a href="#" className="hover:text-bam-red transition-colors flex items-center gap-1">
                        <Calendar size={12} /> Events
                    </a>
                    <a href="#" className="hover:text-bam-red transition-colors flex items-center gap-1">
                        <Gift size={12} /> Gift Cards
                    </a>
                    <a href="#" className="hover:text-bam-red transition-colors flex items-center gap-1">
                        <HelpCircle size={12} /> Help
                    </a>
                    <a href="#" className="hover:text-bam-red transition-colors font-bold text-bam-red">
                        Millionaire's Club
                    </a>
                </div>
            </div> */}
        </div>
    );
};

export default TopBar;
