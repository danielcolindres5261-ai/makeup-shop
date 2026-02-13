import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, User, Menu, X, House, Sparkles, Eye, Heart } from 'lucide-react';
import './Navbar.css';

const Navbar = ({ cartCount }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    Glow & Co.
                </Link>

                <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
                    <Link to="/" className="nav-item" onClick={() => setIsMenuOpen(false)}>
                        <House size={20} />
                        <span>Inicio</span>
                    </Link>
                    <Link to="/?category=rostro" className="nav-item" onClick={() => setIsMenuOpen(false)}>
                        <Sparkles size={20} />
                        <span>Rostro</span>
                    </Link>
                    <Link to="/?category=ojos" className="nav-item" onClick={() => setIsMenuOpen(false)}>
                        <Eye size={20} />
                        <span>Ojos</span>
                    </Link>
                    <Link to="/?category=labios" className="nav-item" onClick={() => setIsMenuOpen(false)}>
                        <Heart size={20} />
                        <span>Labios</span>
                    </Link>
                    <Link to="/cart" className="nav-item" onClick={() => setIsMenuOpen(false)}>
                        <ShoppingBag size={20} />
                        <span>Carrito</span>
                        {cartCount > 0 && <span className="cart-badge-mobile">{cartCount}</span>}
                    </Link>
                    <Link to="/login" className="nav-item admin-link" onClick={() => setIsMenuOpen(false)}>
                        <User size={20} />
                        <span>Admin</span>
                    </Link>
                </div>

                <div className="navbar-icons mobile-only">
                    <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
