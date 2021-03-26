const router = require("express").Router();
require('dotenv').config();
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const WishList = require("../model/wishList");
const Mycart =require("../model/myCart");
const Product = require("../model/product");
const Orders = require("../model/oders");

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());


// jwt authentication
const authenticate=(req , res, next)=>{
    try{
        const decoded = jwt.verify(
            // requesting the token from the header to authenticate
            req.headers.authorization,
            process.env.JWT_SECRET_KEY
        );
        if (decoded) {
            const data = User.findOne({_id:decoded.id});
            // console.log(data._conditions._id);
            if(data)
            {
                req.body.id=data._conditions._id;
                next();
            }else{
                res.send("only admin have the permission to access");
            }
        }else{
            return res.send("Unauthenticated User");
        }
        
      } catch (err) {
        //   console.log(err)
        return res.send(err.message);
      }
}

// token
const generateAccessToken = (id) => {
    return jwt.sign({ id }, `${process.env.JWT_SECRET_KEY}`);
  };


// create user
router.post("/create",(req , res)=>{
    const {name , pass , email , gender , address ,phone_number} = req.body;
    if( email !== "" && pass !== "")
    {
        const data = new User({name:name , email: email , pass:pass , gender:gender , address:address , phone_number:phone_number});
        data.save();
        res.send(data);
    }else{
        res.send("not register");
    }
})


// login User
router.post("/login" ,async(req,res)=>{
    const {email , pass} = req.body;
     const data = await User.findOne({email});
     if(data)
     {
         const token = await generateAccessToken(data._id);
         res.send(token);
     }else{
         res.send("Un authenticated User");
     }
})


// wishList
router.post("/wishList",authenticate,async(req,res)=>{
    const user = await WishList.findOne({user_id:req.body.id});
    const {product_id} = req.body;
    if(!user)
    {
        const data = await WishList({user_id:req.body.id , product_id:product_id});
        data.save();
        res.send("Added to wishList");
    }else{
        if(user.product_id.indexOf(product_id) == -1)
        {
        await user.product_id.push(product_id);
        await user.save();
        res.send("inserted");
        }else{
            res.send("already inserted")
        }
    }
})

// display wishList
router.get("/dispWishList",authenticate,async(req ,res)=>{
    const user=req.body.id;
    if(user)
    {
        const data = await WishList.findOne({user_id:user});
        if(data)
        {
            let arr=[];
            for(let i=0;i<data.product_id.length;i++)
            {
                let pro = data.product_id[i];
                let product=await Product.findOne({_id : pro});
                arr.push(product);
            }
            res.json(arr);
        }else{
            res.send("nothing in a wishList");
        }
    }else{
        res.send("Data not found");
    }
})


// display single product
router.get("/product/:product_id", authenticate ,async(req,res) =>{
    let id = req.params.product_id;
    let data = await Product.findOne({ _id : id });
    if(data)
    {
        res.send(data);

    }else{
        res.send("not found");
    }
})


// delete wishList
router.delete("/deleteWishList/",authenticate ,async(req , res)=>{
    const product_id = req.query.productId;
    const user = req.body.id;

    let data = await WishList.findOne({user_id:user});

    let index = data.product_id.indexOf(product_id);

    if(index)
    {
    data.product_id.splice(0,index);
    data.save();
    res.send("deleted");
    }else{
        res.send("data not found");
    }
})


// // Add to cart
router.post("/addtoCart",authenticate,async(req,res)=>{
    const products=[];
    const mycart = await Mycart.findOne({user_id:req.body.id});
    const {product_id,quantity} = req.body;
    
    if(!mycart)
    {
        if(product_id !=="")
        {
            const product = await Product.findOne({_id : product_id})

            products.push({ product_id:product_id, price:product.price, quantity:quantity });
            const user_id=req.body.id;

            const data = await Mycart({ user_id:user_id, products:products });
            data.save();
            res.send("Added to cart");
        }else{
            res.send("product is empty")
        }
    }else{

        const pro=mycart.products.find((element)=>{
            return element.product_id.includes(req.body.product_id); 
        })

        if(!pro)
        { 
            const product = await Product.findOne({_id : product_id})
            await mycart.products.push({product_id:product_id, price:product.price, quantity:quantity });
            await mycart.save();
            res.send("inserted");
        }else{
            res.send("already in a cart");
        }
    }
})


// display cart
router.get("/dispMyCart",authenticate ,async (req,res)=>{
    const user = req.body.id;
    const userCart = await Mycart.findOne({user_id: user});

    if(userCart)
    {
        let arr=[];
        for(let i=0;i<userCart.products.length;i++)
        {
            let pro = userCart.products[i].product_id;
            let product=await Product.findOne({_id : pro});
            arr.push(product);
        }
        res.json(arr);
    }else{
        res.send("nothing in a wishList");
    }
})

// delete the cart
router.delete("/deleteCart",authenticate,async(req,res)=>{
    const product_id = req.query.productId;
    const user = req.body.id;
    let data = await Mycart.findOne({user_id:user});
    for(let i in data.products)
    {
        if(data.products[i].product_id.includes(product_id))
        {
            data.products.splice(0,i);
            data.save();
            res.send("deleted");
        }else{
            res.send("data not found");
        }
    }
})

// update myCart
router.put("/updateCart/",authenticate ,async(req,res)=>{
    const quantity = req.query.quantity;
    const product_id = req.query.productId;
    const user = req.body.id;
    const mycart = await Mycart.findOne({user_id:user});
    for(let i in mycart.products)
    { 
        if(mycart.products[i].product_id.includes(product_id))
        {   
            mycart.products[i].quantity= quantity;
            mycart.save();
            res.send("updated")
        }else{
            console.log("data not found");
        }
    }
})

// drop cart
router.delete("/dropCart",authenticate,async(req,res)=>{
    const user = req.body.id;
    const categ = await Mycart.findOneAndDelete({user_id:user});
    res.send(categ);
})

//Order ckeckOut Api
router.post("/order", authenticate,async (req,res)=>{
    const user = req.body.id;
    const data = await Orders({...req.body,user_id:user});
    data.save();
    res.send(data);
})

// get the information about order
router.get("/order",authenticate,async(req,res)=>{
    const user = req.body.id;
    const data = await Orders.find({user_id:user});
    res.send(data);
})

module.exports = router;