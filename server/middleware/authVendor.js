const jwt = require("jsonwebtoken");
const secretKey = "ecom";

const VerifyVendorToken = (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) {
        return res.status(401).json({ 
            message: "Access denied", 
            success: false 
        });
    }
    try {
        const vendorId = jwt.verify(token, secretKey);
        req.vendor = vendorId;
        next();
    }
    catch (error) {
        console.error("Token verification error:", error);
        return res.status(401).json({ 
            message: "Invalid token", 
            success: false 
        });
    }
};

module.exports = { VerifyVendorToken };