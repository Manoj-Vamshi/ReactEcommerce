import React from "react";
import { useCart } from "./CartContext";
import { Link, useNavigate } from "react-router-dom";
import "./CartPage.css";

const CartPage = () => {
    const { cart, updateCart, removeFromCart } = useCart();
    const navigate = useNavigate();

    const totalPrice = cart.reduce(
        (total, item) => total + parseFloat(item.price.replace('$', '').replace(',', '')) * item.quantity,
        0
    ).toFixed(2);

    const handleProceedCheckout = () => {
        if (cart.length > 0) {
            localStorage.setItem("cart", JSON.stringify(cart));
            navigate("/AddressPage");
        }
    };


    return (
        <div className="cart-page1">
            <aside>
                <ul>
                    <li><Link to="/UserDashboard">Home</Link></li>
                </ul>
                <ul>
                    <li><Link to="/UserProductList">Products</Link></li>
                </ul>
                <ul>
                    <li><Link to="/CartPage">Cart</Link></li>
                </ul>
                <ul>
                    <li><Link to="/">Logout</Link></li>
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
                                        <div>
                                            <label>Quantity:</label>
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                min="1"
                                                onChange={(e) => updateCart(item.id, parseInt(e.target.value))}
                                            />
                                        </div>
                                        <button
                                            className="remove-button"
                                            onClick={() => removeFromCart(item.id)}
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
                            <button className="checkout-button" onClick={handleProceedCheckout}>
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;
