import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Edit, Plus, LogOut } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/login');
            return;
        }
        fetchProducts();
    }, [navigate]);

    const fetchProducts = () => {
        fetch('/api/products')
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => console.error('Error:', err));
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/login');
    };

    const handleDelete = (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            fetch(`/api/products/${id}`, { method: 'DELETE' })
                .then(res => res.json())
                .then(data => {
                    if (data.success) fetchProducts();
                });
        }
    };

    const openModal = (product = null) => {
        setCurrentProduct(product);
        setIsModalOpen(true);
    };

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1>Gestión de Productos</h1>
                <button className="btn-secondary" onClick={handleLogout}>
                    <LogOut size={18} /> Cerrar Sesión
                </button>
            </div>

            <div className="admin-actions">
                <button className="btn-primary" onClick={() => openModal()}>
                    <Plus size={18} /> Nuevo Producto
                </button>
            </div>

            <div className="products-table-container">
                <table className="products-table">
                    <thead>
                        <tr>
                            <th>Imagen</th>
                            <th>Nombre</th>
                            <th>Marca</th>
                            <th>Precio</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id}>
                                <td>
                                    <img src={product.imageUrl} alt={product.name} className="table-img" />
                                </td>
                                <td>{product.name}</td>
                                <td>{product.brand}</td>
                                <td>Q{Number(product.price).toFixed(2)}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="icon-btn edit" onClick={() => openModal(product)}>
                                            <Edit size={18} />
                                        </button>
                                        <button className="icon-btn delete" onClick={() => handleDelete(product.id)}>
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <ProductModal
                    product={currentProduct}
                    onClose={() => setIsModalOpen(false)}
                    onSave={() => {
                        setIsModalOpen(false);
                        fetchProducts();
                    }}
                />
            )}
        </div>
    );
};

const ProductModal = ({ product, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        price: '',
        description: '',
        imageUrl: ''
    });

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                brand: product.brand,
                price: product.price,
                description: product.description,
                imageUrl: product.imageUrl
            });
        }
    }, [product]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const method = product ? 'PUT' : 'POST';
        const url = product
            ? `/api/products/${product.id}`
            : '/api/products';

        fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) onSave();
            });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{product ? 'Editar Producto' : 'Nuevo Producto'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nombre</label>
                        <input name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Marca</label>
                        <input name="brand" value={formData.brand} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Precio</label>
                        <input name="price" type="number" value={formData.price} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>URL Imagen</label>
                        <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Descripción</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} required />
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
                        <button type="submit" className="btn-primary">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminDashboard;
