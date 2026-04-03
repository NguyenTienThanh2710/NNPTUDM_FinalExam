import axios from 'axios';

const API_URL = 'http://localhost:5000/api/wishlist';

const getWishlist = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

const toggleWishlist = async (productId) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/toggle`, 
        { product_id: productId },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};

const checkInWishlist = async (productId) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/check/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

const wishlistService = {
    getWishlist,
    toggleWishlist,
    checkInWishlist
};

export default wishlistService;
