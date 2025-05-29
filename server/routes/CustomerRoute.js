const express = require("express");
const router = express.Router();
const {
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
    submitFeedback,
} = require("../controller/UserController");
const { VerifyCustomerToken } = require("../middleware/authCustomer");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/customer");
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();

    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Authentication routes
router.post("/login", loginCustomer);
router.post("/Register", upload.single("profile"), registerCustomer);

// Product routes
router.get("/products", getAllProducts);
router.get("/products/:id", getProductById);
router.get("/categories", getAllCategories);

// Cart routes
router.get("/cart", VerifyCustomerToken, getCart);
router.post("/cart/add", VerifyCustomerToken, addToCart);
router.put("/cart/update", VerifyCustomerToken, updateCartItem);
router.delete("/cart/remove/:productId", VerifyCustomerToken, removeFromCart);

// Order routes
router.post("/order/create", VerifyCustomerToken, createOrder);
router.get("/orders", VerifyCustomerToken, getOrders);
router.put("/orders/:orderId/cancel", VerifyCustomerToken, cancelOrder);
router.post("/orders/:orderId/feedback", VerifyCustomerToken, submitFeedback);

module.exports = router;
