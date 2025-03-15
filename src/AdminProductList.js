import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Products.css";
import { collection, addDoc, getDocs, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from './firebase';

function AdminProductList() {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({
        name: "",
        price: "",
        image: null,
    });
    const [editingProductId, setEditingProductId] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [filterQuery, setFilterQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log("Fetching products from Firestore...");

            const querySnapshot = await getDocs(collection(db, "products"));

            console.log("Query response received", querySnapshot);

            if (!querySnapshot.empty) {
                const productsArray = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                console.log("Products loaded:", productsArray.length);
                setProducts(productsArray);
            } else {
                console.log("No products found in collection");
                setProducts([]);
            }
        } catch (e) {
            console.error("Error fetching products:", e);
            setError("Error fetching products: " + e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setNewProduct({
            ...newProduct,
            [e.target.name]: e.target.value,
        });
    };

    // Handle image file selection and convert to Base64
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        console.log("File selected:", file.name);
        setIsUploading(true);

        // Convert image to Base64
        const reader = new FileReader();
        reader.onload = (event) => {
            const base64Image = event.target.result;
            console.log("Image converted to Base64");

            setNewProduct(prev => ({
                ...prev,
                image: base64Image
            }));

            setIsUploading(false);
        };

        reader.onerror = (error) => {
            console.error("Error reading file:", error);
            alert("Error processing image. Please try again.");
            setIsUploading(false);
        };

        reader.readAsDataURL(file);
    };

    // Add or Update product
    const handleAddOrUpdateProduct = async () => {
        console.log("Current product state:", newProduct);

        if (!newProduct.name || !newProduct.price) {
            alert("Please fill in name and price fields.");
            return;
        }

        if (!newProduct.image) {
            alert("Please upload a product image.");
            return;
        }

        try {
            console.log("Saving product data to Firestore");
            const productData = {
                name: newProduct.name,
                price: newProduct.price,
                image: newProduct.image,
                createdAt: new Date().toISOString()
            };

            if (editingProductId === null) {
                // Add new product
                const docRef = await addDoc(collection(db, "products"), productData);
                console.log("Product added with ID:", docRef.id);

                alert("Product added successfully!");
            } else {
                // Update existing product
                const productRef = doc(db, "products", editingProductId);
                await updateDoc(productRef, productData);
                console.log("Product updated successfully");

                alert("Product updated successfully!");
            }

            // Reset form
            setNewProduct({ name: "", price: "", image: null });
            setEditingProductId(null);
            setShowAddForm(false);

            // Refresh products list
            await fetchProducts();

        } catch (e) {
            console.error("Error saving product:", e);
            alert("Error saving product: " + e.message);
        }
    };

    // Edit Product
    const handleEditProduct = (product) => {
        setEditingProductId(product.id);
        setNewProduct({
            name: product.name,
            price: product.price,
            image: product.image,
        });
        setShowAddForm(true);
    };

    // Delete Product
    const handleDeleteProduct = async (productId) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                const productRef = doc(db, "products", productId);
                await deleteDoc(productRef);
                console.log("Product deleted");

                // Update local state
                setProducts(products.filter(p => p.id !== productId));
                alert("Product deleted successfully!");
            } catch (e) {
                console.error("Error deleting product:", e);
                alert("Error deleting product: " + e.message);
            }
        }
    };

    // Show Add Product Form
    const handleShowAddForm = () => {
        setShowAddForm(true);
    };

    // Cancel Add Product
    const handleCancelAddProduct = () => {
        setNewProduct({ name: "", price: "", image: null });
        setShowAddForm(false);
        setEditingProductId(null);
    };

    // Handle Filter Change
    const handleFilterChange = (e) => {
        setFilterQuery(e.target.value);
    };

    const filteredProducts = products.filter((product) =>
        product.name && product.name.toLowerCase().includes(filterQuery.toLowerCase())
    );

    // Loading and error handling
    if (loading) {
        return <div>Loading products...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="products-container">
            <header className="products-header">
                <aside>
                    <ul>
                        <li><Link to="/adminDashboard">Home</Link></li>
                    </ul>
                    <ul>
                        <li><Link to="/AdminProductList">Products</Link></li>
                    </ul>
                    <ul>
                        <li><Link to="/">Signout</Link></li>
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

                    {isUploading && <p>Processing image...</p>}

                    {newProduct.image && (
                        <div>
                            <p>Image ready to upload!</p>
                            <img
                                src={newProduct.image}
                                alt="Product Preview"
                                className="image-preview"
                                style={{ maxWidth: "200px", marginTop: "10px" }}
                            />
                        </div>
                    )}

                    <button
                        onClick={handleAddOrUpdateProduct}
                        disabled={isUploading}
                    >
                        {editingProductId ? "Update Product" : "Add Product"}
                    </button>
                    <button
                        onClick={handleCancelAddProduct}
                        className="cancel-button"
                        disabled={isUploading}
                    >
                        Cancel
                    </button>
                </div>
            )}

            {!showAddForm && (
                <button className="add-button" onClick={handleShowAddForm}>Add Product</button>
            )}

            <div className="products-grid">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <div className="product-card" key={product.id}>
                            <h3 className="product-name">{product.name}</h3>
                            {product.image && (
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="product-image"
                                    onError={(e) => {
                                        console.error("Image failed to load");
                                        e.target.src = "https://via.placeholder.com/150?text=Image+Error";
                                    }}
                                />
                            )}
                            <p className="product-price">${product.price}</p>
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
                    ))
                ) : (
                    <p>No products found. Click "Add Product" to create a new product.</p>
                )}
            </div>
        </div>
    );
}

export default AdminProductList;