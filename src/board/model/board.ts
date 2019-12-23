import { Schema, Document } from 'mongoose';
export const boardSchema = new Schema({
  title: String,
  storyNumAccum: Number,
  user: String,
  columns: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Column',
    },
  ],
});

// export interface IBoard extends Document {
//   title: string;
//   storyNumAccum: number;
//   user: string;
//   columns: Array<IColumn>;
// }
