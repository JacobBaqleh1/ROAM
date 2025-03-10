import {Schema , model, type Document} from 'mongoose';

export interface ReviewDocument extends Document {
    parkId: string;
    userId: string;
    username: string;
    rating: number;
    comment: string;
    createdAt: Date;
    parkFullName:  String;
    image: String;

}

const reviewSchema = new Schema(
    {
  parkId: {
     type: String,
      required: true 
    },
  userId: {
     type: Schema.Types.ObjectId,
      ref: 'User',
       required: true
     },
  username: String,
  rating: {
     type: Number, 
     required: true,
      min: 1, 
      max: 5 
    },
    parkFullName: {
       type: String,
      required: true,
     },
    image: {
      type: String
    },
  comment: String,
  createdAt: { 
    type: Date, 
    default: Date.now 
},
});

const Review = model('Review', reviewSchema);

export default Review;