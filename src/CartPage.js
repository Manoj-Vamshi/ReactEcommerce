import React, { useState } from "react";
import { useCart } from "./CartContext";
import { Link } from "react-router-dom";

const CartPage = () => {
    const { cart, updateCart, removeFromCart } = useCart();

    // Calculate total price of the cart items
    const totalPrice = cart.reduce(
        (total, item) => total + parseFloat(item.price.replace('$', '').replace(',', '')) * item.quantity,
        0
    ).toFixed(2); // Format the total price to two decimal places

    const handleQuantityChange = (e, itemId) => {
        const newQuantity = parseInt(e.target.value);
        if (newQuantity > 0) {
            updateCart(itemId, newQuantity); // Update quantity in cart
        }
    };

    const handleRemoveItem = (itemId) => {
        removeFromCart(itemId); // Remove item from cart
    };

    return (
        <div className="user-dashboard">
            <aside>
                <ul>
                    <li>
                        <Link to="/userdashboard">Home</Link>
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
            <main>

                <div className="cart-page">
                    <h2>Your Cart</h2>
                    {cart.length === 0 ? (
                        <p>Your cart is empty. <Link to="/UserProductList">Go to Products</Link> to add items.</p>
                    ) : (
                        <div>
                            <ul className="cart-items-list">
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
                                <Link to="/StripeCheckoutForm">
                                    <button className="checkout-button">Proceed to Checkout</button>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

            </main>
        </div>
    );

};


export default CartPage;
