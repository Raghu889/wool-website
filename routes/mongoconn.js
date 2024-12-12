const mongoose = require('mongoose');

const yourSchema = new mongoose.Schema({
    name:String,
    mobile:Number,
    address:String,
    password:String,
    confirmpassword:String,
    image:String,
});

const YourModel = mongoose.model('YourModel', yourSchema);

module.exports = YourModel;
