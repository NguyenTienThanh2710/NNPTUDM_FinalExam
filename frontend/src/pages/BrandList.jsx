import React, { useEffect, useState } from 'react';
import api from '../services/api';

const BrandList = () => {
    const [brands, setBrands] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const res = await api.get('/brands');
                setBrands(res.data);
            } catch (_err) {
                setError('Không thể lấy danh sách thương hiệu');
            }
        };
        fetchBrands();
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h2>Danh Sách Thương Hiệu</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {brands.map((brand) => (
                    <li key={brand._id}>
                        {brand.name} {brand.logo && <img src={brand.logo} alt={brand.name} width="50" />}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BrandList;
