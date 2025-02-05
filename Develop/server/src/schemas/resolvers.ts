import {User, Review} from '../models/index.js'

import {signToken, AuthenticationError} from '../utils/auth.js';
console.log('jacob wz here')

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
  };
}

interface UpdateReviewArgs {
  reviewId: string;
  comment: string;
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
     // Get all reviews for a specific park
     getParkReviews: async (_parent: any, { parkId }: ReviewArgs) => {
  const reviews = await Review.find({ parkId }).sort({ createdAt: -1 });
  

  return reviews.map(review => ({
    ...review.toObject(),
    comment: review.comment || "No review content available.", // Ensure comment is never null
     rating: review.rating,
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

        savePark: async (_parent: any, { input }: ParkArgs, context: any) => {
            if (!context.user) {
                throw new AuthenticationError('You need to be logged in');
            }
            const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                {
                    $push: { savedParks: input }

                },
                { new: true }
            ).populate('savedParks');

            return updatedUser;
        },
        removePark: async (_parent: any, { parkId }: { parkId: string }, context: any) => {
            if (!context.user) {
                throw new AuthenticationError('You need to be logged in');
            }
            if (!parkId) {
                throw new Error('parkId is undefined');
            }
            try {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedParks: { parkId: parkId } } },
                    { new: true }
                ).populate('savedParks');
                return updatedUser;
            } catch (error) {
                console.error('Error removing park:', error);
                throw new Error('Failed to remove park');
            }
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
          });
            return {
        ...review.toObject(),
        comment: review.comment // Ensure returned field is `content`
      };
        },
            updateReview: async (_parent: any, { reviewId, comment }: UpdateReviewArgs, context: any) => {
          if (!context.user) {
            throw new AuthenticationError('You need to be logged in.');
          }
          const review = await Review.findOneAndUpdate(
            { _id: reviewId, userId: context.user._id },
            { comment:comment },
            { new: true }
          );
          if (!review) {
            throw new Error('Review not found or unauthorized.');
          }
            return {
        ...review.toObject(),
        comment: review.comment // Ensure returned field is `content`
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
  },
}

export default resolvers;