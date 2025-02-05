import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI ='mongodb+srv://jacob:WgUVTHKQwcqgcxHU@cluster0.ecsx96s.mongodb.net/roam?retryWrites=true&w=majority&appName=Cluster0';

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is missing in .env file!');
  process.exit(1);
}

const db = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: 'roam', 
      
    });
    console.log('✅ Database connected successfully!');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

export default db;
