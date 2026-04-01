import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get('/products');
                setProducts(res.data);
            } catch (_err) {
                setError('Không thể lấy danh sách sản phẩm');
            }
        };
        fetchProducts();
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h2>Danh Sách Sản Phẩm</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                {products.length > 0 ? products.map((product) => (
                    <div key={product._id} style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '8px' }}>
                        {product.images && product.images.length > 0 && (
                            <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                        )}
                        <h3>{product.name}</h3>
                        <p>Giá: {product.price.toLocaleString()} VNĐ</p>
                        <p>Thương hiệu: {product.brand_id?.name || 'N/A'}</p>
                        <Link to={`/products/${product._id}`}>Xem chi tiết</Link>
                    </div>
                )) : <p>Chưa có sản phẩm nào.</p>}
            </div>
        </div>
    );
};

export default ProductList;
