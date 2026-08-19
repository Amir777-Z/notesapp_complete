import mongoose, { ObjectId, Schema } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required!'],
        minLength: [2, "Name can't be a single character"]
    },
    email: {
        type: String,
        required: true,
        unique: [true, "An account with this email is already registered"],
        trim: true
    },
    hashedPassword: {
        type: String,
        required: [true, "Password is required"],
    },
    username:{
        type:String,
        required:[true, "A username is required"],
        minLength:[4, "Username must be at least 4 characters long"],
        maxLength:[10, "Username must be at most 10 characters long"]
    }
})


export const User= mongoose.model('User', userSchema)


