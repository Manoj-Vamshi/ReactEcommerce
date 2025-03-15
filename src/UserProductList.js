import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "./CartContext";

import "./UserProducts.css";
import img1 from "./1.jpg";
import img2 from "./2.jpg";
import img3 from "./3.jpg";
import img4 from "./4.jpg";
import img5 from "./5.jpg";
import img6 from "./6.jpg";
import img7 from "./7.jpg";
import img8 from "./8.jpg";
import img9 from "./9.jpg";

function UserProductList() {
    const [filterQuery, setFilterQuery] = useState("");
    const [quantity, setQuantity] = useState({}); // Track quantities for products
    const { addToCart } = useCart();

    const products = [
        { id: 1, name: "Nike", price: "$22", image: img1 },
        { id: 2, name: "Adidas", price: "$33", image: img2 },
        { id: 3, name: "Sketchers", price: "$23", image: img3 },
        { id: 4, name: "Tshirts", price: "$34", image: img4 },
        { id: 5, name: "Iphone", price: "$23", image: img5 },
        { id: 6, name: "Samsung", price: "$44", image: img6 },
        { id: 7, name: "Airpods", price: "$22", image: img7 },
        { id: 8, name: "Headphones", price: "$44", image: img8 },
        { id: 9, name: "Watches", price: "$22", image: img9 },
    ];

    const handleFilterChange = (e) => {
        setFilterQuery(e.target.value);
    };

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(filterQuery.toLowerCase())
    );

    const handleQuantityChange = (e, productId) => {
        const newQuantity = e.target.value;
        setQuantity((prev) => ({ ...prev, [productId]: newQuantity }));
    };

    const handleAddToCart = (product) => {
        const productQuantity = quantity[product.id] || 1;
        addToCart(product, parseInt(productQuantity));
    };

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
                        <li>
                            <Link to="/">Signout</Link>
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

            <div className="user-products-grid">
                {filteredProducts.map((product) => (
                    <div className="user-product-card" key={product.id}>
                        <h3 className="product-name">{product.name}</h3>
                        <img
                            src={product.image}
                            alt={product.name}
                            className="product-image"
                        />
                        <p className="product-price">{product.price}</p>
                        <input
                            type="number"
                            value={quantity[product.id] || 1}
                            onChange={(e) => handleQuantityChange(e, product.id)}
                            min="1"
                            className="quantity-input"
                        />
                        <button
                            className="buy-button"
                            onClick={() => {
                                handleAddToCart(product);
                                alert("Product added to cart");
                            }}
                        >
                            Add to Cart
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UserProductList;
