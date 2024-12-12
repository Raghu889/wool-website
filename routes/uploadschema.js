const mongoose =require("mongoose");

const uploadschema=new mongoose.Schema({
    name: String,
    woolType:String,
    price: Number,
    description: String,
    productowner: String,
    imageUrl: [String],
    quantity:Number,
});

const uploads=mongoose.model('uploads',uploadschema);

module.exports=uploads;