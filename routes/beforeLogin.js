const express=require("express");
const bodyParser = require('body-parser');
const YourModel=require("./mongoconn");
const YourAddresses=require("./addresses");
const deliveryadrs=require("./deliveryaddress");
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



router.get("/",async(req,res)=>{
    const user=req.session.user
    const query =await uploads.find({productowner:{$ne:user}}).limit(4)
    const products=query.map(doc=>doc.toObject())
    console.log(products)

    res.render("homepage",{products})
})
router.get("/login",(req,res)=>{

    res.render("login",{errormessage:req.query.error});
})
router.get("/signup",(req,res)=>{
    res.render("signup")
})
router.get("/about",(req,res)=>{
    res.render("aboutus");
})

router.get("/orders",async(req,res)=>{
    const user=req.session.user;
    const success=req.query.success;
    var orderedproducts=await buyer.find({productBuyer:user});
    if(user){
        
        
        res.render("orders",{orderedproducts,user,success});
    }
    else{
        res.redirect("/login");
    }
})





// login route
router.post("/homepage",async(req,res)=>{
    const password=req.body.password
    const user=await YourModel.findOne({mobile:req.body.mobile})
    const hashedpassword=user.password;
    const matched=await comparepasswords(password,hashedpassword);
    console.log(user);
    if(user){
        if(matched){
        req.session.user=user;
        res.redirect("/homepage");
    }
        else{
            res.redirect("/login?error=Invalid number or password");
        }
    }
    else{
        res.send(`user not found`);
        
    }
})

router.get('/homepage', async(req, res) => {
    // Access the user data from the session
    const user = req.session.user;
    const query =await uploads.find({productowner:{$ne:user}}).limit(4);
    const products=query.map(doc=>doc.toObject())
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    if (user) {
        const orders=await buyer.find({productowner:user._id});
      res.render('homepage', { user,products,orders }); // Render the profile page with user data
    } else {
      res.redirect('/login'); // Redirect to login if not authenticated
    }
  });

  router.get("/profile",async(req,res)=>{
   
const user=req.session.user;
if(user){
    const userproducts=await uploads.find({productowner:user });
    
    res.render("profile",{user,userproducts});
   }
   else{
    res.redirect("/login");
   }
  })

  router.get("/products",async(req,res)=>{
      const user=req.session.user;
      const merinowool = await uploads.find({productowner:{$ne:user},woolType:'Merino Wool'});
      const lambwool = await uploads.find({productowner:{$ne:user},woolType:'Lamb Wool'});
      const cashmerewool = await uploads.find({productowner:{$ne:user},woolType:'Cashmere Wool'});
      const angorawool = await uploads.find({productowner:{$ne:user},woolType:'Angora Wool'});
      const alpacawool = await uploads.find({productowner:{$ne:user},woolType:'Alpaca Wool'});
      const mohairwool = await uploads.find({productowner:{$ne:user},woolType:'Mohair Wool'});
      const camelwool = await uploads.find({productowner:{$ne:user},woolType:'Camel hair'});

      if(user){
        res.render("products",{merinowool,alpacawool,user,lambwool,cashmerewool,angorawool,mohairwool,camelwool});
    }
    else{
        res.render("products",{merinowool,alpacawool,user,lambwool,cashmerewool,angorawool,mohairwool,camelwool});
      }
    })



    router.post("/cart/:productId", async (req, res) => {
        const user = req.session.user; // Assuming user information is stored in the session
        const productId = req.params.productId;
        const quantity = parseInt(req.body.quantity);
        console.log(quantity)
        const product=await uploads.findById(productId);
        if(user){
                if(!req.session.cart){
                    req.session.cart=[];
                    req.session.cart.push({
                        _id:product._id,
                        name: product.name,
                        price: product.price,
                        description: product.description,
                        productowner: product.productowner,
                        imageUrl: product.imageUrl,
                        quantity:quantity,
                    });
                    
                }else{
                    var cart = req.session.cart;
                    var newItem=true;
                    for (let i = 0; i < cart.length; i++) {
                        if(cart[i].name==product.name){
                            cart[i].quantity+=quantity;
                            newItem=false;
                            
                            break;
                        }
                        
                    }
                    if(newItem){
                        cart.push({
                        _id:product._id,
                        name: product.name,
                        price: product.price,
                        description: product.description,
                        productowner: product.productowner,
                        imageUrl: product.imageUrl,
                        quantity:quantity,
                    })
                }
            }
            res.json({message:"product added to cart"})
                
            }
            else{
            res.redirect("/login");
           }
    });
    







