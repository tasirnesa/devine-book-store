import { useSelector, useDispatch } from 'react-redux';
import { fetchBooks } from '../bookSlice';

const useBooks = () => {
    const dispatch = useDispatch();
    const { items, loading, error } = useSelector((state) => state.books);

    const getBooks = () => {
        dispatch(fetchBooks());
    };

    return {
        items,
        loading,
        error,
        getBooks,
    };
};

export default useBooks;
