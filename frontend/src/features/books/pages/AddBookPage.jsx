import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, Upload, Plus, Trash2, Info, Image as ImageIcon } from 'lucide-react';
import axiosInstance from '../../../shared/services/axiosInstance';
import Loader from '../../../shared/components/Loader';

const BookForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        isbn: '',
        slug: '',
        authorName: '',
        title: '',
        description: '',
        categoryIds: [],
        cover: null
    });
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const catRes = await axiosInstance.get('/categories');
                setCategories(catRes.data.data);

                if (isEdit) {
                    const bookRes = await axiosInstance.get(`/books/${id}`);
                    const book = bookRes.data.data;
                    const translation = book.activeTranslation || {};

                    setFormData({
                        isbn: book.isbn || '',
                        slug: book.slug || '',
                        authorName: translation.authorName || '',
                        title: translation.title || '',
                        description: translation.description || '',
                        categoryIds: book.categories?.map(c => c.id) || [],
                        cover: null
                    });
                    if (book.coverUrl) {
                        setPreview(`${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}${book.coverUrl}`);
                    }
                }
            } catch (err) {
                console.error('Failed to fetch data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, isEdit]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCategoryToggle = (catId) => {
        setFormData(prev => ({
            ...prev,
            categoryIds: prev.categoryIds.includes(catId)
                ? prev.categoryIds.filter(id => id !== catId)
                : [...prev.categoryIds, catId]
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, cover: file }));
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'categoryIds') {
                formData[key].forEach(id => data.append('categoryIds[]', id));
            } else if (key === 'cover' && formData[key]) {
                data.append('cover', formData[key]);
            } else if (formData[key]) {
                data.append(key, formData[key]);
            }
        });

        // Add default language for the first translation
        data.append('languageCode', 'en');

        try {
            if (isEdit) {
                await axiosInstance.put(`/books/${id}`, data);
            } else {
                await axiosInstance.post('/books', data);
            }
            navigate('/admin/books');
        } catch (err) {
            console.error('Failed to save book', err);
            alert('Error saving book. Please check all fields.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black text-bam-navy tracking-tight font-serif">
                        {isEdit ? 'Edit Work' : 'Add New Work'}
                    </h1>
                    <p className="text-gray-500 text-sm">Fill in the details to update the library catalog.</p>
                </div>
                <button
                    onClick={() => navigate('/admin/books')}
                    className="p-3 text-gray-400 hover:text-bam-red transition-colors"
                >
                    <X size={24} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Cover & Meta */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="text-xs font-black text-bam-navy uppercase tracking-widest mb-4 flex items-center gap-2">
                            <ImageIcon size={14} className="text-bam-red" />
                            Cover Image
                        </h3>
                        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 group">
                            {preview ? (
                                <img src={preview} alt="Upload preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 p-4 text-center">
                                    <Upload size={32} className="mb-2 opacity-50" />
                                    <p className="text-[10px] font-black uppercase tracking-widest">Click to upload cover</p>
                                </div>
                            )}
                            <input
                                type="file"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={handleFileChange}
                                accept="image/*"
                            />
                            {preview && (
                                <div className="absolute inset-0 bg-bam-navy/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <p className="text-white text-[10px] font-black uppercase tracking-widest">Change Cover</p>
                                </div>
                            )}
                        </div>
                        <p className="text-[9px] text-gray-400 mt-3 italic">Recommended: 300x400px, JPEG or PNG</p>
                    </div>

                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="text-xs font-black text-bam-navy uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Info size={14} className="text-bam-red" />
                            Identifiers
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">ISBN</label>
                                <input
                                    type="text"
                                    name="isbn"
                                    value={formData.isbn}
                                    onChange={handleInputChange}
                                    placeholder="e.g. 978-3-16-148410-0"
                                    className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-bam-navy/5"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">URL Slug</label>
                                <input
                                    type="text"
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleInputChange}
                                    placeholder="e.g. ancient-wisdom-book"
                                    className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-bam-navy/5"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                        <h3 className="text-xs font-black text-bam-navy uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Plus size={14} className="text-bam-red" />
                            Book Details (English)
                        </h3>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Author Name</label>
                                <input
                                    type="text"
                                    name="authorName"
                                    required
                                    value={formData.authorName}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-50 border-none rounded-xl py-4 px-6 text-lg font-bold text-bam-navy focus:ring-2 focus:ring-bam-navy/5"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Book Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-50 border-none rounded-xl py-4 px-6 text-2xl font-black text-bam-navy font-serif focus:ring-2 focus:ring-bam-navy/5"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Description</label>
                                <textarea
                                    name="description"
                                    required
                                    rows="10"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-50 border-none rounded-3xl py-4 px-6 text-sm leading-relaxed text-gray-600 focus:ring-2 focus:ring-bam-navy/5"
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="text-xs font-black text-bam-navy uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Filter size={14} className="text-bam-red" />
                            Categories
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => handleCategoryToggle(cat.id)}
                                    className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${formData.categoryIds.includes(cat.id)
                                            ? 'bg-bam-navy text-white shadow-lg'
                                            : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                                        }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/books')}
                            className="px-8 py-4 rounded-xl text-xs font-black text-gray-400 uppercase tracking-widest hover:text-bam-red transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className={`flex items-center gap-3 px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl ${saving ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-bam-navy text-white hover:bg-bam-red shadow-blue-100'
                                }`}
                        >
                            {saving ? 'Processing...' : (
                                <>
                                    <Save size={18} />
                                    {isEdit ? 'Save Changes' : 'Publish Book'}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default BookForm;
