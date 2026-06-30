import { Router } from "express";
import { getAllProducts, getSinglePRoduct, getSimilarProducts, getTrendingProducts } from "../controller/buyer.controller.js";

const buyerRouter = Router()

buyerRouter.get("/",getAllProducts)  
buyerRouter.get("/trending",getTrendingProducts)  
buyerRouter.get("/:productId",getSinglePRoduct)  
buyerRouter.get('/:productId/similar',getSimilarProducts)

export default buyerRouter