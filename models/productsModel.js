import mongoose from "mongoose";
import db from "../db/db.js";


const productSchema = mongoose.Schema({
    name  : String,
    price : String
    
})



const productModel = mongoose.model('products' , productSchema)
export default productModel 