const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/user'); // Adjust path if necessary

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/virtual-art-gallery')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ Connection error:', err));

// Admin creation function
async function createAdmin() {
  try {
    const username = 'admin';
    const plainPassword = 'admin123'; // Change this later to something more secure
    const role = 'admin';

    // Hash the password
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Optional: Remove any existing admin with same username
    await User.deleteOne({ username });

    // Create new admin
    await User.create({ username, password: hashedPassword, role });

    console.log('✅ Admin user created:');
    console.log({ username, password: plainPassword, role }); // Shows raw password
  } catch (err) {
    console.error('❌ Error creating admin:', err);
  } finally {
    mongoose.disconnect();
  }
}


