import { authenticate, buyerAuth } from "../middleware/auth.middleware.js";
import {getMyCart,addCartItem,removeCartItem,clearCart} from "../controller/cart.controller.js"
import { Router } from "express";
import {addToCartValidator} from "../validator/cart.validator.js"
let router=Router()


router.get("/",authenticate,buyerAuth,getMyCart)
router.post("/add",authenticate,buyerAuth,addToCartValidator,addCartItem)
router.delete("/remove",authenticate,buyerAuth,removeCartItem)
router.delete("/clear",authenticate,buyerAuth,clearCart)

export default router