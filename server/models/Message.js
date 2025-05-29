const mongoose = require('mongoose');

//vendor and admin msg schema
const MessageSchema= new mongoose.Schema({
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true
    },
    message:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    },
    response:{
        type:String,
        default:null
    },
    responseDate:{
        type:Date,
        default:null
    }
    
})

module.exports = mongoose.model('Message',MessageSchema);