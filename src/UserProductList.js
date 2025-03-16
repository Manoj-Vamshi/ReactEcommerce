import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "./CartContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from './firebase';
import "./UserProducts.css";

function UserProductList() {
    const [filterQuery, setFilterQuery] = useState("");
    const [quantity, setQuantity] = useState({});
    const [products, setProducts] = useState([]);
    const { addToCart } = useCart();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

    // Fetching products from Firestore
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log("Fetching products from Firestore...");

            // Fetch products from Firestore
            const querySnapshot = await getDocs(collection(db, "products"));

            console.log("Query response received", querySnapshot);

            if (!querySnapshot.empty) {
                // Extract product data directly from Firestore documents
                // The image field contains the Base64 data directly
                const productsArray = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                console.log("Products loaded:", productsArray.length);
                setProducts(productsArray);
            } else {
                console.log("No products found in collection");
                setProducts([]);
            }
        } catch (e) {
            console.error("Error fetching products:", e);
            setError("Error fetching products: " + e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = (product) => {
        const productQuantity = quantity[product.id] ?? 1; 

        console.log("Adding to cart:", {
            ...product,
            quantity: productQuantity
        });

        addToCart({ ...product, quantity: productQuantity });

        setSuccessMessage(`${product.name} added to cart successfully!`);

        setTimeout(() => {
            setSuccessMessage("");
        }, 3000);
    };

    const handleQuantityChange = (e, productId) => {
        const value = parseInt(e.target.value, 10) || 1;

        if (value < 1) return;

        setQuantity((prevQuantity) => ({
            ...prevQuantity,
            [productId]: value,
        }));
    };

    const handleFilterChange = (e) => {
        setFilterQuery(e.target.value);
    };

    const filteredProducts = products.filter((product) =>
        product.name && product.name.toLowerCase().includes(filterQuery.toLowerCase())
    );

    if (loading) {
        return <div>Loading products...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="user-products-container">
            <header className="user-products-header">
                <aside>
                    <ul>
                        <li>
                            <Link to="/UserDashboard">Home</Link>
                        </li>
                    </ul>
                    <ul>
                        <li>
                            <Link to="/UserProductList">Products</Link>
                        </li>
                    </ul>
                    <ul>
                        <li>
                            <Link to="/CartPage">Cart</Link>
                        </li>
                    </ul>
                    <ul>
                        <li> <Link to="/orders">Orders</Link></li>
                    </ul>
                    <ul>
                        <li>
                            <Link to="/">Logout</Link>
                        </li>
                    </ul>
                </aside>
            </header>

            <h1>Welcome to the Store</h1>

            <div className="filter-container">
                <input
                    type="text"
                    placeholder="Filter products by name..."
                    value={filterQuery}
                    onChange={handleFilterChange}
                    className="filter-input"
                />
            </div>

            {successMessage && <div className="success-message">{successMessage}</div>}

            {filteredProducts.length > 0 ? (
                <div className="user-products-grid">
                    {filteredProducts.map((product) => (
                        <div className="user-product-card" key={product.id}>
                            <h3 className="product-name">{product.name}</h3>
                            {product.image && (
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="product-image1"
                                    onError={(e) => {
                                        console.error("Image failed to load");
                                        e.target.src = "https://via.placeholder.com/150?text=Image+Error";
                                    }}
                                />
                            )}
                            <p className="product-price">${product.price}</p>
                            <div className="product-quantity">
                                <input
                                    type="number"
                                    value={quantity[product.id] || 1}
                                    onChange={(e) => handleQuantityChange(e, product.id)}
                                    min="1"
                                    className="quantity-input"
                                />
                            </div>
                            <button
                                className="buy-button"
                                onClick={() => handleAddToCart(product)}
                            >
                                Add to Cart
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No products found</p>
            )}
        </div>
    );
}

export default UserProductList;