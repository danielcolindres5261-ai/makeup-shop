import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product, onAddToCart }) => {
    return (
        <div className="product-card">
            <div className="product-image-container">
                <img src={product.imageUrl} alt={product.name} className="product-image" />
                <button
                    className="btn-primary add-to-cart-btn"
                    onClick={(e) => {
                        e.preventDefault();
                        onAddToCart(product);
                    }}
                >
                    Añadir
                </button>
            </div>
            <Link to={`/product/${product.id}`} className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-brand">{product.brand}</p>
                <p className="product-price">${product.price.toFixed(2)}</p>
            </Link>
        </div>
    );
};

export default ProductCard;
