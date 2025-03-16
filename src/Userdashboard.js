import React, { useState, useEffect } from "react";
import { getDatabase, ref, get } from "firebase/database";
import { auth } from "./firebase";
import { Link } from "react-router-dom";

const UserDashboard = () => {
    const [name, setName] = useState("");

    useEffect(() => {
        const fetchUserData = async () => {
            const user = auth.currentUser;
            if (user) {
                const db = getDatabase();
                const userRef = ref(db, `users/${user.uid}`); // Fetch user by UID

                try {
                    const snapshot = await get(userRef);
                    if (snapshot.exists()) {
                        setName(snapshot.val().name); // Set the name from Firebase
                    } else {
                        console.log("No user data found");
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            }
        };

        fetchUserData();
    }, []);

    return (
        <div className="user-dashboard">

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
            <main className="user-dashboard-main">
                <header>
                    <h1>User Dashboard</h1>
                </header>
                <div className="user-details">
                    {name ? `Welcome, ${name}` : "Loading..."}


                </div>

            </main>

        </div>

    );
};

export default UserDashboard;