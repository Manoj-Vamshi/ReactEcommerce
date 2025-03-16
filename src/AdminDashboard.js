import React, { useEffect, useState } from "react";
import { getDatabase, ref, get, remove } from "firebase/database";
import { db } from "./firebase";
import { Link } from "react-router-dom";
import "./AdminDashboard.css";


const AdminDashboard = () => {

    const [userList, setUserList] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const database = getDatabase();
        const usersRef = ref(database, "users");

        try {
            const snapshot = await get(usersRef);

            if (snapshot.exists()) {
                const allUsers = snapshot.val();
                const users = {};

                for (const uid in allUsers) {
                    if (allUsers[uid].role === "User") {
                        users[uid] = allUsers[uid];
                    }
                }

                console.log("Users:", users);
                setUserList(users);
            } else {
                console.log("No users found.");
            }
        } catch (error) {
            console.error("Error fetching Users:", error);
        }
    };

    const deleteUserById = async (userId) => {
        const userRef = ref(db, `users/${userId}`);

        try {
            await remove(userRef);
            await fetchUsers();
            alert("User deleted successfully!");
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    return (
        <div className="admin-view-users-container">
            <aside>
                <ul>
                    <li>
                        <Link to="/adminDashboard">Home</Link>
                    </li>
                </ul>
                <ul>
                    <li>
                        <Link to="/AdminProductList">Products</Link>
                    </li>
                </ul>
                <ul>
                    <li>
                        <Link to="/">Signout</Link>
                    </li>
                </ul>
            </aside>

            <main className="admin-view-users-main">

                <div className="admin-details">
                    <h1> Welcome Admin!</h1>
                </div>
                <div>

                    <h1>Users List</h1>

                    <section className="admin-view-users-section">
                        <table border="1">
                            <thead>
                                <tr>
                                    <th>Full Name</th>
                                    <th>Email</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userList &&
                                    Object.keys(userList).map((key) => (
                                        <tr key={key}>
                                            <td>{userList[key].name}</td>
                                            <td>{userList[key].email}</td>
                                            <td>
                                                <button
                                                    className="delete-user-btn"
                                                    onClick={() => deleteUserById(userList[key]?.uid)}
                                                >
                                                    Delete User
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
