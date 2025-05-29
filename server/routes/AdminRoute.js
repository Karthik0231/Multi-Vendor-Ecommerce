const express = require("express");
const router = express.Router();
const {
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
} = require("../controller/AdminController");
const multer = require("multer");
const { VerifyAdminToken } = require("../middleware/authAdmin");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/admin");
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();

    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/login", loginAdmin);
router.post("/Register", registerAdmin);

router.get("/users",VerifyAdminToken, getAllUsers);
router.delete("/users/:userId",VerifyAdminToken, deleteUser);
router.get("/vendors", VerifyAdminToken, getAllVendors);
router.put("/vendors/:vendorId/status", VerifyAdminToken, updateVendorStatus);
router.delete("/vendors/:vendorId", VerifyAdminToken, deleteVendor);

// Category routes
router.get("/categories", VerifyAdminToken, getAllCategories);
router.post("/categories", VerifyAdminToken, addCategory);
router.put("/categories/:id", VerifyAdminToken, updateCategory);
router.delete("/categories/:id", VerifyAdminToken, deleteCategory);

// Feedback routes
router.get("/feedbacks", VerifyAdminToken, getAllFeedbacks);
router.delete("/feedbacks/:feedbackId", VerifyAdminToken, deleteFeedback);

// Order routes
router.get('/orders', VerifyAdminToken, getAllOrders);

// Dashboard stats route
router.get('/dashboard/stats', VerifyAdminToken, getDashboardStats);

router.get('/vendor-messages/:vendorId', viewVendorMessage);
router.put('/reply/:messageId', sendReplyToVendor);

module.exports = router;
