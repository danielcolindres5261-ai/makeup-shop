import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import './ProductDetails.css';

const ProductDetails = ({ addToCart }) => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [added, setAdded] = useState(false);

    useEffect(() => {
        fetch(`http://localhost:3001/api/products/${id}`)
            .then(res => res.json())
            .then(data => {
                setProduct(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching product:', err);
                setLoading(false);
            });
    }, [id]);

    const handleAddToCart = () => {
        addToCart(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    if (loading) return <div className="details-loading">Cargando...</div>;
    if (!product) return <div className="details-error">Producto no encontrado</div>;

    return (
        <div className="product-details-container">
            <Link to="/" className="back-link">
                <ArrowLeft size={20} /> Volver a la tienda
            </Link>

            <div className="details-grid">
                <div className="image-section">
                    <img src={product.imageUrl} alt={product.name} className="details-image" />
                </div>

                <div className="info-section">
                    <p className="brand-badge">{product.brand}</p>
                    <h1 className="details-title">{product.name}</h1>
                    <p className="details-price">${product.price.toFixed(2)}</p>

                    <div className="details-description">
                        <h3>Descripción</h3>
                        <p>{product.description}</p>
                    </div>

                    <button
                        className={`btn-primary add-btn ${added ? 'added' : ''}`}
                        onClick={handleAddToCart}
                        disabled={added}
                    >
                        {added ? (
                            <><Check size={20} /> Agregado</>
                        ) : (
                            'Añadir al Carrito'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
