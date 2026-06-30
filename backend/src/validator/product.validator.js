import {body,validationResult} from "express-validator" 

import { handleValidationErrors } from "./auth.validator.js"



export const validateCreateProduct = [
    body('title').trim().notEmpty().withMessage("Title is required"),
    body('description').trim().notEmpty().withMessage("Description is required"),
    body('priceAmount').trim().notEmpty().withMessage("Price amount is required").isNumeric().withMessage("Price amount must be a number"),
    body('priceCurrency').trim().notEmpty().withMessage("Price currency is required"),
    handleValidationErrors
]