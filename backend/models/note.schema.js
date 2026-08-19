import mongoose, { ObjectId, Schema, Types } from "mongoose";

const noteSchema= new Schema({
    title:{
        type:String,
        required:[true, 'Title for note is required'],
    },
    author:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    content:{
        type:String,
        required:[true, "Note's content cannot be empty"]
    },

},
{
    timestamps:{createdAt:'createdAt'}
})

export const Note= mongoose.model('Note', noteSchema)