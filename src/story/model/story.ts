import { Schema, Document } from 'mongoose';

export const storySchema = new Schema({
  title: String,
  description: String,
  storyNumber: Number,
  user: String
});

export interface IStory extends Document {
  title: string;
  description: string;
  storyNumber: number;
  user: string;
}
