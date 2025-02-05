import { Schema, type Document } from 'mongoose';

export interface ParkDocument extends Document {
  parkId: string;
  fullName: string;
  states: string;
  description: string;
  images: string;
}

// This is a subdocument schema, it won't become its own model but we'll use it as the schema for the User's `savedParks` array in User.js
const parkSchema = new Schema<ParkDocument>({
  parkId: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  states: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: {
    type: String,
  },
});

export default parkSchema;
