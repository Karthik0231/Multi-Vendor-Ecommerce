// models/Vendor.js
const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  shopName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: String,

  password: {
    type: String,
    required: true,
  },

  profileImage: {
    type: String, // URL or image path
    default: "",
  },
  
  isApproved: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("Vendor", vendorSchema);
