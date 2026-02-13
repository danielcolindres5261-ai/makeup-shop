const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;
const PRODUCTS_FILE = path.join(__dirname, 'products.json');

app.use(cors());
app.use(bodyParser.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/dist')));

// Helper to read products
const readProducts = () => {
    if (!fs.existsSync(PRODUCTS_FILE)) {
        return [];
    }
    const data = fs.readFileSync(PRODUCTS_FILE);
    return JSON.parse(data);
};

// Helper to write products
const writeProducts = (products) => {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
};

// GET all products
app.get('/api/products', (req, res) => {
    const products = readProducts();
    res.json(products);
});

// GET single product
app.get('/api/products/:id', (req, res) => {
    const products = readProducts();
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Producto no encontrado' });
    }
});

// ADMIN LOGIN (Hardcoded for demo)
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    // Replace with real auth in production
    if (email === 'admin@glow.co' && password === 'admin123') {
        res.json({ success: true, token: 'fake-jwt-token' });
    } else {
        res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
    }
});

// ADD Product (Admin)
app.post('/api/products', (req, res) => {
    const { name, brand, price, description, imageUrl } = req.body;
    const products = readProducts();
    const newProduct = {
        id: Date.now(),
        name,
        brand,
        price: parseFloat(price),
        description,
        imageUrl
    };
    products.push(newProduct);
    writeProducts(products);
    res.json({ success: true, product: newProduct });
});

// UPDATE Product (Admin)
app.put('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    let products = readProducts();
    const index = products.findIndex(p => p.id === parseInt(id));

    if (index !== -1) {
        // Ensure price is a number if it is being updated
        if (updates.price) {
            updates.price = parseFloat(updates.price);
        }
        products[index] = { ...products[index], ...updates };
        writeProducts(products);
        res.json({ success: true, product: products[index] });
    } else {
        res.status(404).json({ success: false, message: 'Producto no encontrado' });
    }
});

// DELETE Product (Admin)
app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;
    let products = readProducts();
    const initialLength = products.length;
    products = products.filter(p => p.id !== parseInt(id));

    if (products.length < initialLength) {
        writeProducts(products);
        res.json({ success: true });
    } else {
        res.status(404).json({ success: false, message: 'Producto no encontrado' });
    }
});

// ORDER
app.post('/api/order', (req, res) => {
    const { customer, cart, total } = req.body;

    console.log('--- NUEVO PEDIDO RECIBIDO ---');
    console.log('Cliente:', customer);
    console.log('Total:', total);
    console.log('Productos:', cart.map(i => `${i.name} (x${i.quantity})`).join(', '));
    console.log('-----------------------------');

    // Here you would implement actual email sending (e.g., using nodemailer)

    res.json({ success: true, message: 'Pedido recibido correctamente' });
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
// The "catchall" handler: user app.use for Express 5 compatibility
app.use((req, res, next) => {
    if (req.method === 'GET') {
        res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    } else {
        next();
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
