const secretKey = "ecom";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Vendor = require("../models/Vendor");
const Product = require('../models/Product');
const Category = require('../models/Category');
const fs = require('fs');
const path = require('path');
const Order = require('../models/Order');
const Feedback = require('../models/Feedback');
const Message = require('../models/Message'); // Add this line

// Register a new vendor
const registerVendor = async (req, res) => {
  try {
    const { name, email, password, phone, shopName, address } = req.body;

    // Check if vendor already exists
    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor) {
      return res.status(400).json({ 
        message: "Vendor already exists", 
        success: false 
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create a new vendor
    const newVendor = await new Vendor({
      name,
      email,
      password: hashedPassword,
      phone,
      shopName,
      address,
      profileImage: req.file ? req.file.filename : ""
    }).save();

    res.status(201).json({ 
      message: "Vendor registered successfully", 
      success: true 
    });  
  }
  catch (error) {
    console.error("Error registering vendor:", error);
    res.status(500).json({ 
      message: "Internal server error", 
      success: false 
    });
  }
};

// Login vendor
const loginVendor = async (req, res) => {
    try {
        const { email, password } = req.body;

        const vendor = await Vendor.findOne({ email });
        if (!vendor) {
            return res.status(400).json({ 
              message: "Invalid credentials",
              success: false 
            });
        }

        const isPasswordValid = await bcrypt.compare(password, vendor.password);
        if (!isPasswordValid) {
            return res.status(400).json({ 
              message: "Invalid credentials",
              success: false 
            });
        }

        // Check if vendor is approved
        if (!vendor.isApproved) {
            return res.status(403).json({ 
              message: "Account pending approval", 
              success: false 
            });
        }

        const token = jwt.sign({ id: vendor._id }, secretKey);
        res.status(200).json({ 
            message: "Login successful", 
            token, 
            success: true,
            vendor: {
                id: vendor._id,
                name: vendor.name,
                email: vendor.email,
                shopName: vendor.shopName,
                isApproved: vendor.isApproved
            }
        });
    } catch (error) {
        console.error("Error logging in vendor:", error);
        res.status(500).json({ 
          message: "Internal server error",
          success: false 
        });
    }
};

// Get all products for logged in vendor
const getVendorProducts = async (req, res) => {
    try {
        const products = await Product.find({ vendor: req.vendor.id })
            .populate('category', 'name')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            products
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Add new product
const addProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            category,
            stock,
            status
        } = req.body;

        let specifications = {};
        if (req.body.specifications) {
            if (typeof req.body.specifications === 'string') {
                try {
                    specifications = JSON.parse(req.body.specifications);
                } catch (err) {
                    console.error('Failed to parse specifications:', err);
                    specifications = {};
                }
            } else if (typeof req.body.specifications === 'object') {
                specifications = req.body.specifications;
            }
        }

        const images = req.files ? req.files.map(file => file.filename) : [];

        const productData = {
            name,
            description,
            price: Number(price),
            category,
            stock: Number(stock),
            status,
            specifications,
            images,
            vendor: req.vendor.id
        };

        console.log('Creating product with data:', productData);

        const product = await new Product(productData).save();

        res.status(201).json({
            success: true,
            message: "Product added successfully",
            product
        });
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};

// Update product
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Verify product exists and belongs to vendor
        const existingProduct = await Product.findOne({ 
            _id: id, 
            vendor: req.vendor.id 
        });

        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Create update data with validation
        const updateData = {
            name: req.body.name || existingProduct.name,
            description: req.body.description || existingProduct.description,
            price: req.body.price ? Number(req.body.price) : existingProduct.price,
            category: req.body.category || existingProduct.category,
            stock: req.body.stock ? Number(req.body.stock) : existingProduct.stock,
            status: req.body.status || existingProduct.status
        };

        // Handle specifications
        if (req.body.specifications) {
            try {
                updateData.specifications = JSON.parse(req.body.specifications);
            } catch (error) {
                console.error('Error parsing specifications:', error);
                updateData.specifications = existingProduct.specifications;
            }
        }

        // Handle images - replace old images if new ones are uploaded
        if (req.files && req.files.length > 0) {
            updateData.images = req.files.map(file => file.filename);
            
            // Delete old image files
            existingProduct.images.forEach(oldImage => {
                const imagePath = path.join(__dirname, '../uploads/products', oldImage);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            });
        } else {
            // Keep existing images if no new ones are uploaded
            updateData.images = existingProduct.images;
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        ).populate('category', 'name');

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product: updatedProduct
        });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};

