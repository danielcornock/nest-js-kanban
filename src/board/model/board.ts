import { Schema, Document } from 'mongoose';
export const boardSchema = new Schema({
  title: String,
  storyNumAccum: {
    type: Number,
    default: 0,
    select: false
  },
  user: String,
  columns: [
    {
      title: String,
      stories: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Story'
        }
      ]
    }
  ]
});

export interface IBoard extends Document {
  title: string;
  storyNumAccum?: number;
  user: string;
  columns: Array<string>;
}
