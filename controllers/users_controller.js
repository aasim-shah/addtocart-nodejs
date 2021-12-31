import userModel from "../models/userModel.js";
import  Jwt  from 'jsonwebtoken';
import cookieParser from "cookie-parser";




class users {
    home(req ,res) {
        res.send('users homepage')
    }
    async  registering(req ,res) {
       let username = req.body.username;
       let password = req.body.password;
        const data = new userModel({
            username ,
            password
        })       
        const registed = await data.save()
        const regtoken = await data.Authuser()
        console.log(username)
        if(registed){
            res.redirect('login')

        }else{
            res.redirect('back')
        }
    }
    async  registered(req ,res) {
    
        res.render('register')
     }
    async  login_post(req ,res) {
        const Token = await req.user.Authuser()
        res.cookie('jwt_Token' , Token )
            res.redirect('dashboard')
    }
    async  login_get(req ,res) {
      res.render('login')
    }

    async  dashboard_get(req ,res) {
      res.render('home')
    }

    async  logout(req ,res) {
        res.clearCookie('jwt_Token')
        res.redirect('/user/login')
    }
    
}
export default users