import { Schema, model, type Document } from 'mongoose';
import bcrypt from 'bcrypt';


export interface ParkDocument extends Document {
   parkId: string;
  fullName: string;
  images: {
    url: string;
    title?: string;
    altText?: string;
    caption?: string;
    credit?: string;
  }[];
  description: string;
  states: string;
}

export interface UserDocument extends Document {
  id: string;
  username: string;
  email: string;
  password: string;
  savedParks: ParkDocument[];
  isCorrectPassword(password: string): Promise<boolean>;
  parkCount: number;
}

const imageSchema = new Schema({
  url: { type: String, required: true },
  title: String,
  altText: String,
  caption: String,
  credit: String
});

const savedParkSchema = new Schema(
  {
  parkId: {
     type: String,
      required: true 
    },
  fullName: String,
  description: {
      type: String,
      required: false, // Optional; change to true if you want to make it mandatory
    },
 images: [imageSchema],

  states: {
    type: String
  }
  }
);

const userSchema = new Schema<UserDocument>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Must use a valid email address'],
    },
    password: {
      type: String,
      required: true,
    },
    // set savedParks to be an array of data that adheres to the parkSchema
    savedParks: [savedParkSchema],
  },
  // set this to use virtual below
  {
    toJSON: {
      virtuals: true,
    },
  }
);

// hash user password
userSchema.pre<UserDocument>('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

// custom method to compare and validate password for logging in
userSchema.methods.isCorrectPassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

// when we query a user, we'll also get another field called `parkCount` with the number of saved books we have
userSchema.virtual('parkCount').get(function () {
  return this.savedParks.length;
});

const User = model<UserDocument>('User', userSchema);

export default User;
