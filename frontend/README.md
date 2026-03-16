# Spiritual Book Library — Frontend

A modern React application built with Redux Toolkit and Vite for exploring spiritual literature.

## Features
- **Multilingual Support**: English, Arabic, Amharic, and Afan Oromo.
- **State Management**: Redux Toolkit for centralized data handling.
- **Styling**: Tailwind CSS for a premium, responsive design.
- **Routing**: React Router for seamless navigation.
- **Internationalization**: i18next for smooth language switching.

## Tech Stack
- **React 18**
- **Vite** (Build Tool)
- **Redux Toolkit** (State Management)
- **React Router Dom** (Routing)
- **i18next** (I18n)
- **Tailwind CSS** (Styling)
- **Axios** (API Requests)

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Set Environment Variables**:
   Copy `.env.example` to `.env` and update the `VITE_API_BASE_URL`.

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

## Folder Structure
- `src/app`: Store, Reducer, and Routes configuration.
- `src/features`: Logic and components grouped by feature (Books, Auth, Languages, Users).
- `src/shared`: Reusable components, hooks, layouts, and services.
- `src/i18n`: Translation files and configuration.
- `src/assets`: Images and icons.
