const mongoose = require("mongoose");
const Schema=mongoose.Schema;
mongoose.connect("mongodb://localhost:27017/myCart",{
    useNewUrlParser: true,
}).then(()=>console.log("myCart DataBase is Connected"))
.catch((err)=> console.log(err.message))


const Mycart = mongoose.model(
    "cart",
   new Schema({
    user_id:{ type:String , required:true},
    products:{ type:Array , required:true,
            product_id:{type:String, required:true},
            price:{type:Number , required:true},
            quantity:{type:Number , required:true}
        }
   })
)

module.exports= Mycart;