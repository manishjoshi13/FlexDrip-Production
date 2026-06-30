import { ExpressValidator, body } from "express-validator";
import { handleValidationErrors } from "./auth.validator.js";

export const addToCartValidator = [
    body("productId").notEmpty().withMessage("Product ID is required"),
    body("variantId").optional().notEmpty().withMessage("Variant ID is required"),
    body("quantity").notEmpty().withMessage("Quantity is required").isNumeric().withMessage("Quantity must be a number"),
    handleValidationErrors
]