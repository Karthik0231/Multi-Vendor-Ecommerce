const express = require("express"); 
const router = express.Router(); 
const multer = require("multer"); 
const { 
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
    sendMessage,
    deleteMessage,getVendorMessages,
    deleteFeedback,getVendorProfile,updateVendorProfile} = require("../controller/Vendor"); 
const { VerifyVendorToken } = require('../middleware/authVendor'); 
const path = require('path');  

// Configure multer storage for vendor profile images
const storage = multer.diskStorage({     
    destination: (req, file, cb) => {         
        cb(null, "./uploads/vendor");  // Make sure this directory exists     
    },     
    filename: (req, file, cb) => {         
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);         
        cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);     
    } 
});  

const upload = multer({ storage: storage });  

// Configure multer for product images 
const productStorage = multer.diskStorage({     
    destination: (req, file, cb) => {         
        cb(null, "./uploads/products");     
    },     
    filename: (req, file, cb) => {         
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);         
        cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));     
    } 
});  

const uploadProduct = multer({      
    storage: productStorage,     
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB 
});  

// Auth routes 
router.post("/register", upload.single('profileImage'), registerVendor);  
router.post("/login", loginVendor); 
router.get("/verify", VerifyVendorToken, verifyVendor);  

// Product routes 
router.get("/products", VerifyVendorToken, getVendorProducts); 
router.post("/products", VerifyVendorToken, uploadProduct.array('images', 5), addProduct); 
// Fixed: Add multer middleware to PUT route for handling image uploads
router.put("/products/:id", VerifyVendorToken, uploadProduct.array('images', 5), updateProduct); 
router.delete("/products/:id", VerifyVendorToken, deleteProduct); 
router.get("/categories", VerifyVendorToken, getCategories);  
router.post('/messages', VerifyVendorToken, sendMessage);
router.delete('/messages/:id', VerifyVendorToken, deleteMessage);
router.get('/messages', VerifyVendorToken, getVendorMessages);

// Order routes
router.get("/orders", VerifyVendorToken, getVendorOrders);
router.put("/orders/:orderId/status", VerifyVendorToken, updateOrderStatus);

// Feedback routes
router.get("/feedbacks", VerifyVendorToken, getVendorFeedbacks);
router.delete("/feedbacks/:id", VerifyVendorToken, deleteFeedback);

// Profile routes
router.get("/profile", VerifyVendorToken, getVendorProfile);
router.put("/profile", VerifyVendorToken, upload.single('profileImage'), updateVendorProfile);

module.exports = router;