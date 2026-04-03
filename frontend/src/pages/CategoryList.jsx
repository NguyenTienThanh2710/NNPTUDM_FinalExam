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
        <main>
            <section className="section-block">
                <div className="section-heading">
                    <div>
                        <span className="eyebrow">Collections</span>
                        <h2>Danh Mục Sản Phẩm</h2>
                    </div>
                </div>
                {error && <div className="error-state">{error}</div>}
                <div className="grid-cards">
                    {categories.map((category) => (
                        <article className="category-card" key={category._id}>
                            <span className="eyebrow">Category</span>
                            <h3>{category.name}</h3>
                            <p>{category.description}</p>
                        </article>
                    ))}
                </div>
            </section>
        </main>
    );
};

export default CategoryList;
