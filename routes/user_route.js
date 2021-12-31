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
import  googleAuth2 from 'passport-google-oauth2'
import cookieParser from 'cookie-parser';
const local = passportLocal.Strategy
const GoogleStrategy = googleAuth2.Strategy

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




  passport.use(new GoogleStrategy({
    clientID:     '356737417987-o0ijgbhfm1ukos78i0omdmqgtto1a7h4.apps.googleusercontent.com',
    clientSecret: 'D-nXCyzoUBhmtU0DBwl14Y5f',
    callbackURL: "http://localhost:8000/user/auth/google/callback",
    passReqToCallback   : true
  },
   function(request, accessToken, refreshToken, profile, done) {
    userModel.findOne({ google_id : profile.id },async function (err, user) {
      if(user == null ){
        const user  = await  userModel.create({google_id : profile.id})
        return done( err ,  user)
      }
      return done(err, user);
    });
  }
));


router.get('/auth/google',
  passport.authenticate('google', { scope:
      [ 'profile' ] }
));

router.get('/googleAuth/register' , (req  ,res)=> {
  res.send('err')
})

router.get( '/auth/google/callback',
    passport.authenticate( 'google', {failureRedirect: '/user/googleAuth/register' }) , user.google_auth);


  router.use(express.json())

router.use(passport.initialize());
router.use(passport.session());

passport.use(new local(
    function(username, password, done) {
      userModel.findOne({ username: username }, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
      console.log(user.redirect)
        return done(null, user);
      });
    }
  ));

  passport.deserializeUser(function(id, done) {
    userModel.findById(id, function(err, user) {
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


const isAdmin = (req ,res , next) => {
  if (req.isAuthenticated()) {
    return next();
}
res.redirect("/error");
}

router.get('/', user.home);
router.get('/register', user.registered);
router.post('/register', user.registering); 
router.get('/cart' , isAdmin, user.get_cart)
router.get('/login', user.login_get);
router.post('/addtocart', user.post_addtocart)
router.get('/products' , user.get_allProducts) 
router.post('/login', passport.authenticate('local', { failureRedirect: 'login' }),
user.login_post
);
router.get('/dashboard' , Tokenauth , user.dashboard_get)
router.get('/logout', Tokenauth,  user.logout);

export default router;