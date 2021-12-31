import express  from 'express'
import products from '../controllers/product_controller.js'
const router = express.Router()
let product = new products()
router.get('/' , product.home)
router.get('/okay' , product.okay)


export default router