import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../shared/services/axiosInstance';
import { Settings, Save, Bell, Shield, Database, Globe, DollarSign, Info, CheckCircle, Clock } from 'lucide-react';
import Loader from '../../../shared/components/Loader';

const AdminSettingsPage = () => {
    const [settings, setSettings] = useState({
        library_name: 'Spiritual Library',
        fine_per_day: '5',
        borrowing_period: '14',
        contact_email: 'admin@library.com',
        maintenance_mode: 'false'
    });
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/admin/settings');
            if (response.data.data && Object.keys(response.data.data).length > 0) {
                setSettings(prev => ({ ...prev, ...response.data.data }));
            }
        } catch (err) {
            console.error('Failed to fetch settings', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage('');
        try {
            await axiosInstance.patch('/admin/settings', settings);
            setMessage('Settings updated successfully');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            console.error('Save failed', err);
            alert('Failed to save settings');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return <div className="h-[60vh] flex items-center justify-center"><Loader /></div>;

    return (
        <div className="space-y-8 max-w-4xl pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-bam-navy tracking-tight font-serif italic">System Settings</h1>
                    <p className="text-gray-500 font-medium text-sm">Configure the core parameters of the spiritual archives.</p>
                </div>
                {message && (
                    <div className="bg-green-100 text-green-700 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 animate-in slide-in-from-top-4">
                        <CheckCircle size={16} />
                        {message}
                    </div>
                )}
            </div>

            <form onSubmit={handleSave} className="space-y-8">
                {/* General Settings */}
                <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-8 border-b border-gray-100 bg-gray-50/50 flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm text-bam-navy flex items-center justify-center">
                            <Database size={20} />
                        </div>
                        <h3 className="text-lg font-black text-bam-navy font-serif italic">General Configuration</h3>
                    </div>
                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Library Name</label>
                            <input
                                className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-bam-navy focus:ring-2 focus:ring-bam-navy/5"
                                value={settings.library_name}
                                onChange={(e) => handleChange('library_name', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Contact Email</label>
                            <input
                                type="email"
                                className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-bam-navy focus:ring-2 focus:ring-bam-navy/5"
                                value={settings.contact_email}
                                onChange={(e) => handleChange('contact_email', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Circulation Rules */}
                <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-8 border-b border-gray-100 bg-gray-50/50 flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm text-bam-red flex items-center justify-center">
                            <Settings size={20} />
                        </div>
                        <h3 className="text-lg font-black text-bam-navy font-serif italic">Circulation & Fines</h3>
                    </div>
                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Borrowing Period (Days)</label>
                            <div className="relative">
                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                <input
                                    type="number"
                                    className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-bam-navy focus:ring-2 focus:ring-bam-navy/5"
                                    value={settings.borrowing_period}
                                    onChange={(e) => handleChange('borrowing_period', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Fine Per Day (ETB/Units)</label>
                            <div className="relative">
                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                <input
                                    type="number"
                                    className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-bam-navy focus:ring-2 focus:ring-bam-navy/5"
                                    value={settings.fine_per_day}
                                    onChange={(e) => handleChange('fine_per_day', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* System Status */}
                <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-8 border-b border-gray-100 bg-gray-50/50 flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm text-blue-500 flex items-center justify-center">
                            <Shield size={20} />
                        </div>
                        <h3 className="text-lg font-black text-bam-navy font-serif italic">Maintenance & Security</h3>
                    </div>
                    <div className="p-8">
                        <div className="flex items-center justify-between p-6 bg-gray-50 rounded-[2rem]">
                            <div className="flex items-center gap-4">
                                <div className={`w-3 h-3 rounded-full ${settings.maintenance_mode === 'true' ? 'bg-bam-red animate-pulse' : 'bg-green-500'}`}></div>
                                <div>
                                    <p className="text-sm font-bold text-bam-navy">Maintenance Mode</p>
                                    <p className="text-[10px] text-gray-400 font-medium">If enabled, seekers will only see a maintenance screen.</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleChange('maintenance_mode', settings.maintenance_mode === 'true' ? 'false' : 'true')}
                                className={`w-14 h-8 rounded-full transition-all flex items-center p-1 ${settings.maintenance_mode === 'true' ? 'bg-bam-red' : 'bg-gray-200'}`}
                            >
                                <div className={`w-6 h-6 bg-white rounded-full transition-all transform ${settings.maintenance_mode === 'true' ? 'translate-x-6 shadow-md' : 'translate-x-0'}`}></div>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="bg-bam-navy text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] flex items-center gap-4 hover:bg-bam-red transition-all shadow-2xl shadow-blue-200 hover:shadow-red-200 active:scale-[0.98] disabled:opacity-50"
                    >
                        {isSaving ? <Loader /> : (
                            <>
                                <Save size={20} />
                                Synchronize Settings
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminSettingsPage;
