import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from "firebase/database";
import { auth } from './firebase';
import { Link } from 'react-router-dom';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    const ordersRef = ref(db, 'orders');

    console.log("Orders",ordersRef);

    onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      const userOrders = [];


      for (let id in data) {
        if (data[id].userId === auth.currentUser?.uid) {
          userOrders.push(data[id]);
        }
      }
console.log("Orders",userOrders);
      setOrders(userOrders);
    });
  }, []);

  return (
    <div>

      <h1>Your Orders</h1>
      <div>
        {orders.length === 0 ? (
          <p>No orders found</p>
        ) : (
          orders.map((order, index) => (
            <div key={index} className="order">
              <h2>{order.productName}</h2>
              <img src={order.productImage} alt={order.productName} />
              <p>Price: {order.productPrice}</p>
              <p>Shipping Address: {order.shippingAddress}</p>
              <p>Date: {new Date(order.date).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
