import express from 'express'
import upload from '../middleware/upload.middleware.js'
import { createProduct, getMyProducts, getProductById, updateProduct, deleteProduct, addProductVariant, updateProductVariant, deleteProductVariant } from '../controller/product.controller.js'
import { sellerAuth, authenticate } from '../middleware/auth.middleware.js'
import { validateCreateProduct } from '../validator/product.validator.js'

const productRouter = express.Router()

productRouter.post('/create',authenticate,sellerAuth,upload.array('images',7),validateCreateProduct,createProduct)
productRouter.get('/myproducts',authenticate,sellerAuth,getMyProducts)
productRouter.get('/details/:id',authenticate,getProductById)
productRouter.put('/update/:id',authenticate,sellerAuth,upload.array('images',7),validateCreateProduct,updateProduct)
productRouter.delete('/delete/:id',authenticate,sellerAuth,deleteProduct)

// Individual variant operations
productRouter.post('/:id/variants', authenticate, sellerAuth, addProductVariant)

productRouter.put('/:id/variants/:variantId', authenticate, sellerAuth, updateProductVariant)
productRouter.delete('/:id/variants/:variantId', authenticate, sellerAuth, deleteProductVariant)

export default productRouter
