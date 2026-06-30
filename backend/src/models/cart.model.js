import mongoose from 'mongoose'
let cartSchema= new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    items:[
        {
            productId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Product'
            },
            variantId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Variant'
            },
            quantity:{
                type:Number,
                default:1
            }
        }
    ]
})

let Cart =mongoose.model("Cart",cartSchema)

export default Cart