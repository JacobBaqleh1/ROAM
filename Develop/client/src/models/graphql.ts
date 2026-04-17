// GraphQL response type interfaces — mirrors the server-side schema

export interface GQLImage {
  url: string;
  altText?: string;
  credit?: string;
}

export interface GQLPark {
  parkId: string;
  fullName: string;
  description: string;
  images: GQLImage[];
  states: string;
}

export interface GQLReview {
  _id: string;
  parkId: string;
  parkFullName?: string;
  userId: string;
  username: string;
  rating: number;
  comment: string;
  image?: string;
  createdAt: string;
}

export interface GQLUser {
  _id: string;
  username: string;
  email: string;
  parkCount: number;
  savedParks: GQLPark[];
}

export interface GQLAuth {
  token: string;
  user: GQLUser;
}

export interface GQLSignedUrl {
  url: string;
}

// Query return shapes
export interface GetAllReviewsData {
  getAllReviews: GQLReview[];
}

export interface GetParkReviewsData {
  getParkReviews: GQLReview[];
}

export interface GetSavedParksData {
  getSavedParks: GQLPark[];
}

export interface GetUserReviewsData {
  getUserReviews: GQLReview[];
}

export interface MeData {
  me: GQLUser;
}
