import axiosInstance from '../../../shared/services/axiosInstance';
import { API_ENDPOINTS } from '../../../shared/services/apiEndpoints';

const bookApi = {
    getBooks: () => axiosInstance.get(API_ENDPOINTS.BOOKS),
    getBook: (id) => axiosInstance.get(`${API_ENDPOINTS.BOOKS}/${id}`),
    createBook: (data) => axiosInstance.post(API_ENDPOINTS.BOOKS, data),
    updateBook: (id, data) => axiosInstance.put(`${API_ENDPOINTS.BOOKS}/${id}`, data),
    deleteBook: (id) => axiosInstance.delete(`${API_ENDPOINTS.BOOKS}/${id}`),
};

export default bookApi;
