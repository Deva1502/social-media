import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    user:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
    latestMessage:{
        tyoe:String,
        sender:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    },
},
{timestamps:true}
);
const chatModel = mongoose.model("Chat",chatSchema);
export default chatModel    