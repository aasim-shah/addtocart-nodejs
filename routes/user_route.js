import  express, { urlencoded }  from 'express';
import users from '../controllers/users_controller.js'
import passport  from 'passport';
import flash from 'express-flash';
import MongoStore from 'connect-mongo';
import  Jwt from 'jsonwebtoken';
import session from 'express-session';
import  userModel from '../models/userModel.js';
import  productModel from '../models/productsModel.js';
import passportLocal from 'passport-local';
import cookieParser from 'cookie-parser';
const local = passportLocal.Strategy


const router = express.Router()
router.use(urlencoded({extended : false}))
router.use(flash())
router.use(cookieParser())
const user = new users()
router.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store : MongoStore.create({mongoUrl : 'mongodb://localhost:27017/ecomm' , collectionName : 'sessions'}),
    cookie: { maxAge : 1000 * 60 * 60 * 24 }
  }))



  router.use(express.json())

router.use(passport.initialize());
router.use(passport.session());

passport.use(new local(
    function(username, password, done) {
      userModel.findOne({ username: username }, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
      
        return done(null, user);
      });
    }
  ));

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  
//jwt verfication 
 
const Tokenauth = async (req ,res , next)=>{
 try {
  const token = req.cookies.jwt_Token
  const verfiy = await Jwt.verify(token , 'mysupersecret')
  const verfified_user = await userModel.findById(verfiy._id)
  req.user = verfified_user
  next()
 } catch (error) {
   console.log(error)
   res.redirect('/login')
 }
} 


router.use((req , res , next)=>{
res.locals.session = req.session
  next()
})



router.get('/', user.home);
router.get('/register', user.registered);
router.post('/register', user.registering); 
router.get('/cart' , async (req , res) => {
  res.render('cartPage' , {d : req.session.cart})
})
router.get('/login', user.login_get);
router.post('/get', async(req ,res) => {
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

});

router.get('/products' ,async (req , res) => {

  const products = await productModel.find()
  res.render('allProducts' , {products})

})
router.post('/login', passport.authenticate('local', { failureRedirect: 'login' }),
user.login_post
);
router.get('/dashboard' , Tokenauth , user.dashboard_get)
router.get('/logout', Tokenauth,  user.logout);

export default router;