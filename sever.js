import express from 'express'
import ejs from 'ejs'
import userRoute from './routes/user_route.js'
import productRoute from './routes/product_route.js'
import apps from './controllers/appController.js'
import db from './db/db.js'
const app = express()
const port = process.env.port || 8000
app.use('/user' , userRoute)
app.use('/product' , productRoute)
app.set('view engine' , 'ejs')
app.use(express.json())
const home = new apps()
app.get('/' , home.home)


app.listen(port , ()=> {
    console.log('server is running on 8000')
})