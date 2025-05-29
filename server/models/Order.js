const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        vendor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vendor',
            required: true
        }
    }],
    shippingAddress: {
        street: String,
        city: String,
        state: String,
        pincode: String,
        country: String
    },
    contactInfo: {
        name: String,
        phone: String,
        email: String
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['COD', 'UPI'],
        required: true
    },
    paymentDetails: {
        upiId: String,
        transactionId: String,
        upiQRImage: String
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);