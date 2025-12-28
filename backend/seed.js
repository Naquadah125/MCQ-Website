const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' }
});

const User = mongoose.model('User', userSchema);

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    await User.deleteMany({});

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123', salt);

    const users = [
      {
        name: 'Quản Trị Viên',
        email: 'admin@test.com',
        password: hashedPassword,
        role: 'admin'
      }
    ];

    await User.insertMany(users);
    console.log('Done!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();