import mongoose from 'mongoose'

let reviewSchema=new mongoose.Schema({
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required:true
    },
    buyerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    rating:{
        type:Number,
        required:true,
        min:1,
        max:5
    },
    comment:{
        type:String,
        trim:true,
        required:true
    },
    isVerifiedBuyer:{
        type:Boolean,
        default:false
    },
    
    
},{timestamps:true})

export const Review=mongoose.model("Review",reviewSchema)