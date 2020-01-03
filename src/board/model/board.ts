import { Schema, Document } from 'mongoose';
export const boardSchema = new Schema({
  title: String,
  storyNumAccum: Number,
  user: String,
  columns: [
    {
      title: String,
      stories: [
        {
          type: Schema.Types.ObjectId,
          ref: 'story'
        }
      ]
    }
  ]
});

export interface IBoard extends Document {
  title: string;
  storyNumAccum: number;
  user: string;
  columns: Array<string>;
}
