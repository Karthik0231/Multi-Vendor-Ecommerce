import React, { createContext, useState, useCallback } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { config } from "../Config/Config";
import { useNavigate } from "react-router-dom";

export const VendorContext = createContext();

export default function VendorContextProvider({ children }) {
  const { host } = config;
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("vendorToken");
  
  const LoginVendor = async (data) => {
    try {
      setLoading(true);
      const response = await axios.post(`${host}/vendor/login`, data);
      
      if (response.data.success) {
        localStorage.setItem("vendorToken", response.data.token);
        setVendor(response.data.vendor);
        Swal.fire({
          title: "Success",
          text: "Login successful",
          icon: "success",
          timer: 1500,
        });
        navigate("/dashboard");
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Login failed",
        icon: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const RegisterVendor = async (formData) => {
    try {
      setLoading(true);
      console.log('Attempting registration with:', {
        url: `${host}/vendor/register`,
        formData: Object.fromEntries(formData.entries())
      });

      const response = await axios.post(`${host}/vendor/register`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Registration response:', response.data);

      if (response.data.success) {
        Swal.fire({
          title: "Success",
          text: "Registration successful! Please wait for admin approval",
          icon: "success"
        });
        navigate("/login");
      }
    } catch (error) {
      console.error('Registration Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Registration failed - Server not reachable",
        icon: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const getProducts = async () => {
    try {
        setLoading(true);
        const response = await axios.get(`${host}/vendor/products`, {
            headers: { 'auth-token': token }
        });
        if (response.data.success) {
            setProducts(response.data.products);
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        Swal.fire('Error', 'Failed to fetch products', 'error');
    } finally {
        setLoading(false);
    }
  };

  // Fixed addProduct function
  const addProduct = async (productData) => {
    try {
        setLoading(true);
        const token = localStorage.getItem("vendorToken");
        
        // Create FormData object
        const formData = new FormData();
        
        // Append basic fields
        formData.append('name', productData.name);
        formData.append('description', productData.description);
        formData.append('price', productData.price);
        formData.append('category', productData.category);
        formData.append('stock', productData.stock);
        formData.append('status', productData.status);
        
        // Append specifications as JSON string
        const specifications = JSON.stringify(productData.specifications);
        formData.append('specifications', specifications);

        // Append images
        if (productData.images && productData.images.length > 0) {
            productData.images.forEach(image => {
                formData.append('images', image);
            });
        }

        console.log('Sending product data:', {
            name: productData.name,
            description: productData.description,
            price: productData.price,
            category: productData.category,
            stock: productData.stock,
            status: productData.status,
            specifications: productData.specifications,
            imageCount: productData.images?.length || 0
        });

        const response = await axios.post(`${host}/vendor/products`, formData, {
            headers: {
                'auth-token': token,
                'Content-Type': 'multipart/form-data'
            }
        });

        if (response.data.success) {
            await getProducts(); // Refresh product list
            return response.data;
        }
        throw new Error(response.data.message);
    } catch (error) {
        console.error('Error adding product:', error);
        throw error;
    } finally {
        setLoading(false);
    }
  };

  const getCategories = async () => {
    try {
        const token = localStorage.getItem("vendorToken");
        const response = await axios.get(`${host}/vendor/categories`, {
            headers: { 'auth-token': token }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
  };

  // Fixed updateProduct function
  const updateProduct = async (productId, productData) => {
    try {
        setLoading(true);
        const token = localStorage.getItem("vendorToken");
        
        console.log('Updating product with data:', productData);
        
        // Create a new FormData instance
        const formData = new FormData();
        
        // Add basic fields
        formData.append('name', productData.name);
        formData.append('description', productData.description);
        formData.append('price', productData.price);
        formData.append('category', productData.category);
        formData.append('stock', productData.stock);
        formData.append('status', productData.status);
        
        // Add specifications as JSON string
        if (productData.specifications) {
            formData.append('specifications', JSON.stringify(productData.specifications));
        }
        
        // Add new images if any
        if (productData.images && productData.images.length > 0) {
            productData.images.forEach(image => {
                if (image instanceof File) {
                    formData.append('images', image);
                }
            });
        }

        // Debug log FormData contents
        for (let pair of formData.entries()) {
            console.log('FormData entry:', pair[0], pair[1]);
        }

        const response = await axios.put(
            `${host}/vendor/products/${productId}`,
            formData,
            {
                headers: {
                    'auth-token': token,
                    'Content-Type': 'multipart/form-data'
                }
            }
        );

        if (response.data.success) {
            await getProducts(); // Refresh product list
            return response.data;
        }
        throw new Error(response.data.message);
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    } finally {
        setLoading(false);
    }
  };

  // Add deleteProduct function
  const deleteProduct = async (productId) => {
    try {
        setLoading(true);
        const token = localStorage.getItem("vendorToken");
        
        const response = await axios.delete(`${host}/vendor/products/${productId}`, {
            headers: { 'auth-token': token }
        });

        if (response.data.success) {
            await getProducts(); // Refresh product list
            return response.data;
        }
        throw new Error(response.data.message);
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    } finally {
        setLoading(false);
    }
  };

  const getOrders = async () => {
      try {
          setLoading(true);
          const response = await axios.get(`${host}/vendor/orders`, {
              headers: { 'auth-token': token }
          });
          if (response.data.success) {
              setOrders(response.data.orders);
          }
      } catch (error) {
          console.error('Error fetching orders:', error);
          Swal.fire('Error', 'Failed to fetch orders', 'error');
      } finally {
          setLoading(false);
      }
  };

  const updateOrderStatus = async (orderId, status) => {
      try {
          setLoading(true);
          const response = await axios.put(
              `${host}/vendor/orders/${orderId}/status`,
              { status },
              {
                  headers: { 'auth-token': token }
              }
          );
  
          if (response.data.success) {
              await getOrders(); // Refresh orders list
              Swal.fire('Success', 'Order status updated successfully', 'success');
              return response.data;
          }
      } catch (error) {
          console.error('Error updating order status:', error);
          Swal.fire('Error', 'Failed to update order status', 'error');
          throw error;
      } finally {
          setLoading(false);
      }
  };

  const getFeedbacks = useCallback(async () => {
      try {
          setLoading(true);
          const response = await axios.get(`${host}/vendor/feedbacks`, {
              headers: { 'auth-token': token }
          });
          if (response.data.success) {
              console.log(response.data.feedbacks);
              setFeedbacks(response.data.feedbacks);
          }
      } catch (error) {
          console.error('Error fetching feedbacks:', error);
          Swal.fire('Error', 'Failed to fetch feedbacks', 'error');
      } finally {
          setLoading(false);
      }
  }, [host, token]);

  const deleteFeedback = async (feedbackId) => {
      try {
          setLoading(true);
          const response = await axios.delete(`${host}/vendor/feedbacks/${feedbackId}`, {
              headers: { 'auth-token': token }
          });
  
          if (response.data.success) {
              await getFeedbacks(); // Refresh feedback list
              Swal.fire('Success', 'Feedback deleted successfully', 'success');
              return response.data;
          }
      } catch (error) {
          console.error('Error deleting feedback:', error);
          Swal.fire('Error', 'Failed to delete feedback', 'error');
          throw error;
      } finally {
          setLoading(false);
      }
  };

  const getVendorProfile = async () => {
      try {
          setLoading(true);
          const response = await axios.get(`${host}/vendor/profile`, {
              headers: { 'auth-token': token }
          });
          if (response.data.success) {
              setVendor(response.data.vendor);
          }
      } catch (error) {
          console.error('Error fetching profile:', error);
          Swal.fire('Error', 'Failed to fetch profile', 'error');
      } finally {
          setLoading(false);
      }
  };

  const updateVendorProfile = async (formData) => {
      try {
          setLoading(true);
          const response = await axios.put(`${host}/vendor/profile`, formData, {
              headers: {
                  'auth-token': token,
                  'Content-Type': 'multipart/form-data'
              }
          });
          
          if (response.data.success) {
              setVendor(response.data.vendor);
              Swal.fire('Success', 'Profile updated successfully', 'success');
          }
      } catch (error) {
          console.error('Error updating profile:', error);
          Swal.fire('Error', error.response?.data?.message || 'Failed to update profile', 'error');
      } finally {
          setLoading(false);
      }
  };

const MessageSend = async (message) => {
  try {
    setLoading(true);
    const response = await axios.post(`${host}/vendor/messages`, message, {
      headers: { 'auth-token': token,
      'Content-Type': 'application/json'
      }
    });

    if (response.data.success) {
    //   Swal.fire('Success', 'Message sent successfully', 'success');
      return response.data;
    }
  } catch (error) {
    console.error('Error sending message:', error);
    Swal.fire('Error', 'Failed to send message', 'error');
  } finally {
    setLoading(false); // Just stop the loading here
  }
};

  const deleteMessage=async(id)=>{
    try{
        setLoading(true);
        const response=await axios.delete(`${host}/vendor/messages/${id}`,
            {
                headers: { 'auth-token': token }
            }
        );
        if(response.data.success){
            Swal.fire('Success', 'Message deleted successfully', 'success');
            return response.data;
        }
    }catch(error){
        Swal.fire('Error', 'Failed to delete message', 'error');
        console.log(error);
    }
  }

  return (
    <VendorContext.Provider
      value={{
        vendor,
        loading,
        LoginVendor,
        RegisterVendor,
        products,
        getProducts,
        addProduct,
        getCategories,
        updateProduct,
        deleteProduct,
        setVendor,
        setLoading,
        orders,
        getOrders,
        updateOrderStatus,
        getFeedbacks,
        deleteFeedback,
        feedbacks, // Add this line
        getVendorProfile,
        updateVendorProfile,
        MessageSend,
        deleteMessage
      }}
    >
      {children}
    </VendorContext.Provider>
  );
}