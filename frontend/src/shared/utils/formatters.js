export const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

export const truncateString = (str, num) => {
    if (str?.length <= num) return str;
    return str?.slice(0, num) + '...';
};
