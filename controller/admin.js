const router = require("express").Router();
require('dotenv').config();
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const Product = require("../model/product");
const  Categories = require("../model/categories");

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// middleware to authenticate the user
const authenticate=async(req , res, next)=>{
    try{
        const decoded = await jwt.verify(
            // requesting the token from the header to authenticate
            req.headers.authorization,
            process.env.JWT_SECRET_KEY
        );
        // console.log("----------decoded :",decoded);
      
        if (decoded) {
            const data = await User.findOne({_id:decoded.id});
            // console.log(data);
            if(data.role === 2)
            {
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


// create new Admin
router.get("/create",authenticate ,(req,res)=>{
    const {name , pass , email , gender , address , phone_number} = req.body;
    if( email !== "" && pass !== "")
    {
        const data = new Product({name:name , email: email , pass:pass , gender:gender ,address:address , phone_number:phone_number});
        data.save();
        res.send(data);
    }else{
        res.send("not register");
    }
});

// add fields categorise
router.post("/addCategorise",authenticate,async (req,res)=>{
    const { c_name } = req.body;
    if(c_name !=="")
    {
        const data = await Categories({c_name:c_name});
        data.save();
        res.json(data);
    }else{
        res.send("not added");
    }
})

// add productes according to categories
router.post("/addProductes",authenticate , async(req, res)=>{
    const {p_name , price , categories ,description , image, color , size} = req.body;
    if(categories !== "")
    {
        const data = await Product({p_name:p_name ,price: price ,categories: categories ,description:description , image:image,color: color ,size: size});
        data.save();
        res.json(data);
    }else{
        res.send("product can not listed")
    }
})

// search & view by categories id
router.get("/searchCategoriesItem",authenticate , async(req, res)=>{
    const {id} = req.body;
    if(id !=="")
    {
        const data= await Product.find({categories:id});    
        res.json(data);
    }else{
        res.send("item not matched");
    }
})

// update the items
router.post("/updateItems",authenticate , async(req, res)=>{
    const {p_name , price , categories ,description , image, color , size} = req.body;
    if(p_name !== "")
    {
        const data= await Product.updateOne({categories:categories},{$set:{p_name:p_name ,price: price ,categories: categories ,description:description , image:image,color: color ,size: size}});    
        res.json(data);
    }else{
        res.send("item not matched");
    }
})


// delete items
router.post("/deleteItems", authenticate ,async(req, res)=>{
    const {id} = req.body;
    if(id)
    {
        const data = await Product.deleteOne({_id:id});
        res.send("sucessfully deleted"); 
    }else{
        res.send("not found");
    }
})

// delete categories
router.post("/delCat", authenticate ,async(req,res)=>{
    const {id} = req.body;
    if(id)
    {
        const data = await Categories.deleteOne({_id:id});
        res.send("successfully deleted");
    }else{
        res.send("not found");
    }
})


// update categories
router.post("/updateCat", authenticate ,async(req, res)=>{
    const {id ,c_name ,type}=req.body;
    if(id)
    {
        const data = await Categories.updateOne({_id:id},{$set:{c_name:c_name,type:type}})
        res.json(data);
    }else{
        res.send("not found");
    }
})


module.exports = router;