import mongoose from 'mongoose';

let orderSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    items:[
        {
            productId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Product',
                required:true
            },
            variantId:{
                type:mongoose.Schema.Types.ObjectId
            },
            quantity:{
                type:Number,
                required:true
            },
            price:{
                type:Number,
                required:true
            }
        }
    ],
    totalAmount:{
        type:Number,
        required:true
    },
    paymentId:{
        type:String,
        default: 'cash_on_delivery'
    },
    shippingAddress: {
        addressLine: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true }
    },
    status:{
        type:String,
        enum:['pending','paid','shipped','delivered','cancelled'],
        default:'pending'
    }
}, { timestamps: true })

export const Order=mongoose.model("Order",orderSchema)
