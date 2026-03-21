import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../shared/layout/MainLayout';
import AdminLayout from '../shared/layout/AdminLayout';
import ProtectedRoute from '../shared/components/ProtectedRoute';

// Feature Pages (Placeholders)
import BookListPage from '../features/books/pages/BookListPage';
import BookDetailsPage from '../features/books/pages/BookDetailsPage';
import LoginPage from '../features/auth/pages/LoginPage';
import RegisterPage from '../features/auth/pages/RegisterPage';
import ProfilePage from '../features/users/pages/ProfilePage';

// Admin Pages
import AdminDashboardPage from '../features/admin/pages/AdminDashboardPage';
import AdminBookListPage from '../features/admin/pages/AdminBookListPage';
import AdminUserListPage from '../features/admin/pages/AdminUserListPage';
import AdminBorrowPage from '../features/admin/pages/AdminBorrowPage';
import AdminTaxonomyPage from '../features/admin/pages/AdminTaxonomyPage';
import AdminReportsPage from '../features/admin/pages/AdminReportsPage';
import AdminSettingsPage from '../features/admin/pages/AdminSettingsPage';
import AddBookPage from '../features/books/pages/AddBookPage';
import BookReaderPage from '../features/books/pages/BookReaderPage';
import SavedBooksPage from '../features/books/pages/SavedBooksPage';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes with MainLayout */}
            <Route element={<MainLayout />}>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/books" element={<BookListPage />} />
                <Route path="/books/:slug" element={<BookDetailsPage />} />
                <Route path="/saved" element={<SavedBooksPage />} />
                <Route path="/books/:slug/read" element={<BookReaderPage />} />
            </Route>

            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                    <Route path="/profile" element={<ProfilePage />} />
                </Route>
            </Route>

            {/* Admin Only Routes */}
            <Route element={<ProtectedRoute adminOnly={true} />}>
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboardPage />} />
                    <Route path="books" element={<AdminBookListPage />} />
                    <Route path="books/add" element={<AddBookPage />} />
                    <Route path="books/edit/:id" element={<AddBookPage />} />
                    <Route path="borrow" element={<AdminBorrowPage />} />
                    <Route path="users" element={<AdminUserListPage />} />
                    <Route path="taxonomy" element={<AdminTaxonomyPage />} />
                    <Route path="reports" element={<AdminReportsPage />} />
                    <Route path="settings" element={<AdminSettingsPage />} />
                </Route>
            </Route>

            {/* 404 Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;
