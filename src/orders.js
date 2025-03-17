import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from "firebase/database";
import { auth } from './firebase';
import { Link } from 'react-router-dom';
import "./orders.css";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    const ordersRef = ref(db, 'orders');

    onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      const userOrders = [];

      for (let id in data) {
        if (data[id].userId === auth.currentUser?.uid) {
          userOrders.push(data[id]);
        }
      }
      setOrders(userOrders);
    });
  }, []);

  return (
    <div className="orders-container">
      <aside>
        <ul>
          <li><Link to="/UserDashboard">Home</Link></li>
          <li><Link to="/UserProductList">Products</Link></li>
          <li><Link to="/CartPage">Cart</Link></li>
          <li><Link to="/orders">Orders</Link></li>
          <li><Link to="/">Logout</Link></li>
        </ul>
      </aside>

      <div className="orders-content">
        <h1>Your Orders</h1>
        <div className="orders-grid">
          {orders.length === 0 ? (
            <p>No orders found</p>
          ) : (
            orders.map((order, index) => (
              <div key={index} className="order">
                <h2>{order.productName}</h2>
                <img src={order.productImage} alt={order.productName} />
                <p><strong>Price:</strong> {order.productPrice}</p>
                <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>
                <p><strong>Date:</strong> {new Date(order.date).toLocaleString()}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
