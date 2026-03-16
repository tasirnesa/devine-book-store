import React, { useRef } from 'react';
import BookCard from './BookCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BookCarousel = ({ title, subtitle, books, loading }) => {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === 'left'
                ? scrollLeft - clientWidth * 0.8
                : scrollLeft + clientWidth * 0.8;

            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    if (!loading && books.length === 0) return null;

    return (
        <section className="py-12 border-b border-gray-100 last:border-0 overflow-hidden">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="flex justify-between items-end mb-8 border-b border-gray-100 pb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-bam-navy tracking-tight">{title}</h2>
                        {subtitle && <p className="text-gray-500 italic font-serif mt-1">{subtitle}</p>}
                    </div>
                    <button className="text-[11px] font-black text-bam-navy hover:text-bam-red uppercase tracking-widest flex items-center gap-1 group">
                        Shop All <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                </div>

                {/* Carousel Container */}
                <div className="relative group">
                    {/* Navigation Buttons */}
                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center border border-gray-100 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all hover:bg-gray-50"
                    >
                        <ChevronLeft size={20} className="text-bam-navy" />
                    </button>

                    {/* Scrollable Area */}
                    <div
                        ref={scrollRef}
                        className="flex gap-6 overflow-x-auto scrollbar-hide snap-x"
                    >
                        {loading ? (
                            [...Array(5)].map((_, i) => (
                                <div key={i} className="min-w-[220px] max-w-[220px] aspect-[3/4] bg-gray-100 animate-pulse rounded-xl"></div>
                            ))
                        ) : (
                            books.map((book) => (
                                <div key={book.id} className="min-w-[220px] max-w-[220px] snap-start">
                                    <BookCard book={book} variant="compact" />
                                </div>
                            ))
                        )}
                    </div>

                    <button
                        onClick={() => scroll('right')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center border border-gray-100 opacity-0 group-hover:opacity-100 group-hover:-translate-x-2 transition-all hover:bg-gray-50"
                    >
                        <ChevronRight size={20} className="text-bam-navy" />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default BookCarousel;
