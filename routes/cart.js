const mongoose=require("mongoose");

const cartSchema=new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    productowner: String,
    imageUrl: String,
    quantity: Number,
})

const cart=mongoose.model('cart',cartSchema);
module.exports=cart;