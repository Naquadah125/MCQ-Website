require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const users = [
      { name: 'Admin', email: 'admin@example.com', password: 'adminpass', role: 'admin' },
      { name: 'User One', email: 'user1@example.com', password: 'user1pass' }
    ];

    await User.deleteMany({});
    await User.insertMany(users);

    console.log(`✅ Seed completed: inserted ${users.length} users`);
  } catch (err) {
    console.error('❌ Seeding error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
