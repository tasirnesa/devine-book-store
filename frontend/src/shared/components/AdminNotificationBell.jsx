import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import axiosInstance from '../services/axiosInstance';

const AdminNotificationBell = () => {
    const [count, setCount] = useState(0);

    const fetchPendingCount = async () => {
        try {
            const response = await axiosInstance.get('/reservations/admin/pending-count');
            if (response.data.success) {
                setCount(response.data.data.count);
            }
        } catch (error) {
            console.error('Failed to fetch pending reservations count', error);
        }
    };

    useEffect(() => {
        fetchPendingCount();
        // Poll every 30 seconds
        const interval = setInterval(fetchPendingCount, 30000);
        return () => clearInterval(interval);
    }, []);

    if (count === 0) {
        return (
            <div className="flex flex-col items-center text-bam-navy opacity-40">
                <Bell size={26} strokeWidth={1.5} />
                <span className="text-[10px] font-bold uppercase tracking-widest mt-0.5">Alerts</span>
            </div>
        );
    }

    return (
        <Link 
            to="/admin/borrow?tab=reservations" 
            className="flex flex-col items-center text-bam-red hover:text-bam-navy transition-colors relative group"
        >
            <div className="relative">
                <Bell 
                    size={26} 
                    strokeWidth={1.5} 
                    className="blink-red"
                />
                <span className="absolute -top-1.5 -right-2 bg-bam-red text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-lg shadow-red-200">
                    {count}
                </span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest mt-0.5">
                New Approval
            </span>
        </Link>
    );
};

export default AdminNotificationBell;
