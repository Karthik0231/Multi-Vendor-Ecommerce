const secretKey = "ecom";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AdminSchema = require("../Models/Admin");
const UserSchema = require("../Models/Customer");
const Vendor = require("../models/Vendor"); // Assuming the Vendor model is in the same directory
const Category = require('../models/Category');
const Feedback = require('../models/Feedback');
const Order = require('../models/Order');
const Message = require('../models/Message');

const registerAdmin = async (req, res) => {
    try{
        const { name, email, password } = req.body;

        // Check if admin already exists
        const existingAdmin = await AdminSchema.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: "Admin already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create a new admin
        const newAdmin = new AdminSchema({
            name,
            email,
            password: hashedPassword,
        }).save();

        res.status(201).json({ message: "Admin registered successfully" });
    }
    catch (error) {
        console.error("Error registering admin:", error);
        res.status(500).json({ message: "Internal server error" });
    }
    }

    const loginAdmin = async (req, res) => {
        try{
            const {email,password}=req.body;    
            const admin=await AdminSchema.findOne({email});
            if(!admin){
                return res.status(400).json({message:"Invalid credentials"});
            }
            const isPasswordValid=await bcrypt.compare(password,admin.password);
            if(!isPasswordValid){
                return res.status(400).json({message:"Invalid Password"});
            }
            const token=jwt.sign(admin.id,secretKey);
            res.status(200).json({message:"Login successful",token,success:true});
            console.log("Login successful:", admin); // 🧪 Add this
        }
        catch (error) {
            console.error("Error logging in admin:", error);
            res.status(500).json({ message: "Internal server error" }); 
            }
        }

        

        const getAllUsers = async (req, res) => {
            try {
                const users = await UserSchema.find().select('-password');
                res.status(200).json({ 
                    success: true,
                    users 
                });
            } catch (error) {
                console.error("Error fetching users:", error);
                res.status(500).json({ 
                    success: false,
                    message: "Internal server error" 
                });
            }
        };

        const deleteUser = async (req, res) => {
            try {
                const { userId } = req.params;
                const deletedUser = await UserSchema.findByIdAndDelete(userId);
                
                if (!deletedUser) {
                    return res.status(404).json({
                        success: false,
                        message: "User not found"
                    });
                }

                res.status(200).json({
                    success: true,
                    message: "User deleted successfully"
                });
            } catch (error) {
                console.error("Error deleting user:", error);
                res.status(500).json({
                    success: false,
                    message: "Internal server error"
                });
            }
        };

        const getAllVendors = async (req, res) => {
            try {
                const vendors = await Vendor.find().select('-password');
                res.status(200).json({ 
                    success: true,
                    vendors 
                });
            } catch (error) {
                console.error("Error fetching vendors:", error);
                res.status(500).json({ 
                    success: false,
                    message: "Internal server error" 
                });
            }
        };

        const updateVendorStatus = async (req, res) => {
            try {
                const { vendorId } = req.params;
                const { isApproved } = req.body;

                const vendor = await Vendor.findByIdAndUpdate(
                    vendorId,
                    { isApproved },
                    { new: true }
                ).select('-password');

                if (!vendor) {
                    return res.status(404).json({
                        success: false,
                        message: "Vendor not found"
                    });
                }

                res.status(200).json({
                    success: true,
                    message: `Vendor ${isApproved ? 'approved' : 'rejected'} successfully`,
                    vendor
                });
            } catch (error) {
                console.error("Error updating vendor status:", error);
                res.status(500).json({
                    success: false,
                    message: "Internal server error"
                });
            }
        };

        const deleteVendor = async (req, res) => {
            try {
                const { vendorId } = req.params;
                const deletedVendor = await Vendor.findByIdAndDelete(vendorId);
                
                if (!deletedVendor) {
                    return res.status(404).json({
                        success: false,
                        message: "Vendor not found"
                    });
                }

                res.status(200).json({
                    success: true,
                    message: "Vendor deleted successfully"
                });
            } catch (error) {
                console.error("Error deleting vendor:", error);
                res.status(500).json({
                    success: false,
                    message: "Internal server error"
                });
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

        const addCategory = async (req, res) => {
            try {
                const { name } = req.body;
                
                const existingCategory = await Category.findOne({ name });
                if (existingCategory) {
                    return res.status(400).json({
                        success: false,
                        message: "Category already exists"
                    });
                }

                const newCategory = await new Category({ name }).save();
                
                res.status(201).json({
                    success: true,
                    message: "Category added successfully",
                    category: newCategory
                });
            } catch (error) {
                console.error("Error adding category:", error);
                res.status(500).json({
                    success: false,
                    message: "Internal server error"
                });
            }
        };

        const updateCategory = async (req, res) => {
            try {
                const { id } = req.params;
                const { name } = req.body;

                const updatedCategory = await Category.findByIdAndUpdate(
                    id,
                    { name },
                    { new: true }
                );

                if (!updatedCategory) {
                    return res.status(404).json({
                        success: false,
                        message: "Category not found"
                    });
                }

                res.status(200).json({
                    success: true,
                    message: "Category updated successfully",
                    category: updatedCategory
                });
            } catch (error) {
                console.error("Error updating category:", error);
                res.status(500).json({
                    success: false,
                    message: "Internal server error"
                });
            }
        };

        const deleteCategory = async (req, res) => {
            try {
                const { id } = req.params;
                
                const deletedCategory = await Category.findByIdAndDelete(id);
                
                if (!deletedCategory) {
                    return res.status(404).json({
                        success: false,
                        message: "Category not found"
                    });
                }

                res.status(200).json({
                    success: true,
                    message: "Category deleted successfully"
                });
            } catch (error) {
                console.error("Error deleting category:", error);
                res.status(500).json({
                    success: false,
                    message: "Internal server error"
                });
            }
        };

        const getAllFeedbacks = async (req, res) => {
            try {
                const feedbacks = await Feedback.find()
                    .populate('customer', 'name email profileImage')
                    .populate('order', 'items totalAmount orderStatus');
                    
                res.status(200).json({ 
                    success: true,
                    feedbacks 
                });
            } catch (error) {
                console.error("Error fetching feedbacks:", error);
                res.status(500).json({ 
                    success: false,
                    message: "Internal server error" 
                });
            }
        };

        const deleteFeedback = async (req, res) => {
            try {
                const { feedbackId } = req.params;
                const deletedFeedback = await Feedback.findByIdAndDelete(feedbackId);
                
                if (!deletedFeedback) {
                    return res.status(404).json({
                        success: false,
                        message: "Feedback not found"
                    });
                }

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

        // Get all orders
        const getAllOrders = async (req, res) => {
            try {
                const orders = await Order.find()
                    .populate('customer', 'name email')
                    .populate('items.product', 'name price')
                    .sort({ createdAt: -1 });

                res.json({
                    success: true,
                    orders
                });
            } catch (error) {
                console.error('Error fetching orders:', error);
                res.status(500).json({
                    success: false,
                    message: 'Error fetching orders'
                });
            }
        };

        // Get dashboard statistics
        const getDashboardStats = async (req, res) => {
            try {
                // Get total orders count
                const totalOrders = await Order.countDocuments();
                
                // Get total revenue
                const revenueResult = await Order.aggregate([
                    {
                        $group: {
                            _id: null,
                            totalRevenue: { $sum: "$totalAmount" }
                        }
                    }
                ]);
                const totalRevenue = revenueResult[0]?.totalRevenue || 0;

                // Get total users
                const totalUsers = await UserSchema.countDocuments();

                // Get total vendors
                const totalVendors = await Vendor.countDocuments();

                // Get recent orders
                const recentOrders = await Order.find()
                    .populate('customer', 'name email')
                    .sort({ createdAt: -1 })
                    .limit(5);

                // Get orders by status
                const ordersByStatus = await Order.aggregate([
                    {
                        $group: {
                            _id: "$status",
                            count: { $sum: 1 }
                        }
                    }
                ]);

                res.json({
                    success: true,
                    stats: {
                        totalOrders,
                        totalRevenue,
                        totalUsers,
                        totalVendors,
                        recentOrders,
                        ordersByStatus
                    }
                });
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
                res.status(500).json({
                    success: false,
                    message: 'Error fetching dashboard statistics'
                });
            }
        };


const viewVendorMessage = async (req, res) => {
    try {
        const { vendorId } = req.params;

        const messages = await Message.find({ sender:vendorId });

        if (!messages || messages.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No messages found for this vendor.",
            });
        }

        res.status(200).json({
            success: true,
            messages,
        });

    } catch (error) {
        console.error("Error fetching vendor messages:", error);
        res.status(500).json({
            success: false,
            message: "Server error while retrieving messages.",
        });
    }
};
const sendReplyToVendor = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { response } = req.body;

        if (!response) {
            return res.status(400).json({
                success: false,
                message: "Reply (response) is required",
            });
        }

        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Message not found",
            });
        }

        message.response = response;
        message.responseDate = new Date();

        await message.save();

        res.status(200).json({
            success: true,
            message: "Reply sent successfully",
            data: message,
        });

    } catch (error) {
        console.error("Admin reply error:", error);
        res.status(500).json({
            success: false,
            message: "Server error while replying to vendor",
        });
    }
};

        module.exports = {
            registerAdmin,
            loginAdmin,
            getAllUsers,
            deleteUser,
            getAllVendors,
            updateVendorStatus,
            deleteVendor,
            getAllCategories,
            addCategory,
            updateCategory,
            deleteCategory,
            getAllFeedbacks,
            deleteFeedback,
            getAllOrders,
            getDashboardStats,
            viewVendorMessage,
            sendReplyToVendor
        }