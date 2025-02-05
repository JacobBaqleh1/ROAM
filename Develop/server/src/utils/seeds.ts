import mongoose from 'mongoose';
import  dotenv from 'dotenv';
dotenv.config();
console.log('✅ ENV Variables:', process.env.MONGODB_URI);
import db from '../config/connection.js'; // Ensure this is correct!
import User from '../models/User.js';
import Review from '../models/Review.js';


const seedDatabase = async () => {
  try {
     await db(); // Await the connection

    console.log('Database connected!');

    

    const users = await User.insertMany([
      { username: 'jacob', email: 'jacob@example.com', password: 'password123' },
      { username: 'frodo', email: 'frodo@example.com', password: 'password123' },
    ]);

    const reviews = [
      {
        parkId: 'B7FF43E5-3A95-4C8E-8DBE-72D8608D6588',
        userId: users[0]._id,
        username: users[0].username,
        comment: 'The Grand Canyon is absolutely breathtaking!',
         rating: 4,
      },
      {
        parkId: '7DC1050A-0DDE-4EF9-B777-3C9349BCC4DE',
        userId: users[1]._id,
        username: users[1].username,
        comment: 'Crater Lake is a must-visit! The water is so blue!',
         rating: 4,
      },
    ];

    await Review.insertMany(reviews);
    console.log('Seed data inserted successfully!');

    mongoose.connection.close(); // Close connection properly
    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    mongoose.connection.close();
    process.exit(1);
  }
};

seedDatabase();
