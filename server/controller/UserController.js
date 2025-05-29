const secretKey = "ecom";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Customer = require("../Models/Customer");
const Product = require("../models/Product");
const Category=require("../models/Category");
const Order = require('../models/Order');
const Feedback = require('../models/Feedback');

// Register a new customer
const registerCustomer = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if customer already exists
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ message: "Customer already exists", success: false });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create a new customer
    const newCustomer = await new Customer({
      name,
      email,
      password: hashedPassword,
      phone
    }).save();

    res.status(201).json({ message: "Customer registered successfully", success: true });  
  }
  catch (error) {
    console.error("Error registering customer:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// Login customer
const loginCustomer = async (req, res) => {
    try {
        console.log("Request Body:", req.body); // 🧪 Add this

        const { email, password } = req.body;

        const customer = await Customer.findOne({ email });
        if (!customer) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, customer.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: customer._id }, secretKey);
        res.status(200).json({ message: "Login successful", token, success: true });
        console.log("Login successful:", customer); // 🧪 Add this
    } catch (error) {
        console.error("Error logging in customer:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get all products
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({ status: 'active' })
            .populate('category', 'name')
            .populate('vendor', 'name');
        res.status(200).json({ success: true, products });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

// Get product by ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('category', 'name')
            .populate('vendor', 'name');
        
        if (!product) {
            return res.status(404).json({ message: "Product not found", success: false });
        }
        
        res.status(200).json({ success: true, product });
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

const getAllCategories = async (req, res) => {
  try {
      const categories = await Category.find();
      res.status(200).json({ 
          success: true,
          categories 
      });
  } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ 
          success: false,
          message: "Internal server error" 
      });
  }
};

// Get cart
const getCart = async (req, res) => {
  try {
      const customer = await Customer.findById(req.customer.id)
          .populate({
              path: 'cart.product',
              select: 'name price images stock'
          });
      
      if (!customer) {
          return res.status(404).json({ 
              success: false, 
              message: "Customer not found" 
          });
      }

      res.status(200).json({ 
          success: true, 
          cart: customer.cart 
      });
  } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ 
          success: false, 
          message: "Internal server error" 
      });
  }
};

// Add to cart
const addToCart = async (req, res) => {
  try {
      const { productId, quantity } = req.body;
      const customer = await Customer.findById(req.customer.id);
      
      if (!customer) {
          return res.status(404).json({ 
              success: false, 
              message: "Customer not found" 
          });
      }

      const product = await Product.findById(productId);
      if (!product) {
          return res.status(404).json({ 
              success: false, 
              message: "Product not found" 
          });
      }

      if (product.stock < quantity) {
          return res.status(400).json({ 
              success: false, 
              message: "Insufficient stock" 
          });
      }

      const cartItemIndex = customer.cart.findIndex(
          item => item.product.toString() === productId
      );

      if (cartItemIndex > -1) {
          customer.cart[cartItemIndex].quantity = quantity;
      } else {
          customer.cart.push({ product: productId, quantity });
      }

      await customer.save();
      await customer.populate('cart.product');

      res.status(200).json({ 
          success: true, 
          cart: customer.cart 
      });
  } catch (error) {
      console.error("Error adding to cart:", error);
      res.status(500).json({ 
          success: false, 
          message: "Internal server error" 
      });
  }
};

// Update cart item
const updateCartItem = async (req, res) => {
  try {
      const { productId, quantity } = req.body;
      const customer = await Customer.findById(req.customer.id);
      
      if (!customer) {
          return res.status(404).json({ 
              success: false, 
              message: "Customer not found" 
          });
      }

      const cartItemIndex = customer.cart.findIndex(
          item => item.product.toString() === productId
      );

      if (cartItemIndex === -1) {
          return res.status(404).json({ 
              success: false, 
              message: "Product not found in cart" 
          });
      }

      const product = await Product.findById(productId);
      if (!product) {
          return res.status(404).json({ 
              success: false, 
              message: "Product not found" 
          });
      }

      if (product.stock < quantity) {
          return res.status(400).json({ 
              success: false, 
              message: "Insufficient stock" 
          });
      }

      customer.cart[cartItemIndex].quantity = quantity;
      await customer.save();
      await customer.populate('cart.product');

      res.status(200).json({ 
          success: true, 
          cart: customer.cart 
      });
  } catch (error) {
      console.error("Error updating cart item:", error);
      res.status(500).json({ 
          success: false, 
          message: "Internal server error" 
      });
  }
};

