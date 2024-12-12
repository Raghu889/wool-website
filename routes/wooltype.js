const express=require("express");
const bodyParser = require('body-parser');
const exphbs  = require('express-handlebars');
const YourModel=require("./mongoconn");
const uploads=require("./uploadschema");
const buyer=require("./buynow");
const {hashpassword,comparepasswords}=require("./securepassword");
// const cart=require("./cart");

const multer  = require('multer')
const methodOverride = require('method-override');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const app=express();
const router=express.Router();

app.use(methodOverride('_method'));

router.get("/merino",(req,res)=>{
    res.redirect("/products");
})


module.exports=router