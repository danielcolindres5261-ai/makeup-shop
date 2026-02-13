import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import './Home.css';

const Home = ({ addToCart }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const category = searchParams.get('category');
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=1600&auto=format&fit=crop",
            title: "Realza tu Belleza Única",
            text: "El maquillaje es arte, la belleza es espíritu."
        },
        {
            image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1600&auto=format&fit=crop",
            title: "Tu Mirada, Tu Poder",
            text: "Colores que expresan lo que las palabras no pueden."
        },
        {
            image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=1600&auto=format&fit=crop",
            title: "Brilla con Luz Propia",
            text: "Porque la confianza es el mejor maquillaje."
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        setLoading(true);
        fetch('http://localhost:3001/api/products')
            .then(res => res.json())
            .then(data => {
                if (category) {
                    setProducts(data.filter(p => p.category === category));
                } else {
                    setProducts(data);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching products:', err);
                setLoading(false);
            });
    }, [category]);

    return (
        <div className="home-container">
            <section
                className="hero-section"
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)), url('${slides[currentSlide].image}')`
                }}
            >
                <div className="hero-content fade-in" key={currentSlide}>
                    <h1>{slides[currentSlide].title}</h1>
                    <p>{slides[currentSlide].text}</p>
                    <button className="btn-primary" onClick={() => document.getElementById('shop').scrollIntoView({ behavior: 'smooth' })}>
                        Comprar Ahora
                    </button>

                    <div className="carousel-dots">
                        {slides.map((_, index) => (
                            <span
                                key={index}
                                className={`dot ${index === currentSlide ? 'active' : ''}`}
                                onClick={() => setCurrentSlide(index)}
                            ></span>
                        ))}
                    </div>
                </div>
            </section>

            <section id="shop" className="products-section">
                <h2 className="section-title">Nuestros Favoritos</h2>
                {loading ? (
                    <p className="loading-text">Cargando productos...</p>
                ) : (
                    <div className="products-grid">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;