// Delete product
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findOneAndDelete({ 
            _id: id, 
            vendor: req.vendor.id 
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Get all categories
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find().select('name');
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

// Verify vendor
const verifyVendor = async (req, res) => {
    try {
        // The vendor ID is available from the auth middleware
        const vendor = await Vendor.findById(req.vendor.id).select('-password');
        
        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: "Vendor not found"
            });
        }

        res.json({
            success: true,
            vendor
        });
    } catch (error) {
        console.error("Verification error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Get vendor orders
const getVendorOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            'items.vendor': req.vendor.id
        }).populate('customer', 'name email')
          .populate('items.product', 'name price')
          .sort('-createdAt');

        res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        console.error("Error fetching vendor orders:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Update order status
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const order = await Order.findOneAndUpdate(
            {
                _id: orderId,
                'items.vendor': req.vendor.id
            },
            {
                $set: {
                    orderStatus: status
                }
            },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order
        });
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Get vendor feedbacks
const getVendorFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.find()
            .populate({
                path: 'order',
                populate: [
                    {
                        path: 'items.product',
                        select: 'name'
                    },
                    {
                        path: 'items.vendor',
                        select: 'shopName'
                    }
                ]
            })
            .populate('customer', 'name email')
            .sort('-createdAt');

        // Filter feedbacks where the order contains items from this vendor
        const vendorFeedbacks = feedbacks.filter(feedback => {
            if (!feedback.order || !feedback.order.items) return false;
            return feedback.order.items.some(item => 
                item.vendor && item.vendor._id.toString() === req.vendor.id
            );
        });

        console.log(vendorFeedbacks);
        res.status(200).json({
            success: true,
            feedbacks: vendorFeedbacks
        });
    } catch (error) {
        console.error("Error fetching vendor feedbacks:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// Delete feedback
const deleteFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        // Find the feedback first to check if it belongs to this vendor's products
        const feedback = await Feedback.findById(id).populate({
            path: 'order',
            populate: {
                path: 'items.vendor',
                select: '_id'
            }
        });

        if (!feedback) {
            return res.status(404).json({
                success: false,
                message: "Feedback not found"
            });
        }

        // Check if the feedback is for this vendor's products
        const belongsToVendor = feedback.order.items.some(item => 
            item.vendor && item.vendor._id.toString() === req.vendor.id
        );

        if (!belongsToVendor) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to delete this feedback"
            });
        }

        // Delete the feedback
        await Feedback.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Feedback deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting feedback:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Get vendor profile
const getVendorProfile = async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.vendor.id)
            .select('-password');
        
        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: "Vendor not found"
            });
        }

        res.status(200).json({
            success: true,
            vendor
        });
    } catch (error) {
        console.error("Error fetching vendor profile:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Update vendor profile
const updateVendorProfile = async (req, res) => {
    try {
        const { name, phone, shopName, address } = req.body;
        
        const updateData = {
            name,
            phone,
            shopName,
            address
        };

        if (req.file) {
            updateData.profileImage = req.file.filename;
            
            // Delete old profile image if exists
            const vendor = await Vendor.findById(req.vendor.id);
            if (vendor.profileImage) {
                const imagePath = path.join(__dirname, '../uploads/vendor', vendor.profileImage);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }
        }

        const updatedVendor = await Vendor.findByIdAndUpdate(
            req.vendor.id,
            updateData,
            { new: true }
        ).select('-password');

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            vendor: updatedVendor
        });
    } catch (error) {
        console.error("Error updating vendor profile:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Add new message functions
const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;   // your message content is in `message`

    if (!req.vendor || !req.vendor.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const newMessage = new Message({
      sender: req.vendor.id || req.vendor._id,
      message: message,
    });

    await newMessage.save();

    res.status(201).json({ success: true, message: newMessage });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
};


const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.vendor || !req.vendor.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const message = await Message.findOneAndDelete({
      _id: id,
      sender: req.vendor.id
    });

    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found or not authorized to delete" });
    }

    res.status(200).json({ success: true, message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ success: false, message: 'Failed to delete message' });
  }
};

const getVendorMessages = async (req, res) => {
  try {
    const messages = await Message.find({ sender: req.vendor.id });
    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error("Error getting messages:", error);
    res.status(500).json({ success: false, message: 'Failed to get messages', error: error.message });
  }
};



module.exports = {
    registerVendor,
    loginVendor,
    getVendorProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    getCategories,
    verifyVendor,
    getVendorOrders,
    updateOrderStatus,
    getVendorFeedbacks,
    deleteFeedback,
    getVendorProfile,
    updateVendorProfile,
    sendMessage, // Add this line
    deleteMessage, // Add this line
    getVendorMessages
};