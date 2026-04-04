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
        <main>
            <section className="section-block">
                <div className="section-heading">
                    <div>
                        <span className="eyebrow">Thương hiệu</span>
                        <h2>Danh Sách Thương Hiệu</h2>
                    </div>
                </div>
                {error && <div className="error-state">{error}</div>}
                <div className="grid-cards">
                    {brands.map((brand) => (
                        <article className="brand-card" key={brand._id}>
                            {brand.logo && <img className="brand-logo" src={brand.logo} alt={brand.name} />}
                            <h3>{brand.name}</h3>
                            <p>Thương hiệu đang có trong hệ thống demo.</p>
                        </article>
                    ))}
                </div>
            </section>
        </main>
    );
};

export default BrandList;