router.get("/additems",(req,res)=>{
    const user=req.session.user
    res.render("productuplods",{user});
})
router.post("/upload", upload.array('images',4), async (req,res)=>{
    const user=req.session.user;
    const imageUrls=[];
    
    
    if(user){

        for (const file of req.files) {
            const imageData = file.buffer.toString("base64");
            imageUrls.push(`data:${file.mimetype};base64,${imageData}`);
        }



        const upload=new uploads({
            name:req.body.name,
            woolType:req.body.typeselection,
            price:req.body.price,
            description:req.body.description,
            productowner:user,
            imageUrl :imageUrls,
            quantity:1,
        })
        await upload.save();
        res.redirect("/profile");
    }
    else{
        res.redirect("/login");
    }
    
    
})

router.get("/updateprofile",(req,res)=>{
    res.render("edit");
})

router.post("/edit",upload.single('image'), async(req,res)=>{
    
    const user=req.session.user;
    const name=req.body.name;
    const imageData=req.file.buffer.toString("base64");
    const image=`data:image/png;base64,${imageData}`;
    const portfolio=await YourModel.updateOne({_id:user._id},{$set:{image}});
    await YourModel.updateOne({_id:user._id},{$set:{name}});
    if(portfolio){
        user.image=image;
        user.name=name;
        res.redirect("/homepage");
    }


});

router.post("/delete/:productId",async(req,res)=>{
    const productId=req.params.productId;
    const garbage=await uploads.deleteOne({_id:productId});
    if(garbage){
        res.json({
            message:"The product is deleted"
        });
    }

})


router.get('/cancel/:productId',async(req,res)=>{
    const productId=req.params.productId;
    const user=req.session.user;
    if(user){
        await buyer.deleteOne({_id:productId});
        res.redirect("/orders");
    }
    else{
        res.redirect("/login");
    }
})



router.post("/remove/:productId",async(req,res)=>{
    console.log(req.session.cart);  
    
    const user=req.session.user;
    const productId=req.params.productId;
    const cart=req.session.cart;
    var product,i;
    console.log(productId);
    for( i=0;i<cart.length;i++){
        if(cart[i]._id===productId){
            product=cart[i];
            break;
        }
    }
    if(user){
        if(product){
            if(req.session.cart[i].quantity>1){
                console.log("abcd")
                cart[i].quantity-=1;
                
            }
            else if(cart[i].quantity==1){
            console.log("abcd")
            cart.splice(i,1);
        }
        }
        res.json("removed from cart");
    }
    else{
        res.redirect("/login");
    }
    
})

router.get("/cart",async(req,res)=>{
    const user = req.session.user;
    const cart=req.session.cart;
    var totalcost=0;
    var ec="is empty";
    if(user){
        if(cart === undefined || typeof cart === 'undefined' || cart.length === undefined){
            res.render("cart",{ec,user});
        }
        else{
            for (let i = 0; i < cart.length; i++) {
                 totalcost+=(cart[i].quantity*cart[i].price);
            }
            console.log(totalcost);
            res.render("cart",{user,cart,totalcost});
        }
    }
    else{
        res.redirect("/login");
    }
    
})
router.get("/orderrequest",async(req,res)=>{
    const user=req.session.user;
    if(user){

        res.render("orderrequest")
    }else{
        res.redirect("/login");
    }
})

