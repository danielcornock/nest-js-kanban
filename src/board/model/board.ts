import { Schema, Document } from 'mongoose';
export const boardSchema = new Schema(
  {
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

boardSchema.virtual('config', {
  ref: 'BoardConfig',
  foreignField: 'board',
  localField: '_id',
  justOne: true
});

export interface IBoard extends Document {
  title: string;
  storyNumAccum?: number;
  user: string;
  columns: Array<IColumn>;
  config: string;
}

export interface IColumn extends Document {
  title: string;
  stories: Array<string>;
}
