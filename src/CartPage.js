import React, { useState } from "react";
import { useCart } from "./CartContext";
import { Link } from "react-router-dom";
import "./CartPage.css";

const CartPage = () => {
    const { cart, updateCart, removeFromCart } = useCart();

    const totalPrice = cart.reduce(
        (total, item) => total + parseFloat(item.price.replace('$', '').replace(',', '')) * item.quantity,
        0
    ).toFixed(2);

    const handleQuantityChange = (e, itemId) => {
        const newQuantity = parseInt(e.target.value);
        if (newQuantity > 0) {
            updateCart(itemId, newQuantity);
        }
    };

    const handleRemoveItem = (itemId) => {
        removeFromCart(itemId);
    };

    return (
        <div className="cart-page1">
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
                        <Link to="/">Logout</Link>
                    </li>
                </ul>
            </aside>

            <div className="cart-page2">
                <h2>Your Cart</h2>
                {cart.length === 0 ? (
                    <p>Your cart is empty. <Link to="/UserProductList">Go to Products</Link> to add items.</p>
                ) : (
                    <div>
                        <ul className="cart-items-list1">
                            {cart.map((item, index) => (
                                <li key={index} className="cart-item">
                                    <img src={item.image} alt={item.name} className="cart-item-image" />
                                    <div className="cart-item-details">
                                        <h3>{item.name}</h3>
                                        <p>Price: ${item.price}</p>

                                        {/* Quantity input field */}
                                        <div>
                                            <label>Quantity:</label>
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                min="1"
                                                onChange={(e) => handleQuantityChange(e, item.id)}
                                            />
                                        </div>

                                        {/* Remove button */}
                                        <button
                                            className="remove-button"
                                            onClick={() => handleRemoveItem(item.id)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                    <p>Total: ${(parseFloat(item.price.replace('$', '').replace(',', '')) * item.quantity).toFixed(2)}</p>
                                </li>
                            ))}
                        </ul>

                        <div className="cart-total">
                            <h3>Total Price: ${totalPrice}</h3>
                            <Link to={{ pathname: "/AddressPage", state: { product: cart[0] } }}>
                                <button className="checkout-button">Proceed Checkout</button>
                            </Link>

                        </div>
                    </div>
                )}
            </div>
        </div>
    );

};


export default CartPage;
