import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Products.css";
import img1 from "./1.jpg";
import img2 from "./2.jpg";
import img3 from "./3.jpg";
import img4 from "./4.jpg";
import img5 from "./5.jpg";
import img6 from "./6.jpg";
import img7 from "./7.jpg";
import img8 from "./8.jpg";
import img9 from "./9.jpg";

function ProductList() {
    const navigate = useNavigate();

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

    const handleOrderNow = (product) => {
        navigate("/adresspage", { state: { product } });
    };

    return (
        <div className="products-container">
            <header className="products-header">
                <aside>
                    <ul>
                        <li>
                            <Link to="/product">Home</Link>
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
            <div className="products-grid">
                {products.map((product) => (
                    <div className="product-card" key={product.id}>
                        <h3 className="product-name">{product.name}</h3>
                        <img
                            src={product.image}
                            alt={product.name}
                            className="product-image"
                        />
                        <p className="product-price">{product.price}</p>
                        <button
                            className="order-button"
                            onClick={() => handleOrderNow(product)}
                        >
                            Order Now
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProductList;
