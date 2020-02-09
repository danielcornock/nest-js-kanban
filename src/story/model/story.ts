import { Schema, Document } from 'mongoose';

export const storySchema = new Schema({
  title: String,
  description: String,
  storyNumber: Number,
  user: String,
  commit: {
    message: String,
    id: String,
    author: String,
    url: String
  },
  tags: [
    {
      label: String,
      color: String
    }
  ]
});

export interface IStory extends Document {
  title: string;
  description: string;
  storyNumber: number;
  user: string;
  commit?: IStoryCommit;
}

export interface IStoryCommit {
  message: string;
  id: string;
  author: string;
  url: string;
}
