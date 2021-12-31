import mongoose from "mongoose";
import jwt from 'jsonwebtoken'
import db from "../db/db.js";


const userSchema = mongoose.Schema({
    username : String,
    password : String,
    google_id : String,
    tokens : [{
        token : String,
    }]
})

userSchema.methods.Authuser = async function(){
    const token = jwt.sign({_id : this.id} , 'mysupersecret')
    this.tokens = this.tokens.concat({token : token})
    await this.save()
    return token;
}




const userModel = mongoose.model('user' , userSchema)
export default userModel 