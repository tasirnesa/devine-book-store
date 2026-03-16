import React from 'react';
import { useTranslation } from 'react-i18next';
import { Facebook, Twitter, Instagram, Youtube, Mail, MapPin, Phone, Github } from 'lucide-react';

const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer className="bg-bam-navy text-gray-300 pt-16 pb-8 border-t border-bam-navy">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand & Newsletter */}
                    <div className="space-y-6">
                        <h3 className="text-white text-2xl font-serif font-black italic tracking-tighter">
                            {t('common.app_name')}
                        </h3>
                        <p className="text-sm leading-relaxed opacity-70">
                            {t('footer.newsletter_title')}
                        </p>
                        <div className="relative group">
                            <input
                                type="email"
                                placeholder={t('footer.newsletter_placeholder')}
                                className="w-full bg-white/5 border border-white/10 rounded-full py-3 px-6 text-sm focus:outline-none focus:border-bam-red transition-all"
                            />
                            <button className="absolute right-1 top-1 bottom-1 bg-bam-red text-white p-2 rounded-full hover:scale-110 transition-transform">
                                <Mail size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Quick Shop */}
                    <div className="space-y-6">
                        <h4 className="text-white font-black uppercase text-xs tracking-widest border-l-4 border-bam-red pl-4">{t('footer.categories_title')}</h4>
                        <ul className="space-y-3 text-sm font-medium">
                            <li className="hover:text-bam-red transition-colors cursor-pointer">{t('footer.most_read')}</li>
                            <li className="hover:text-bam-red transition-colors cursor-pointer">{t('footer.new_additions')}</li>
                            <li className="hover:text-bam-red transition-colors cursor-pointer">{t('footer.special_collections')}</li>
                            <li className="hover:text-bam-red transition-colors cursor-pointer">{t('footer.study_guides')}</li>
                            <li className="hover:text-bam-red transition-colors cursor-pointer">{t('footer.ancient_wisdom')}</li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div className="space-y-6">
                        <h4 className="text-white font-black uppercase text-xs tracking-widest border-l-4 border-bam-red pl-4">{t('footer.support_title')}</h4>
                        <ul className="space-y-3 text-sm font-medium">
                            <li className="hover:text-bam-red transition-colors cursor-pointer">{t('footer.reading_lists')}</li>
                            <li className="hover:text-bam-red transition-colors cursor-pointer">{t('footer.community_guidelines')}</li>
                            <li className="hover:text-bam-red transition-colors cursor-pointer">{t('footer.submit_book')}</li>
                            <li className="hover:text-bam-red transition-colors cursor-pointer">{t('footer.members_club')}</li>
                            <li className="hover:text-bam-red transition-colors cursor-pointer">{t('footer.help_faqs')}</li>
                        </ul>
                    </div>

                    {/* Contact & Social */}
                    <div className="space-y-6">
                        <h4 className="text-white font-black uppercase text-xs tracking-widest border-l-4 border-bam-red pl-4">{t('footer.stay_connected')}</h4>
                        <div className="space-y-4 text-sm font-medium">
                            <div className="flex items-center gap-3">
                                <MapPin size={18} className="text-bam-red shrink-0" />
                                <span>123 Wisdom Way, Spiritual City</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone size={18} className="text-bam-red shrink-0" />
                                <span>(555) 123-4567</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 pt-4">
                            <button className="bg-white/5 p-2.5 rounded-full hover:bg-bam-red transition-colors">
                                <Facebook size={18} />
                            </button>
                            <button className="bg-white/5 p-2.5 rounded-full hover:bg-bam-red transition-colors">
                                <Instagram size={18} />
                            </button>
                            <button className="bg-white/5 p-2.5 rounded-full hover:bg-bam-red transition-colors">
                                <Twitter size={18} />
                            </button>
                            <button className="bg-white/5 p-2.5 rounded-full hover:bg-bam-red transition-colors">
                                <Youtube size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-black uppercase tracking-widest opacity-40">
                    <p>&copy; {new Date().getFullYear()} {t('common.app_name')}. {t('footer.all_rights_reserved')}</p>
                    <div className="flex items-center gap-8">
                        <span className="hover:text-bam-red transition-colors cursor-pointer">{t('footer.privacy_policy')}</span>
                        <span className="hover:text-bam-red transition-colors cursor-pointer">{t('footer.terms_of_service')}</span>
                        <span className="hover:text-bam-red transition-colors cursor-pointer">{t('footer.accessibility')}</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
