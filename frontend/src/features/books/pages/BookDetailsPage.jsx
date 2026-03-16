import React from 'react';
import { useParams } from 'react-router-dom';

const BookDetailsPage = () => {
    const { id } = useParams();

    return (
        <div className="bg-white p-8 rounded-xl shadow-md max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">Book Title (ID: {id})</h1>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
                This is where the book description and details will appear.
            </p>
            <div className="flex space-x-4">
                <button className="btn btn-primary">Read Now</button>
                <button className="btn bg-gray-200 text-gray-800 hover:bg-gray-300">Download PDF</button>
            </div>
        </div>
    );
};

export default BookDetailsPage;
