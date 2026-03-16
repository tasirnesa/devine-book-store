import axiosInstance from '../../../shared/services/axiosInstance';
import { API_ENDPOINTS } from '../../../shared/services/apiEndpoints';

const languageApi = {
    getLanguages: () => axiosInstance.get(API_ENDPOINTS.LANGUAGES),
};

export default languageApi;
