import mongoose, {Schema, Document} from "mongoose";

export interface Message extends Document {
    content: string;
    createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
    content: {
      type: String, 
      required: true
    },
    createdAt: {
      type: Date, 
      required: true,
      default: Date.now
    }
});


export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifiedCodeExpiry: Date;
    isAcceptingMessages: boolean;
    messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
    username: {
      type: String, 
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String, 
      required: true
    },
    password: {
      type: String, 
      required: true
    },
    verifyCode: {
      type: String, 
      required: true
    },
    verifiedCodeExpiry: {
      type: Date, 
      required: true
    },
    isAcceptingMessages: {
      type: Boolean, 
      required: true
    },
    messages: [MessageSchema]
});
