import React, { useState } from "react";
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

function AdminProductList() {
    const navigate = useNavigate();

    const [products, setProducts] = useState([
        { id: 1, name: "Nike", price: "$22", image: img1 },
        { id: 2, name: "Adidas", price: "$33", image: img2 },
        { id: 3, name: "Sketchers", price: "$23", image: img3 },
        { id: 4, name: "Tshirts", price: "$34", image: img4 },
        { id: 5, name: "Iphone", price: "$23", image: img5 },
        { id: 6, name: "Samsung", price: "$44", image: img6 },
        { id: 7, name: "Airpods", price: "$22", image: img7 },
        { id: 8, name: "Headphones", price: "$44", image: img8 },
        { id: 9, name: "Watches", price: "$22", image: img9 },
    ]);

    const [newProduct, setNewProduct] = useState({
        name: "",
        price: "",
        image: null,
    });

    const [editingProductId, setEditingProductId] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [filterQuery, setFilterQuery] = useState("");

    const handleChange = (e) => {
        setNewProduct({
            ...newProduct,
            [e.target.name]: e.target.value,
        });
    };

    // Handle image file upload
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewProduct({
                    ...newProduct,
                    image: reader.result,
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddOrUpdateProduct = () => {
        if (!newProduct.name || !newProduct.price || !newProduct.image) {
            alert("Please fill in all fields and upload an image.");
            return;
        }

        if (editingProductId === null) {
            // Adding a new product
            const newProductData = {
                id: products.length + 1,
                name: newProduct.name,
                price: newProduct.price,
                image: newProduct.image,
            };
            setProducts([...products, newProductData]);
        } else {
            // Editing an existing product
            const updatedProducts = products.map((product) =>
                product.id === editingProductId
                    ? { ...product, ...newProduct }
                    : product
            );
            setProducts(updatedProducts);
        }

        // Reset form after adding or updating
        setNewProduct({ name: "", price: "", image: null });
        setEditingProductId(null);
        setShowAddForm(false);
    };

    const handleEditProduct = (product) => {
        setEditingProductId(product.id);
        setNewProduct({
            name: product.name,
            price: product.price,
            image: product.image,
        });
        setShowAddForm(true);
    };

    const handleDeleteProduct = (productId) => {
        const updatedProducts = products.filter((product) => product.id !== productId);
        setProducts(updatedProducts);
    };

    const handleShowAddForm = () => {
        setShowAddForm(true);
    };

    const handleCancelAddProduct = () => {
        setNewProduct({ name: "", price: "", image: null });
        setShowAddForm(false);
        setEditingProductId(null);
    };

    const handleFilterChange = (e) => {
        setFilterQuery(e.target.value);
    };

    // Filter products based on the filter query
    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(filterQuery.toLowerCase())
    );

    return (
        <div className="products-container">
            <header className="products-header">
                <aside>
                    <ul>
                        <li>
                            <Link to="/admindashboard">Home</Link>
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

            {/* Show the "Add Product" form only when showAddForm is true */}
            {showAddForm && (
                <div className="add-product-form">
                    <h2>{editingProductId ? "Edit Product" : "Add New Product"}</h2>
                    <input
                        type="text"
                        name="name"
                        placeholder="Product Name"
                        value={newProduct.name}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="price"
                        placeholder="Price"
                        value={newProduct.price}
                        onChange={handleChange}
                    />
                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    {newProduct.image && (
                        <img
                            src={newProduct.image}
                            alt="Product Preview"
                            className="image-preview"
                        />
                    )}
                    <button onClick={handleAddOrUpdateProduct}>
                        {editingProductId ? "Update Product" : "Add Product"}
                    </button>
                    <button onClick={handleCancelAddProduct} className="cancel-button">
                        Cancel
                    </button>
                </div>
            )}

            {!showAddForm && (
                <button className="add-button" onClick={handleShowAddForm}>Add Product</button>
            )}

            <div className="products-grid">
                {filteredProducts.map((product) => (
                    <div className="product-card" key={product.id}>
                        <h3 className="product-name">{product.name}</h3>
                        <img
                            src={product.image}
                            alt={product.name}
                            className="product-image"
                        />
                        <p className="product-price">{product.price}</p>
                        <div className="product-actions">
                            <button
                                className="edit-button"
                                onClick={() => handleEditProduct(product)}
                            >
                                Edit
                            </button>
                            <button
                                className="delete-button"
                                onClick={() => handleDeleteProduct(product.id)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AdminProductList;