router.get("/selectaddress",async (req,res)=>{
    const user=req.session.user;
    const addaddress=await YourAddresses.find({user:user._id});
    if(user){
        res.render("selectaddress",{addaddress,user});
    }
})

router.get("/payment/:addressId",async(req,res)=>{
    const user=req.session.user;
    const cart=req.session.cart;

    const addressId=req.params.addressId;
    const address=await YourAddresses.findById(addressId);
    var i=0;
    var daddress=`${address.Flat_Building_Company_HouseNo_Apartment}, ${address.Area_Street_Sector_Village},${address.Town_City},${address.State},${address.Pincode}`
    req.session.address=daddress;

    res.redirect(`/paymentspage/${user._id}`);
})
router.get("/paymentspage/:userid",(req,res)=>{
    res.render("paymentspage");
})

router.post("/process_payment",async(req,res)=>{
    const success=true;
    const cart=req.session.cart;
    const user=req.session.user;
    var i=0;


    if(success){
        if(user){
                while(i<=cart.length-1){
                      const buy=new buyer({
                    name: cart[i].name,
                    price: cart[i].price,
                    description: cart[i].description,
                    productBuyer: user._id,
                    productowner:cart[i].productowner,
                    imageUrl: cart[i].imageUrl,
                    quantity:cart[i].quantity,
                    date:Date.now(),
                    address:req.session.address,
                    
                      })
                
                      await buy.save();
                      req.session.cart.splice(0,cart.length);
                      i+=1;
            }
            res.redirect("/orders?success=order successfull");
            }
            else{
                res.redirect("/login");
            }
    }
})


router.get("/buynow/:userId",async(req,res)=>{
    const user=req.session.user;
    const userId=req.params.userId;
    const cart=req.session.cart;
    
    if(user){
        if(cart===undefined){
            res.redirect("/cart");
        }
        else{
            res.redirect("/selectaddress");
        }
    }
  })

router.get("/Youraddress/:userid",async(req,res)=>{
    const {userid}=req.params
    const user=req.session.user;
    const useradresses=await YourAddresses.find({user:userid});
    if(user){
        if(useradresses){
            console.log(useradresses)
            res.render("youraddresses",{useradresses,user});
        }
        else{
            res.render("youraddresses");
        }
    }
})

router.get("/addaddress/:userid",async(req,res)=>{
    const user=req.session.user;
    res.render("updateaddress");
})
router.post("/addaddress",async(req,res)=>{
    const user=req.session.user;
    
    if(user){
        const newaddress=new YourAddresses({
            Full_Name:req.body.full_name,
            Mobile_Number:req.body.mobile_number,
            Pincode:req.body.pincode,
            Flat_Building_Company_HouseNo_Apartment:req.body.address,
            Area_Street_Sector_Village:req.body.street,
            Landmark:req.body.landmark,
            Town_City:req.body.city,
            State:req.body.state,
            user:user,
        })
        await newaddress.save();
        res.redirect("/profile");
    }
    else{
        res.redirect('/login');
    }
})


router.post("/submited",async(req,res)=>{
    const mobileno=req.body.mobile;
    const t=await YourModel.findOne({mobile:mobileno});
    if(t){
        res.send("User Already exists");
    }
    else{
        const password=req.body.password;

    try {

        const registration=new YourModel({
            name:req.body.name,
            mobile:req.body.mobile,
            address:req.body.address,
            password:await hashpassword(password),
            
            
        })
        await registration.save();
        res.redirect("./login");
        
        
    } catch (error) {
        res.send(`${error}`);
    }
}
})


router.get("/aboutus",(req,res)=>{
    res.render("aboutus");
})




router.get("/logout",async(req,res)=>{
    req.session.destroy(err=>{
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/login");
        }
    })
})
module.exports=router;