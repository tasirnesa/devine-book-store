import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, BellOff } from 'lucide-react';
import axiosInstance from '../services/axiosInstance';
import { Link } from 'react-router-dom';

const UserNotificationBell = () => {
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);

    const fetchUnreadCount = async () => {
        try {
            const res = await axiosInstance.get('/notifications/unread-count');
            setUnreadCount(res.data.data.count);
        } catch (err) {
            console.error('Failed to fetch notification count', err);
        }
    };

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get('/notifications');
            setNotifications(res.data.data);
        } catch (err) {
            console.error('Failed to fetch notifications', err);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await axiosInstance.patch(`/notifications/${id}/read`);
            setUnreadCount(prev => Math.max(0, prev - 1));
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        } catch (err) {
            console.error('Failed to mark notification as read', err);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axiosInstance.patch('/notifications/read-all');
            setUnreadCount(0);
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (err) {
            console.error('Failed to mark all as read', err);
        }
    };

    useEffect(() => {
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 60000); // Poll every minute
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen]);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-full transition-all relative ${unreadCount > 0 ? 'text-bam-red animate-pulse' : 'text-gray-500 hover:bg-gray-100'}`}
                title="Notifications"
            >
                <Bell size={24} />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-bam-red text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white transform translate-x-1 -translate-y-1">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-[100] animate-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                        <h3 className="text-xs font-black uppercase tracking-widest text-bam-navy">Alerts</h3>
                        {unreadCount > 0 && (
                            <button 
                                onClick={markAllAsRead}
                                className="text-[10px] font-bold text-bam-red hover:underline"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {loading ? (
                            <div className="p-8 text-center text-gray-400 text-xs font-medium">Loading alerts...</div>
                        ) : notifications.length > 0 ? (
                            notifications.map((n) => (
                                <div 
                                    key={n.id} 
                                    className={`p-4 border-b border-gray-50 last:border-0 transition-colors ${!n.isRead ? 'bg-blue-50/30' : 'hover:bg-gray-50'}`}
                                >
                                    <div className="flex gap-3">
                                        <div className="flex-grow space-y-1">
                                            <p className={`text-xs ${!n.isRead ? 'font-bold text-bam-navy' : 'text-gray-500'}`}>
                                                {n.message}
                                            </p>
                                            <p className="text-[10px] text-gray-400">
                                                {new Date(n.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        {!n.isRead && (
                                            <button 
                                                onClick={() => markAsRead(n.id)}
                                                className="w-6 h-6 rounded-full bg-white border border-gray-100 flex items-center justify-center text-bam-red hover:bg-bam-red hover:text-white transition-all shadow-sm"
                                            >
                                                <Check size={12} />
                                            </button>
                                        )}
                                    </div>
                                    {n.link && (
                                        <Link 
                                            to={n.link}
                                            onClick={() => {
                                                setIsOpen(false);
                                                if (!n.isRead) markAsRead(n.id);
                                            }}
                                            className="mt-2 text-[10px] font-black uppercase tracking-widest text-bam-navy hover:text-bam-red inline-flex items-center gap-1"
                                        >
                                            View Details
                                        </Link>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="p-12 text-center text-gray-400 opacity-50 flex flex-col items-center gap-3">
                                <BellOff size={32} />
                                <p className="text-[10px] font-black uppercase tracking-widest">Peaceful Silence</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserNotificationBell;
