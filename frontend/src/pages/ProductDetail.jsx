import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [error, setError] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get(`/products/${id}`);
                setProduct(res.data);
            } catch (_err) {
                setError('Không thể lấy thông tin sản phẩm');
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        setAdding(true);
        try {
            await api.post('/cart', {
                product_id: id,
                quantity: quantity
            });
            alert('Đã thêm sản phẩm vào giỏ hàng!');
            navigate('/cart');
        } catch (err) {
            alert(err.response?.data?.message || 'Vui lòng đăng nhập để thêm vào giỏ hàng');
            if (err.response?.status === 401) {
                navigate('/login');
            }
        } finally {
            setAdding(false);
        }
    };

    if (!product) return <p>Đang tải...</p>;

    return (
        <div style={{ padding: '20px' }}>
            <button onClick={() => navigate(-1)}>Quay lại</button>
            <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                <div style={{ flex: '1' }}>
                    {product.images && product.images.map((img, index) => (
                        <img key={index} src={img} alt={product.name} style={{ width: '100%', marginBottom: '10px' }} />
                    ))}
                </div>
                <div style={{ flex: '2' }}>
                    <h2>{product.name}</h2>
                    <p style={{ fontSize: '1.2em', fontWeight: 'bold' }}>Giá: {product.price.toLocaleString()} VNĐ</p>
                    <p>Thương hiệu: {product.brand_id?.name || 'N/A'}</p>
                    <p>Danh mục: {product.category_id?.name || 'N/A'}</p>
                    <p>Số lượng còn lại: {product.stock}</p>
                    <div style={{ marginTop: '20px' }}>
                        <h3>Mô tả sản phẩm:</h3>
                        <p>{product.description}</p>
                    </div>
                    <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <label>Số lượng: </label>
                        <input 
                            type="number" 
                            min="1" 
                            max={product.stock} 
                            value={quantity} 
                            onChange={(e) => setQuantity(parseInt(e.target.value))}
                            style={{ width: '50px', padding: '5px' }}
                        />
                    </div>
                    <button 
                        onClick={handleAddToCart}
                        disabled={adding || product.stock === 0}
                        style={{ 
                            padding: '10px 20px', 
                            marginTop: '20px', 
                            cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                            backgroundColor: product.stock === 0 ? '#ccc' : '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px'
                        }}
                    >
                        {adding ? 'Đang thêm...' : product.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
                    </button>
                </div>
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default ProductDetail;
