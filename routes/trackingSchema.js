const mongoose=require("mongoose");

const trackSchema=new mongoose.Schema({
    productowner:String,
    position:String,
    positionnumber:Number,
})