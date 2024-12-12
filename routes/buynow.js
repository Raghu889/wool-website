const mongoose=require('mongoose');

const buyerSchema=new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    productBuyer: String,
    productowner: String,
    imageUrl: [String],
    quantity:Number,
    address:String,
    date:Date
})

const buyer=mongoose.model('buyer',buyerSchema);

module.exports=buyer;