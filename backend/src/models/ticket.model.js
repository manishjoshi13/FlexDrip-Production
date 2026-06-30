import mongoose from 'mongoose'

const ticketSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    orderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Order'
    },
    sellerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    issueType:{
        type:String,
        enum:["ORDER_ISSUE","PAYMENT_ISSUE","DELIVERY_ISSUE","OTHER"],
        default:"OTHER"
    },
    description:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:["OPEN","CLOSED"],
        default:"OPEN"
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        default:Date.now
    }
})

export default mongoose.model("Ticket",ticketSchema)
