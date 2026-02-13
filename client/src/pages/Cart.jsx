import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import './Cart.css';

const Cart = ({ cart, setCart }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        address: ''
    });
    const [orderPlaced, setOrderPlaced] = useState(false);

    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const handleQuantityChange = (id, change) => {
        setCart(prevCart => prevCart.map(item => {
            if (item.id === id) {
                const newQty = item.quantity + change;
                return newQty > 0 ? { ...item, quantity: newQty } : item;
            }
            return item;
        }));
    };

    const handleRemove = (id) => {
        setCart(prevCart => prevCart.filter(item => item.id !== id));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (cart.length === 0) return;

        fetch('/api/order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                customer: formData,
                cart,
                total
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setOrderPlaced(true);
                    setCart([]); // Clear cart
                }
            })
            .catch(err => console.error('Error placing order:', err));
    };

    if (orderPlaced) {
        return (
            <div className="cart-page empty-cart">
                <div className="success-message">
                    <h2>¡Gracias por tu pedido!</h2>
                    <p>Hemos recibido tu orden. Te enviaremos los detalles a tu correo electrónico.</p>
                    <button className="btn-primary" onClick={() => window.location.href = '/'}>Seguir Comprando</button>
                </div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="cart-page empty-cart">
                <h2>Tu carrito está vacío</h2>
                <p>¡Explora nuestra colección y añade tus productos favoritos!</p>
                <button className="btn-primary" onClick={() => window.location.href = '/'}>Ir a la Tienda</button>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <h1>Tu Carrito</h1>

            <div className="cart-grid">
                <div className="cart-items">
                    {cart.map(item => (
                        <div key={item.id} className="cart-item">
                            <img src={item.imageUrl} alt={item.name} className="cart-item-image" />
                            <div className="cart-item-info">
                                <h3>{item.name}</h3>
                                <p className="cart-item-price">Q{item.price.toFixed(2)}</p>
                            </div>
                            <div className="cart-item-actions">
                                <div className="quantity-controls">
                                    <button onClick={() => handleQuantityChange(item.id, -1)}>-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => handleQuantityChange(item.id, 1)}>+</button>
                                </div>
                                <button className="remove-btn" onClick={() => handleRemove(item.id)}>
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                    <div className="cart-total">
                        <h3>Total: Q{total.toFixed(2)}</h3>
                    </div>
                </div>

                <div className="checkout-section">
                    <h2>Finalizar Compra</h2>
                    <form className="checkout-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Nombre Completo</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                placeholder="Tu nombre"
                            />
                        </div>
                        <div className="form-group">
                            <label>Teléfono</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                required
                                placeholder="55 1234 5678"
                            />
                        </div>
                        <div className="form-group">
                            <label>Correo Electrónico</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                placeholder="ejemplo@correo.com"
                            />
                        </div>
                        <div className="form-group">
                            <label>Dirección (Opcional)</label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder="Calle, Número, Colonia..."
                            />
                        </div>
                        <button type="submit" className="btn-primary checkout-btn">
                            Confirmar Pedido
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Cart;
