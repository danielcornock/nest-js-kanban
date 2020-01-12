import { Schema, Document } from 'mongoose';

export const userSchema = new Schema({
  name: { type: String },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: { type: String, select: false }
});

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
}
