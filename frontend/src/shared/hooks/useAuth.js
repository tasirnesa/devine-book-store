import { useSelector, useDispatch } from 'react-redux';
import { logout as logoutAction } from '../authSlice';

const useAuth = () => {
    const dispatch = useDispatch();
    const { user, isAuthenticated, loading, error } = useSelector((state) => state.auth);

    const logout = () => {
        dispatch(logoutAction());
    };

    return {
        user,
        isAuthenticated,
        loading,
        error,
        logout,
    };
};

export default useAuth;
