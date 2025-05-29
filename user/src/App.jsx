import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import Login from './Pages/Login'
import Register from './Pages/Register'
// import NutritionistList from './Pages/NutritionistList'
import Context from './Context/Context'
import ProtectedRoute from './components/ProtectedRoute'
import ProductList from './Pages/ProductList'
import ProductView from './Pages/ProductView'
// import AboutUs from './Pages/About'
// import NutritionistProfile from './Pages/NutritionistProfile'
// import RequestHistory from './Pages/RequestHistory'
// import ApplyMealPlan from './Pages/ApplyMealPlan'
// import UserRequests from './Pages/UserRequests'
import Cart from './Pages/Cart';
import Checkout from './Pages/Checkout'
import Orders from './Pages/Orders'
import About from './Pages/About'


function App() {
  return (
    <Router>
      <Context>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* <Route path="/about" element={<AboutUs />} /> */}

          {/* Protected Routes */}
          <Route path="/products" element={
            <ProtectedRoute>
              <ProductList/>
            </ProtectedRoute>
          } />
          <Route path="/product/:id" element={
            <ProtectedRoute>
              <ProductView/>
            </ProtectedRoute>
          } />
          <Route path="/checkout" element={
            <ProtectedRoute>
              <Checkout/>
            </ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute>
              <Orders/>
            </ProtectedRoute>
          } />
          {/* Add other protected routes here */}
          <Route path="/about" element={
            <ProtectedRoute>
              <About/>
            </ProtectedRoute>
          } />
          <Route path="/meal-plans" element={
            <ProtectedRoute>
              {/* <UserRequests /> */}
            </ProtectedRoute>
          } />
          <Route path="/cart" element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          } />
          {/* Add other protected routes here */}
        </Routes>
      </Context>
    </Router>
  );
}

export default App;
