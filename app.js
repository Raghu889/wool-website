const express=require("express");
const path=require("path");
const session=require("express-session");
const bodyParser=require("body-parser");
const exphbs = require('express-handlebars');


const hbs = require('hbs');

hbs.registerHelper('eq', function(a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this);
});




const mongoose=require("mongoose");
const YourData=require("./routes/mongoconn");

const homeroute=require("./routes/beforeLogin");
const wool=require("./routes/wooltype");
const uploads = require("./routes/uploadschema");
const buyer=require("./routes/buynow");

const app=express();
const port=3000


// app.engine('hbs', hbs.engine);
app.set("view engine","hbs");
app.set('views', path.join(__dirname, 'views'));


app.use(express.static(path.join(__dirname,"public")))
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret:"your-secret-key",
    resave:true,
    saveUninitialized:false,
    
  })
);

app.use((req, res, next) => {
  res.locals.currentUser = req.session.user;
  next();
});



mongoose.connect("mongodb://localhost:27017/blogs",{

});



  const db = mongoose.connection;

db.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

db.once("open", () => {
  console.log("Mongoose connected to MongoDB");
});

db.on("disconnected", () => {
  console.log("MongoDB disconnected");
});
  

app.use("/",homeroute);
app.use('/wooltype',wool);




app.get("/product/:_id",async(req,res)=>{
  const id=req.params._id;
  const user=req.session.user;
  const product = await uploads.findById(id);
  res.render("Dproduct",{product,user});
});
app.get("/orderrequest/:userid",async(req,res)=>{
    const userid=req.params.userid;
    const user=req.session.user;
    var tp=[],sum=0;
    const orderrequests=await buyer.find({productowner:userid});
    if(user){
      for (let i = 0; i < orderrequests.length; i++) {
        tp.push(
          await YourData.findById(orderrequests[i].productBuyer)
        )
        
      }
      for (let i = 0; i < orderrequests.length; i++) {
        
        orderrequests[i].buyername=tp[i].name;
        
      }
      console.log(sum);
      res.render("orderrequest",{orderrequests,user});
    }
    else{
      res.redirect("/login");
    }
})
app.get("/track/:productId",async(req,res)=>{
  const productId=req.params.productId;
  const user=req.session.user;
  // res.json({message:'trakingpage'});
  const product=await buyer.findById(productId);
  res.render("trakingpage",{user,product});
})



app.listen(port,()=>{
    console.log(`App is running in the port http://localhost:${port}`);
})