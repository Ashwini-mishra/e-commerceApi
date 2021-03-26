const mongoose = require("mongoose");
const Schema = mongoose.Schema

mongoose.connect("mongodb://localhost:27017/myCart",{
    useNewUrlParser: true,
}).then(()=>console.log("Product DataBase is Connected"))
.catch((err)=> console.log(err.message))


const Product = mongoose.model(
    "product",
   new Schema({
    p_name:{ type:String , required:true},
    description:{ type:String , required :true},
    price: { type:Number , required :true},
    image :{ type:String , required:true},
    color:{ type:String , required:true},
    size:{type:Number, required:true},
    categories:{type:String , required:true}
   })
)

module.exports = Product;