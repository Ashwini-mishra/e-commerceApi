const mongoose = require("mongoose");
const Schema = mongoose.Schema

mongoose.connect("mongodb://localhost:27017/myCart",{
    useNewUrlParser: true,
}).then(()=>console.log("Categories DataBase is Connected"))
.catch((err)=> console.log(err.message))


const Categories = mongoose.model(
    "categories",
   new Schema({
    c_name:{ type:String , required:true},
    type:{type:Number, default:true}
   })
)

module.exports = Categories;