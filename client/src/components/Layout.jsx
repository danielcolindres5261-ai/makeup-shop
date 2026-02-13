import React from 'react';
import Navbar from './Navbar';
import './Layout.css';

const Layout = ({ children, cartCount }) => {
    return (
        <div className="app-layout">
            <Navbar cartCount={cartCount} />
            <main className="main-content">
                {children}
            </main>
            <footer className="footer">
                <p>&copy; {new Date().getFullYear()} Glow & Co. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Layout;
