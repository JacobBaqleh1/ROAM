import {User, Review} from '../models/index.js'
import AWS from "aws-sdk"
import {v4 as uuidv4} from "uuid"
import {signToken, AuthenticationError} from '../utils/auth.js';
import dotenv from "dotenv";

dotenv.config();


if (!process.env.AWS_ACCESS_KEY || !process.env.AWS_SECRET_KEY || !process.env.AWS_REGION) {
  throw new Error('Missing AWS configuration in environment variables.');
}

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});
interface UserArgs {
  username: string;
}

interface AddUserArgs {
  input: {
    username: string;
    email: string;
    password: string;
  };
}

interface LoginUserArgs {
  email: string;
  password: string;
}

interface ParkArgs {
    input: {
        parkId: string;
    };
}

interface ReviewArgs {
  parkId: string;
}

interface AddReviewArgs {
  input: {
    parkId: string;
    comment: string;
    parkFullName: string;
    image: string;
  };
}

interface UpdateReviewArgs {
  reviewId: string;
  comment: string;
  rating: number;
}

interface DeleteReviewArgs {
  reviewId: string;
}


const resolvers = {
    Query: {
        user: async(_parent:any, {username}:UserArgs) => {
            return User.findOne({username}).populate('savedParks')
        },
         me: async (_parent: any, _args: any, context: any): Promise<UserArgs | null> => {
      if (context.user) {
        return await User.findOne({ _id: context.user._id }).populate('savedParks');
      }
      throw new AuthenticationError('could not authenticate user.');
    },
    //get one persons reviews only
    getUserReviews: async (_parent: any, _args: any, context: any) => {
  if (!context.user) {
    throw new AuthenticationError('You need to be logged in.');
  }

  const reviews = await Review.find({ userId: context.user._id }).sort({ createdAt: -1 });

  return reviews.map(review => ({
    ...review.toObject(),
    comment: review.comment || "No review content available.",
    rating: review.rating,
    parkFullName: review.parkFullName,
    createdAt: review.createdAt
  }));
},

     // Get all reviews for a specific park
     getParkReviews: async (_parent: any, { parkId }: ReviewArgs) => {
  const reviews = await Review.find({ parkId }).sort({ createdAt: -1 });
  

  return reviews.map(review => ({
    ...review.toObject(),
    comment: review.comment || "No review content available.", // Ensure comment is never null
     rating: review.rating,
       parkFullName: review.parkFullName,
    image: review.image || "No image available.",
    createdAt: review.createdAt
  }));
},
//Get all reviews entirely
  getAllReviews: async(_parent: any, _args: any ) => {
    
  const reviews = await Review.find().sort({ createdAt: -1 });
    return reviews.map(review => ({
    ...review.toObject(),
    comment: review.comment || "No review content available.", 
    rating: review.rating,
    parkFullName: review.parkFullName,
    image: review.image || "No image available.",
    createdAt: review.createdAt
  }));
    
  },

//Get all parks for the user
  getSavedParks: async (_parent: any, _args: any, context: any) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in.');
      }
      const user = await User.findById(context.user._id).populate('savedParks');
      if (!user) {
        throw new Error('User not found.');
      }
      return user.savedParks;
    },

},
    
    Mutation: {
        addUser: async(_parent: any, {input}: AddUserArgs) => {
            const user = await User.create({...input});
            const token = signToken(user.username, user.email, user._id);
            return {token, user}
        },

        login: async(_parent:any,{email, password}: LoginUserArgs) => {
            const user = await User.findOne({email});
            if(!user){
                throw new AuthenticationError('could not authenticate user.');

            }
            const correctPw = await  user.isCorrectPassword(password);
            if(!correctPw){
                throw new AuthenticationError('could not authenticate user.')
            }
            const token = signToken(user.username, user.email, user._id);
            return {token, user}
        },

         savePark: async (_: any, { input }: ParkArgs, context: any) => {
  if (!context.user) {
    throw new AuthenticationError('You need to be logged in!');
  }

  const user = await User.findById(context.user._id);
  if (!user) {
    throw new AuthenticationError('User not found.');
  }

  if (!input) {
    throw new Error('Invalid park data.');
  }
  
  if (!input.parkId) {
    throw new Error('Invalid park id.');
  }

            const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id }, // Find the authenticated user
                {
                    $addToSet: { 
                        savedParks: input, 
                    },
                },
                { new: true } // Return the updated user document
            ).populate('savedParks'); // Optional: Populate  if they're references

            // Return the updated user 
            return updatedUser;
},
       removePark: async (_:any, { parkId }:any, context:any) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in!');
      }

      const user = await User.findByIdAndUpdate(
        context.user._id,
         { $pull: { savedParks: { parkId: parkId } } }, // Pull by matching parkId inside objects
    { new: true }
  ).populate('savedParks');

      return user;
    },
        addReview: async (_parent: any, { input }: AddReviewArgs, context: any) => {
          if (!context.user) {
            throw new AuthenticationError('You need to be logged in.');
          }
          const review = await Review.create({
            ...input,
              parkId: input.parkId,
        comment: input.comment, 
            userId: context.user._id,
            username: context.user.username,
            image: input.image,
            parkFullName: input.parkFullName,
          });
            return {
        ...review.toObject(),
        comment: review.comment // Ensure returned field is `content`
      };
        },
            updateReview: async (_parent: any, { reviewId, comment, rating}: UpdateReviewArgs, context: any) => {
          if (!context.user) {
            throw new AuthenticationError('You need to be logged in.');
          }
          const review = await Review.findOneAndUpdate(
            { _id: reviewId, userId: context.user._id },
            { comment, rating },
            { new: true }
          );
          if (!review) {
            throw new Error('Review not found or unauthorized.');
          }
            return {
        ...review.toObject(),
        comment: review.comment, // Ensure returned field is `content`
        rating: review.rating,
      };
        },
        deleteReview: async (_parent: any, { reviewId }: DeleteReviewArgs, context: any) => {
          if (!context.user) {
            throw new AuthenticationError('You need to be logged in.');
          }
          const review = await Review.findOneAndDelete({
            _id: reviewId,
            userId: context.user._id,
          });
          if (!review) {
            throw new Error('Review not found or unauthorized.');
          }
            return {
        ...review.toObject(),
        comment: review.comment // Ensure returned field is `content`
      };
    },
    generateSignedUrl: async(_: any, { fileType }: any) => {
      const fileName = `profile-pictures/${uuidv4()}.${fileType.split("/")[1]}`;

      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Expires: 60,
        ContentType: fileType,
        ACL: "public-read",

      };

      const signedUrl = await s3.getSignedUrlPromise("putObject", params);

      return { url: signedUrl}
    }
  },
}

export default resolvers;