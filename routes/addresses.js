const mongoose=require("mongoose");

const addressSchema=new mongoose.Schema({
    Full_Name:String,
    Mobile_Number:Number,
    Pincode:Number,
    Flat_Building_Company_HouseNo_Apartment:String,
    Area_Street_Sector_Village:String,
    Landmark:String,
    Town_City:String,
    State:String,
    user:String,
})

const Youraddresses=mongoose.model('Addresses',addressSchema);

module.exports=Youraddresses;