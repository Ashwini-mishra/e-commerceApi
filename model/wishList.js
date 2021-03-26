const mongoose = require("mongoose");
const Schema=mongoose.Schema;
mongoose.connect("mongodb://localhost:27017/myCart",{
    useNewUrlParser: true,
}).then(()=>console.log("Wishlist DataBase is Connected"))
.catch((err)=> console.log(err.message))


const WishList = mongoose.model(
    "wish",
   new Schema({
    user_id:{ type:String , required:true},
    product_id:{type:Array, required:true}
   })
)

module.exports= WishList;