const express=require("express")


const path=require("path");
const YourData=require("./mongoconn");

const router=express.Router()



router.get("/",(req,res)=>{
  res.render('profile');
})
router.get("/home",(req,res)=>{
  res.render('homepage');
 
})




module.exports=router
