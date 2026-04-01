import React, { useEffect, useState } from 'react';
import api from '../services/api';

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get('/categories');
                setCategories(res.data);
            } catch (_err) {
                setError('Không thể lấy danh sách danh mục');
            }
        };
        fetchCategories();
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h2>Danh Mục Sản Phẩm</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {categories.map((category) => (
                    <li key={category._id}>
                        <strong>{category.name}</strong>: {category.description}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategoryList;
