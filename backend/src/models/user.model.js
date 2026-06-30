import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        trim:true,
        required: true
    },
    email: {
        type: String,
        trim:true,
        required: true,
        unique: true,
        lowercase:true
    },
    password: {
        type: String,
        required: function(){
            return this.googleLogin==false;
        },
        select:false
    },
    phone:{
        type:Number,
        minlength:10,
        maxlength:10,
        required:function(){
            return this.googleLogin==false;
        },
        trim:true
    },
    role:{
        type:String,
        enum:["buyer","seller"],
        default:"buyer"
    },
    googleLogin:{
        type:Boolean,
        default:false,
        select:false
    },
    profileCompleted:{
        type:Boolean,
        default:false
    }
    
},{timestamps:true})

export const User = mongoose.model("User", userSchema);