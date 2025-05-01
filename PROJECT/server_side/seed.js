const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');

    // Seed products
    await Product.deleteMany({});
    await Product.insertMany([
      { libelle: 'Laptop', prix: 1000, image: '/assets/images/laptop.png' },
      { libelle: 'Phone', prix: 500, image: '/assets/images/phone.png' },
      { libelle: 'Headphones', prix: 50, image: '/assets/images/headphones.png' }
    ]);
    console.log('Products seeded');

    // Seed admin user
    await User.deleteMany({ role: 'admin' });
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.insertMany([
      {
        nom: 'Admin',
        prenom: 'User',
        email: 'admin@admin.com',
        age: 30,
        password: hashedPassword,
        role: 'admin'
      }
    ]);
    console.log('Admin user seeded');

    mongoose.connection.close();
  })
  .catch(err => console.error('Error:', err));