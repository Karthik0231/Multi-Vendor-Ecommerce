const mongoose=require('mongoose');

const customerSchema=new mongoose.Schema({
    name:
    {
        type:String,
        require:true,
    },
    email:
    {
        type:String,
        require:true,
    },
    password:
    {
        type:String,
        require:true,
    },
    phone:
    {
        type:String,
        require:true,
    },
    cart: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            default: 1
        }
    }]
});

module.exports=mongoose.model('Customer',customerSchema);