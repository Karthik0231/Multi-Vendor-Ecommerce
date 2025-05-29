import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { config } from "../Config/Config";
import { useNavigate } from "react-router-dom";

export const userContext = createContext();

export default function UserContextProvider(props) {
    const { host } = config;
    const [user, setUser] = useState({});
    const [state, setState] = useState(false);
    const [nutritionists, setNutritionists] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState(null);
    const [userId, setUserId] = useState(null);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [cart, setCart] = useState([]);
    const [orders, setOrders] = useState([]);

    const navigate = useNavigate();

    // Check if user is logged in on component mount
    useEffect(() => {
        const token = localStorage.getItem("userToken");
        if (token) {
            // You could add token verification here if needed
            setUser({ token });
        }
    }, [state]);

    const LoginUser = (data) => {
        axios.post(`${host}/customer/login`, data)
            .then((res) => {
                if (res.data.success) {
                    localStorage.setItem("userToken", res.data.token);
                    setState(!state);
                    setUser(res.data.user);
                    Swal.fire("Success", "You will be redirected to the Home", "success");
                    setTimeout(() => {
                        navigate("/");
                    }, 1000);
                } else {
                    Swal.fire("Error", res.data.message, "error");
                }
            })
            .catch((err) => {
                Swal.fire("Error Login Failed", err.response?.data?.message || "Check Your Login Details", "error");
            });
    };

    const RegisterUser = (data) => {
        axios.post(`${host}/customer/Register`, data)
        .then((res) => {
            if (res.data.success) {
                Swal.fire({
                    title: "Success!",
                    text: "Registration successful! Please login.",
                    icon: "success"
                });
                navigate("/login");
            } else {
                Swal.fire({
                    title: "Error!",
                    text: res.data.message,
                    icon: "error"
                });
            }
        })
        .catch((err) => {
            Swal.fire({
                title: "Error!",
                text: err.response?.data?.message || "Registration failed",
                icon: "error"
            });
        });
    };

    const LogoutUser = () => {
        localStorage.removeItem("userToken");
        setUser({});
        setState(!state);
        Swal.fire("Success", "You will be redirected to the Home", "success");
        setTimeout(() => {
            navigate("/home");
        }, 1000);
    }

    const getAllProducts = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${host}/customer/products`);
            if (response.data.success) {
                setProducts(response.data.products);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            setError("Failed to fetch products");
        } finally {
            setLoading(false);
        }
    };

    const getProductById = async (id) => {
        try {
            setLoading(true);
            const response = await axios.get(`${host}/customer/products/${id}`);
            return response.data.product;
        } catch (error) {
            console.error("Error fetching product:", error);
            setError("Failed to fetch product details");
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Add new cart functions
    const addToCart = async (productId, quantity) => {
        try {
            const token = localStorage.getItem("userToken");
            if (!token) {
                Swal.fire({
                    icon: 'error',
                    title: 'Please Login',
                    text: 'You need to login to add items to cart'
                });
                navigate('/login');
                return;
            }

            const response = await axios.post(
                `${host}/customer/cart/add`,
                { productId, quantity },
                { 
                    headers: { 
                        'auth-token': token,
                        'Content-Type': 'application/json'
                    } 
                }
            );
            
            if (response.data.success) {
                setCart(response.data.cart);
                Swal.fire({
                    icon: 'success',
                    title: 'Added to Cart!',
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.removeItem("userToken");
                setUser({});
                navigate('/login');
                Swal.fire({
                    icon: 'error',
                    title: 'Session Expired',
                    text: 'Please login again'
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: error.response?.data?.message || 'Failed to add to cart'
                });
            }
        };
    }

    const getCart = async () => {
        try {
            const token = localStorage.getItem("userToken");
            if (!token) {
                console.log("No token found");
                return;
            }

            const response = await axios.get(
                `${host}/customer/cart`,
                { 
                    headers: { 
                        'auth-token': token,
                        'Content-Type': 'application/json'
                    } 
                }
            );
            
            if (response.data.success) {
                setCart(response.data.cart);
            }
        } catch (error) {
            console.error("Error fetching cart:", error);
            if (error.response?.status === 401) {
                localStorage.removeItem("userToken");
                setUser({});
                navigate('/login');
            }
        }
    };

    // Update cart fetch effect
    useEffect(() => {
        const token = localStorage.getItem("userToken");
        if (token) {
            getCart();
        }
    }, [user.token]); // Change dependency to user.token

    const updateCartItem = async (productId, quantity) => {
        try {
            const token = localStorage.getItem("userToken");
            const response = await axios.put(
                `${host}/customer/cart/update`,
                { productId, quantity },
                { headers: { 'auth-token': token } }
            );
            
            if (response.data.success) {
                setCart(response.data.cart);
                // Swal.fire({
                //     icon: 'success',
                //     title: 'Cart Updated!',
                //     showConfirmButton: false,
                //     timer: 1500
                // });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.response?.data?.message || 'Failed to update cart'
            });
        }
    };

    const removeFromCart = async (productId) => {
        try {
            const token = localStorage.getItem("userToken");
            const response = await axios.delete(
                `${host}/customer/cart/remove/${productId}`,
                { headers: { 'auth-token': token } }
            );
            
            if (response.data.success) {
                setCart(response.data.cart);
                Swal.fire({
                    icon: 'success',
                    title: 'Item Removed!',
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.response?.data?.message || 'Failed to remove item'
            });
        }
    };

    // Add useEffect to fetch cart on mount
    useEffect(() => {
        if (user.token) {
            getCart();
        }
    }, [user]);

    const getAllCategories = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${host}/customer/categories`);
            if (response.data.success) {
                setCategories(response.data.categories);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
            setError("Failed to fetch categories");
        } finally {
            setLoading(false);
        }
    };


    const createOrder = async (orderData) => {
        try {
            const token = localStorage.getItem("userToken");
            if (!token) {
                Swal.fire({
                    icon: 'error',
                    title: 'Please Login',
                    text: 'You need to login to place an order'
                });
                navigate('/login');
                return;
            }

            const response = await axios.post(
                `${host}/customer/order/create`,
                orderData,
                { headers: { 'auth-token': token } }
            );
            
            if (response.data.success) {
                setCart([]);
                Swal.fire({
                    icon: 'success',
                    title: 'Order Placed Successfully!',
                    text: orderData.paymentMethod === 'UPI' ? 
                        'Payment received and order confirmed!' : 
                        'Thank you for your purchase'
                });
                navigate('/orders');
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.response?.data?.message || 'Failed to place order'
            });
        }
    };

    const getOrders = async () => {
        try {
            const token = localStorage.getItem("userToken");
            if (!token) return;

            const response = await axios.get(
                `${host}/customer/orders`,
                { headers: { 'auth-token': token } }
            );
            
            if (response.data.success) {
                setOrders(response.data.orders);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    const cancelOrder = async (orderId) => {
        try {
            const token = localStorage.getItem("userToken");
            if (!token) {
                Swal.fire({
                    icon: 'error',
                    title: 'Please Login',
                    text: 'You need to login to cancel orders'
                });
                navigate('/login');
                return;
            }

            const response = await axios.put(
                `${host}/customer/orders/${orderId}/cancel`,
                {},
                { headers: { 'auth-token': token } }
            );
            
            if (response.data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Order Cancelled!',
                    text: 'Your order has been cancelled successfully'
                });
                getOrders(); // Refresh orders list
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.response?.data?.message || 'Failed to cancel order'
            });
        }
    };

    const submitFeedback = async (orderId, rating, feedback) => {
        try {
            const token = localStorage.getItem("userToken");
            if (!token) {
                Swal.fire({
                    icon: 'error',
                    title: 'Please Login',
                    text: 'You need to login to submit feedback'
                });
                navigate('/login');
                return;
            }

            const response = await axios.post(
                `${host}/customer/orders/${orderId}/feedback`,
                { rating, feedback },
                { headers: { 'auth-token': token } }
            );
            
            if (response.data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Thank you!',
                    text: 'Your feedback has been submitted successfully',
                    timer: 2000,
                    showConfirmButton: false
                });
                getOrders(); // Refresh orders to update the feedback status
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.response?.data?.message || 'Failed to submit feedback'
            });
        }
    };

    // Add submitFeedback to the context value
    return (
        <userContext.Provider value={{
            user,
            LoginUser,
            RegisterUser,
            LogoutUser,
            products,
            getAllProducts,
            getProductById,
            loading,
            error,
            cart,
            addToCart,
            updateCartItem,
            removeFromCart,
            getCart,
            getAllCategories,
            createOrder,
            getOrders,
            orders,
            cancelOrder,
            submitFeedback,
        }}>
            {props.children}
        </userContext.Provider>
    );
}
