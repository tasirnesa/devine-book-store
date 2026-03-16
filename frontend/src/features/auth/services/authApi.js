import axiosInstance from '../../../shared/services/axiosInstance';
import { API_ENDPOINTS } from '../../../shared/services/apiEndpoints';

const authApi = {
    login: (credentials) => axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, credentials),
    register: (data) => axiosInstance.post(API_ENDPOINTS.AUTH.REGISTER, data),
    getMe: () => axiosInstance.get(API_ENDPOINTS.AUTH.ME),
};

export default authApi;
