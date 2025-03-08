import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Loginpage";
import Register from "./Register";
import AdminDashboard from "./AdminDashboard";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <BrowserRouter>
          <div className="app-container">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/AdminDashboard" element={<AdminDashboard />} />
            </Routes>
          </div>
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
