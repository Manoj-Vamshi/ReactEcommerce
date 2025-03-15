import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { Link } from "react-router-dom";


const UserDashboard = () => {
    const [name, setName] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            navigate("/");
        } else {
            setName(user.displayName || user.email || "User");
        }
    }, [navigate]);

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
