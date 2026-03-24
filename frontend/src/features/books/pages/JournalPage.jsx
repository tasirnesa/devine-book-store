import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, ChevronRight } from 'lucide-react';

const JournalPage = () => {
    const { t } = useTranslation();

    // Mock journal entries for minimalist listing
    const journalEntries = [
        {
            id: 1,
            title: "Navigating Spiritual Growth in a Modern World",
            author: "Elder Thomas",
            date: "March 15, 2026",
            excerpt: "Explore the intersections of ancient wisdom and modern technology in this month's feature article...",
            category: "REFLECTIONS"
        },
        {
            id: 2,
            title: "The Power of Silent Reflection",
            author: "Sister Mary",
            date: "March 10, 2026",
            excerpt: "In the noise of our daily lives, finding silence is the first step toward hearing the voice of the spirit.",
            category: "PRACTICE"
        },
        {
            id: 3,
            title: "Historical Context: The Reformation Manuscripts",
            author: "Dr. Arone",
            date: "March 1, 2026",
            excerpt: "A deep dive into our recently digitized collection of 16th-century texts and their relevance today.",
            category: "ARCHIVES"
        }
    ];

    return (
        <div className="bg-white min-h-screen pt-20 pb-20">
            <div className="container mx-auto px-6 max-w-5xl">
                <header className="mb-16 border-b border-slate-100 pb-12">
                    <h1 className="text-4xl md:text-5xl font-serif text-slate-900 tracking-tight mb-4">
                        Spiritual Journal
                    </h1>
                    <p className="text-slate-500 uppercase tracking-[0.3em] text-[10px] font-black">
                        Thoughts, Essays, and Community Reflections
                    </p>
                </header>

                <div className="space-y-16">
                    {journalEntries.map((entry) => (
                        <article key={entry.id} className="group cursor-pointer">
                            <div className="flex flex-col md:flex-row md:items-start gap-8">
                                <div className="md:w-1/4">
                                    <span className="text-bam-red text-[10px] font-black tracking-widest uppercase mb-2 block">
                                        {entry.category}
                                    </span>
                                    <div className="flex items-center gap-2 text-slate-400 text-[11px] font-medium">
                                        <Calendar size={12} />
                                        {entry.date}
                                    </div>
                                </div>
                                <div className="md:w-3/4">
                                    <h2 className="text-2xl font-serif text-slate-900 mb-3 group-hover:text-bam-red transition-colors">
                                        {entry.title}
                                    </h2>
                                    <p className="text-slate-500 leading-relaxed mb-6 font-medium">
                                        {entry.excerpt}
                                    </p>
                                    <div className="flex items-center gap-2 text-slate-900 text-xs font-black uppercase tracking-widest group-hover:gap-4 transition-all">
                                        Read Essay
                                        <ChevronRight size={14} />
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {journalEntries.length === 0 && (
                    <div className="py-20 text-center bg-slate-50 rounded-3xl border border-slate-100">
                        <p className="text-slate-400 font-serif italic">No journal entries found at this time.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JournalPage;
