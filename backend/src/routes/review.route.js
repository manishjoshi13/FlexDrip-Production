import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { createReview, deleteReview, getProductReview} from "../controller/review.controller.js";
const reviewRouter=Router()

reviewRouter.post("/:productId/create",authenticate,createReview)
reviewRouter.get("/:productId",authenticate,getProductReview)
reviewRouter.delete("/:productId/delete/:reviewId",authenticate,deleteReview)

export default reviewRouter