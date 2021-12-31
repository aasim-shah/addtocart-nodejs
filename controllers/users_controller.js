import userModel from "../models/userModel.js";
import productModel from "../models/productsModel.js";
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



    async  google_auth(req ,res) {
        res.send('login')
    }


    

    async  dashboard_get(req ,res) {
      res.render('home')
    }

    async  logout(req ,res) {
        res.clearCookie('jwt_Token')
        res.redirect('/user/login')
    }

    async get_allProducts (req , res) {

        const products = await productModel.find()
        res.render('allProducts' , {products})
      
      }

      async get_cart(req , res)  {
        res.render('cartPage' , {d : req.session.cart})
      }

    async post_addtocart(req ,res){
        if(!req.session.cart){
          req.session.cart = {
            items : {},
            totalQty : 0,
            totalPrice : 0
          }
        }
        let cart = req.session.cart
      if(!cart.items[req.body._id]){
      cart.items[req.body._id] = {
        item : req.body,
        Qty : 1,
      }
        cart.totalQty = cart.totalQty + 1
      
      }else{
        cart.items[req.body._id].Qty = cart.items[req.body._id].Qty + 1
        cart.totalQty = cart.totalQty + 1
      }
      
      res.send({totalQty: req.session.cart.totalQty})
      
      };
      
}
export default users