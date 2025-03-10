import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import db from '../config/connection.js';
import User from '../models/User.js';
import Review from '../models/Review.js';

const seedDatabase = async () => {
  try {
    await db();
    console.log('Database connected!');

    // Clear the collections
    await User.deleteMany({});
    await Review.deleteMany({});
    console.log('Collections cleared!');

    const users = await User.insertMany([
      { username: 'jacob', email: 'jacob@example.com', password: 'password123' },
      { username: 'the frodo', email: 'frodo@example.com', password: 'password123' },
      { username: 'samwise', email: 'sam@example.com', password: 'password123' },
      { username: 'aragorn', email: 'aragorn@example.com', password: 'password123' },
      { username: 'legolas', email: 'legolas@example.com', password: 'password123' },
      { username: 'gimli', email: 'gimli@example.com', password: 'password123' },
      { username: 'gandalf', email: 'gandalf@example.com', password: 'password123' },
      { username: 'boromir', email: 'boromir@example.com', password: 'password123' },
      { username: 'merry', email: 'merry@example.com', password: 'password123' },
      { username: 'pippin', email: 'pippin@example.com', password: 'password123' },
      { username: 'bilbo', email: 'bilbo@example.com', password: 'password123' },
      { username: 'elrond', email: 'elrond@example.com', password: 'password123' },
      { username: 'arwen', email: 'arwen@example.com', password: 'password123' },
      { username: 'eowyn', email: 'eowyn@example.com', password: 'password123' },
      { username: 'faramir', email: 'faramir@example.com', password: 'password123' },
      { username: 'thorin', email: 'thorin@example.com', password: 'password123' },
    ]);

    const reviews = [
  { 
    parkId: 'B7FF43E5-3A95-4C8E-8DBE-72D8608D6588', 
    userId: users[0]._id, 
    username: users[0].username, 
    comment: 'The Grand Canyon is absolutely breathtaking!', 
    rating: 5, 
    image: 'https://www.nps.gov/common/uploads/structured_data/3C7B12D1-1DD8-B71B-0BCE0712F9CEA155.jpg', 
    parkFullName: 'Grand Canyon National Park' 
  },
  { 
    parkId: '7DC1050A-0DDE-4EF9-B777-3C9349BCC4DE', 
    userId: users[1]._id, 
    username: users[1].username, 
    comment: 'Crater Lake is a must-visit! The water is so blue!', 
    rating: 5, 
    image: 'https://www.nps.gov/common/uploads/structured_data/3C7B227E-1DD8-B71B-0BEECDD24771C381.jpg', 
    parkFullName: 'Crater Lake National Park' 
  },
  { 
    parkId: 'C9A9FF7A-BE78-4C76-BBB6-2EBDEDD59946', 
    userId: users[2]._id, 
    username: users[2].username, 
    comment: 'Yellowstone is full of adventure! Geysers everywhere!', 
    rating: 5, 
    image: 'https://www.nps.gov/common/uploads/structured_data/3C7D5920-1DD8-B71B-0B83F012ED802CEA.jpg', 
    parkFullName: 'Yellowstone National Park' 
  },
  { 
    parkId: 'E9C6B1A5-FB76-4C3B-9204-3B0D6EB7B8AA', 
    userId: users[3]._id, 
    username: users[3].username, 
    comment: 'Yosemite’s waterfalls are unreal!', 
    rating: 4, 
    image: 'https://www.nps.gov/common/uploads/structured_data/3C84CC4C-1DD8-B71B-0BE967E5E5D93F25.jpg', 
    parkFullName: 'Yosemite National Park' 
  },
  { 
    parkId: 'AB8FA3CD-609A-4F51-93B3-349AE21FD69F', 
    userId: users[4]._id, 
    username: users[4].username, 
    comment: 'Rocky Mountain NP has some of the best hiking trails!', 
    rating: 5, 
    image: 'https://www.nps.gov/common/uploads/structured_data/954C9561-FCDC-84F9-92D5189401582A8E.jpg', 
    parkFullName: 'Rocky Mountain National Park' 
  },
  { 
    parkId: '87F5F568-731D-49F6-8C30-621DAF12C9C7', 
    userId: users[5]._id, 
    username: users[5].username, 
    comment: 'Zion is a paradise for climbers!', 
    rating: 4, 
    image: 'https://www.nps.gov/common/uploads/structured_data/68BFC1AC-BF96-629F-89D261D78F181C64.jpg', 
    parkFullName: 'Zion National Park' 
  },
  { 
    parkId: '3B0E8B1E-7AA7-4E5D-902E-FCA11E1E78D4', 
    userId: users[6]._id, 
    username: users[6].username, 
    comment: 'Everglades is a unique experience with so much wildlife.', 
    rating: 4, 
    image: 'https://www.nps.gov/common/uploads/structured_data/17EC840E-9926-2E09-F2DD47A282915BBB.jpg', 
    parkFullName: 'Everglades National Park' 
  },
  { 
    parkId: '1D3EF2D4-70BE-48E8-905A-F378E6C7F3D7', 
    userId: users[7]._id, 
    username: users[7].username, 
    comment: 'Great Smoky Mountains in the fall is something else!', 
    rating: 5, 
    image: 'https://www.nps.gov/common/uploads/structured_data/3C80E3F4-1DD8-B71B-0BFF4F2280EF1B52.jpg', 
    parkFullName: 'Great Smoky Mountains National Park' 
  },
  { 
    parkId: '42BB6318-8E2E-4661-AC8C-6E734DD60D94', 
    userId: users[8]._id, 
    username: users[8].username, 
    comment: 'Bryce Canyon’s hoodoos are surreal.', 
    rating: 5, 
    image: 'https://www.nps.gov/common/uploads/structured_data/61F08520-E14F-18F2-BF5F3D89482631BD.jpg', 
    parkFullName: 'Bryce Canyon National Park' 
  },
  { 
    parkId: '6EDB9067-1E2C-4A96-BBDA-C83DB6BA2F6C', 
    userId: users[9]._id, 
    username: users[9].username, 
    comment: 'Arches NP is just stunning.', 
    rating: 5, 
    image: 'https://www.nps.gov/common/uploads/structured_data/473F5463-F0D2-261D-CEF5FCB39363590B.jpg', 
    parkFullName: 'Arches National Park' 
  },
  { 
    parkId: '37DD8C84-BDBD-4A7B-8EFA-9B45C83C2D97', 
    userId: users[10]._id, 
    username: users[10].username, 
    comment: 'Glacier NP is a dream for nature lovers.', 
    rating: 5, 
    image: 'https://www.nps.gov/common/uploads/structured_data/C20E6CD3-CDF7-B3AB-8448CDCD7FD590FF.jpg', 
    parkFullName: 'Glacier National Park' 
  },
  { 
    parkId: 'FA6E81F4-30BB-4F8A-A798-162CE56A98A6', 
    userId: users[11]._id, 
    username: users[11].username, 
    comment: 'Denali NP is majestic.', 
    rating: 4, 
    image: 'https://www.nps.gov/common/uploads/structured_data/3C83CC90-1DD8-B71B-0B1F35E5ED96E36F.jpg', 
    parkFullName: 'Denali National Park' 
  },
  { 
    parkId: 'C3F70F7D-79A2-4AC5-AC4B-047D2BBE7D79', 
    userId: users[12]._id, 
    username: users[12].username, 
    comment: 'Shenandoah is peaceful and stunning.', 
    rating: 4, 
    image: 'https://www.nps.gov/common/uploads/structured_data/3C80B539-1DD8-B71B-0BEAAA4AC31E7D5B.jpg', 
    parkFullName: 'Shenandoah National Park' 
  },
  { 
    parkId: 'D93D4927-7CD1-4965-AB06-4FA3407E69D8', 
    userId: users[13]._id, 
    username: users[13].username, 
    comment: 'Joshua Tree is unlike anywhere else!', 
    rating: 4, 
    image: 'https://www.nps.gov/common/uploads/structured_data/306D0D93-9CCA-76E1-AD48268F8D7A7E3E.jpg', 
    parkFullName: 'Joshua Tree National Park' 
  },
  { 
    parkId: 'A582D10D-24F2-4BF5-975C-5F8456C1D39F', 
    userId: users[14]._id, 
    username: users[14].username, 
    comment: 'Mount Rainier’s wildflowers are gorgeous.', 
    rating: 5, 
    image: 'https://www.nps.gov/common/uploads/structured_data/49F34094-B893-7DD6-5AE0F0220724B0EF.jpg', 
    parkFullName: 'Mount Rainier National Park' 
  },
  { 
    parkId: '71F3E24D-21A4-4F32-82E8-DA61F96D3AA8', 
    userId: users[15]._id, 
    username: users[15].username, 
    comment: 'Acadia is a hidden gem of the East Coast.', 
    rating: 5, 
    image: 'https://www.nps.gov/common/uploads/structured_data/3C7B477B-1DD8-B71B-0BCB48E009241BAA.jpg', 
    parkFullName: 'Acadia National Park' 
  },
];


    await Review.insertMany(reviews);
    console.log('Seed data inserted successfully!');

    mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    mongoose.connection.close();
    process.exit(1);
  }
};

seedDatabase();
