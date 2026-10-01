require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Inventory = require('./models/Inventory');
const connectDB = require('./config/db');

const initialInventory = [
  // 5 Pizza Bases
  { name: 'Classic', category: 'Bases', price: 150, stock: 45, threshold: 20, description: 'Traditional hand-tossed golden crust.' },
  { name: 'Thin Crust', category: 'Bases', price: 170, stock: 32, threshold: 20, description: 'Crispy, light, and perfectly baked.' },
  { name: 'Cheese Burst', category: 'Bases', price: 220, stock: 18, threshold: 20, description: 'Crust overflowing with molten cheese.' },
  { name: 'Whole Wheat', category: 'Bases', price: 180, stock: 25, threshold: 20, description: 'Nutritious whole grain fiber base.' },
  { name: 'Gluten Free', category: 'Bases', price: 200, stock: 12, threshold: 20, description: 'Naturally gluten-free artisanal base.' },

  // 5 Sauces
  { name: 'Classic Tomato', category: 'Sauces', price: 30, stock: 40, threshold: 20, description: 'Rich Italian sun-ripened plum tomatoes.' },
  { name: 'Spicy Marinara', category: 'Sauces', price: 40, stock: 35, threshold: 20, description: 'Zesty chili-infused herbal marinara.' },
  { name: 'BBQ', category: 'Sauces', price: 45, stock: 25, threshold: 20, description: 'Smoky sweet hickory barbecue sauce.' },
  { name: 'Garlic Cream', category: 'Sauces', price: 50, stock: 30, threshold: 20, description: 'Velvety roasted garlic cream sauce.' },
  { name: 'Pesto', category: 'Sauces', price: 60, stock: 22, threshold: 20, description: 'Aromatic basil, pine nuts, and extra virgin olive oil.' },

  // 4 Cheeses
  { name: 'Mozzarella', category: 'Cheeses', price: 60, stock: 35, threshold: 20, description: 'Fresh, stretchy, creamy mozzarella.' },
  { name: 'Cheddar', category: 'Cheeses', price: 70, stock: 28, threshold: 20, description: 'Sharp and tangy aged English cheddar.' },
  { name: 'Parmesan', category: 'Cheeses', price: 80, stock: 20, threshold: 20, description: 'Authentic grated Parmigiano-Reggiano.' },
  { name: 'Cheese Blend', category: 'Cheeses', price: 90, stock: 25, threshold: 20, description: 'Four-cheese blend of mozzarella, provolone, cheddar & gouda.' },

  // 8 Vegetables
  { name: 'Bell Pepper', category: 'Vegetables', price: 25, stock: 35, threshold: 20, description: 'Crisp green and yellow bell peppers.' },
  { name: 'Onion', category: 'Vegetables', price: 20, stock: 40, threshold: 20, description: 'Sweet thinly-sliced red onions.' },
  { name: 'Mushroom', category: 'Vegetables', price: 35, stock: 30, threshold: 20, description: 'Freshly sliced earthy button mushrooms.' },
  { name: 'Olive', category: 'Vegetables', price: 35, stock: 25, threshold: 20, description: 'Sliced Spanish black and kalamata olives.' },
  { name: 'Tomato', category: 'Vegetables', price: 20, stock: 40, threshold: 20, description: 'Juicy Roma tomato slices with oregano.' },
  { name: 'Jalapeño', category: 'Vegetables', price: 30, stock: 24, threshold: 20, description: 'Fiery Mexican pickled jalapeño rings.' },
  { name: 'Corn', category: 'Vegetables', price: 25, stock: 32, threshold: 20, description: 'Tender sweet golden corn kernels.' },
  { name: 'Spinach', category: 'Vegetables', price: 25, stock: 22, threshold: 20, description: 'Tender baby spinach leaves.' },
];

const seedDatabase = async () => {
  try {
    // 1. Seed or Update Admin Account
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@pizzahub.test').toLowerCase().trim();
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('AdminPassword123', salt);

      await User.create({
        name: 'PizzaHub Admin',
        email: adminEmail,
        passwordHash,
        role: 'admin',
        isVerified: true,
      });
      console.log(`👑 Admin account created: ${adminEmail} (password: AdminPassword123)`);
    } else {
      console.log(`👑 Admin account already exists: ${adminEmail}`);
    }

    // 2. Seed Inventory if empty or missing items
    for (const item of initialInventory) {
      const exists = await Inventory.findOne({ name: item.name });
      if (!exists) {
        await Inventory.create(item);
      }
    }
    console.log('🍕 Inventory verified and seeded successfully.');
  } catch (err) {
    console.error('Error during database seeding:', err.message);
  }
};

// If run directly via `node seedAdmin.js`
if (require.main === module) {
  (async () => {
    await connectDB();
    await seedDatabase();
    console.log('🌱 Seeding complete.');
    process.exit(0);
  })();
}

module.exports = seedDatabase;
