import React from 'react';
import { useTranslation } from 'react-i18next';

const AboutPage = () => {
    const { t } = useTranslation();

    return (
        <div className="bg-white min-h-screen pt-20 pb-20">
            <div className="container mx-auto px-6 max-w-4xl">
                <header className="mb-16">
                    <h1 className="text-4xl md:text-5xl font-serif text-slate-900 tracking-tight mb-6">
                        About Christian Focus
                    </h1>
                    <div className="h-1 w-20 bg-bam-red mb-8"></div>
                    <p className="text-xl text-slate-500 font-serif leading-relaxed italic">
                        "Deepen Your Understanding, Elevate Your Soul"
                    </p>
                </header>

                <div className="prose prose-slate prose-lg max-w-none">
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4 uppercase tracking-widest text-sm">Our Mission</h2>
                        <p className="text-slate-600 leading-loose">
                            Christian Focus is dedicated to curating and preserving a rich collection of spiritual literature. 
                            Our mission is to provide accessible paths to knowledge, wisdom, and spiritual growth through 
                            a carefully selected library of books, journals, and archives.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4 uppercase tracking-widest text-sm">The Archives</h2>
                        <p className="text-slate-600 leading-loose">
                            From historical manuscripts to modern insights, our archives bring together voices from 
                            diverse spiritual backgrounds. We believe in the power of the written word to transform lives 
                            and strengthen communities.
                        </p>
                    </section>

                    <section className="grid md:grid-cols-2 gap-12 mt-20">
                        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                            <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest mb-4">Values</h3>
                            <ul className="space-y-4 text-slate-600 text-sm font-medium">
                                <li className="flex items-center gap-3">
                                    <span className="w-1.5 h-1.5 bg-bam-red rounded-full"></span>
                                    Spiritual Integrity
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="w-1.5 h-1.5 bg-bam-red rounded-full"></span>
                                    Community Access
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="w-1.5 h-1.5 bg-bam-red rounded-full"></span>
                                    Preservation of Wisdom
                                </li>
                            </ul>
                        </div>
                        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                            <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest mb-4">Community</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                Join our growing community of readers and seekers. Explore our journal for the latest 
                                thoughts and contribute to the ongoing conversation of faith.
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
