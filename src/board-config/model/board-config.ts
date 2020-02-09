import { Schema, Document } from 'mongoose';

export const boardConfigSchema = new Schema({
  user: String,
  board: String,
  repos: [
    {
      name: String,
      url: String
    }
  ],
  tags: [
    {
      label: String,
      color: String
    }
  ]
});

export interface IBoardConfig extends Document {
  user: string;
  board: string;
  tags: Array<{ label: string; color: string }>;
  repos: Array<{ name: string; url: string }>;
}