// Remove from cart
const removeFromCart = async (req, res) => {
  try {
      const { productId } = req.params;
      const customer = await Customer.findById(req.customer.id);
      
      if (!customer) {
          return res.status(404).json({ 
              success: false, 
              message: "Customer not found" 
          });
      }

      customer.cart = customer.cart.filter(
          item => item.product.toString() !== productId
      );

      await customer.save();
      await customer.populate('cart.product');

      res.status(200).json({ 
          success: true, 
          cart: customer.cart 
      });
  } catch (error) {
      console.error("Error removing from cart:", error);
      res.status(500).json({ 
          success: false, 
          message: "Internal server error" 
      });
  }
};

// Create new order
const createOrder = async (req, res) => {
    try {
        const { shippingAddress, contactInfo, paymentMethod, paymentDetails } = req.body;
        const customer = await Customer.findById(req.customer.id).populate('cart.product');
        
        if (!customer || !customer.cart.length) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty"
            });
        }

        // Group cart items by vendor
        const vendorOrders = {};
        let totalAmount = 0;

        // Validate stock and group items by vendor
        for (const cartItem of customer.cart) {
            const product = await Product.findById(cartItem.product._id);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product not found: ${cartItem.product._id}`
                });
            }

            if (product.stock < cartItem.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for product: ${product.name}`
                });
            }

            const vendorId = product.vendor.toString();
            if (!vendorOrders[vendorId]) {
                vendorOrders[vendorId] = {
                    items: [],
                    totalAmount: 0
                };
            }

            vendorOrders[vendorId].items.push({
                product: product._id,
                quantity: cartItem.quantity,
                price: product.price,
                vendor: product.vendor
            });

            vendorOrders[vendorId].totalAmount += product.price * cartItem.quantity;
            totalAmount += product.price * cartItem.quantity;
        }

        // Create separate orders for each vendor
        const orders = [];
        for (const vendorId in vendorOrders) {
            const vendorOrder = new Order({
                customer: customer._id,
                items: vendorOrders[vendorId].items,
                shippingAddress,
                contactInfo,
                totalAmount: vendorOrders[vendorId].totalAmount,
                paymentMethod,
                paymentDetails: paymentMethod === 'UPI' ? paymentDetails : undefined
            });
            orders.push(await vendorOrder.save());

            // Update product quantities
            for (const item of vendorOrders[vendorId].items) {
                await Product.findByIdAndUpdate(
                    item.product,
                    { $inc: { stock: -item.quantity } }
                );
            }
        }

        // Clear customer's cart
        customer.cart = [];
        await customer.save();

        res.status(201).json({
            success: true,
            orders
        });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Get user's orders
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ customer: req.customer.id })
            .populate('items.product')
            .populate('items.vendor', 'shopName').
            sort('-createdAt');
        
        res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Cancel order
const cancelOrder = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const order = await Order.findById(orderId);
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Check if the order belongs to the customer
        if (order.customer.toString() !== req.customer.id) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to cancel this order"
            });
        }

        // Only allow cancellation if status is pending
        if (order.orderStatus !== 'pending') {
            return res.status(400).json({
                success: false,
                message: "Order cannot be cancelled at this stage"
            });
        }

        order.orderStatus = 'cancelled';
        await order.save();

        res.status(200).json({
            success: true,
            message: "Order cancelled successfully"
        });
    } catch (error) {
        console.error("Error cancelling order:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const submitFeedback = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { rating, feedback } = req.body;
        
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        if (order.feedback) {
            return res.status(400).json({
                success: false,
                message: "Feedback already submitted for this order"
            });
        }

        const newFeedback = new Feedback({
            order: orderId,
            customer: req.customer.id,
            rating,
            comment: feedback
        });

        const savedFeedback = await newFeedback.save();
        
        order.feedback = savedFeedback._id;
        await order.save();

        res.status(200).json({
            success: true,
            message: "Feedback submitted successfully"
        });
    } catch (error) {
        console.error("Error submitting feedback:", error);
        res.status(500).json({
            success: false,
            message: "Cannot submit feedback"
        });
    }
};

module.exports = { 
    registerCustomer, 
    loginCustomer,
    getAllProducts,
    getProductById,
    getAllCategories,
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    createOrder,
    getOrders,
    cancelOrder,
    submitFeedback
};