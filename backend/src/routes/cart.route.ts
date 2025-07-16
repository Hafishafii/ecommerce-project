import express from 'express'
import { authMiddleware } from '../middlewares/auth.middleware';
import { addToCart, getCart, removeFromCart, updateCart } from '../controllers/cart.controller';

const router = express.Router()

router.get('/', authMiddleware, getCart)

router.post('/', authMiddleware, addToCart)

router.delete('/:productId', authMiddleware, removeFromCart)

router.put('/', authMiddleware, updateCart)


export default router;