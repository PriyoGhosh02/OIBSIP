const Inventory = require('../models/Inventory');

// 1. Get pizza builder options from active inventory
exports.getPizzaOptions = async (req, res) => {
  try {
    const items = await Inventory.find().sort({ name: 1 });

    const options = {
      bases: items.filter((item) => item.category === 'Bases'),
      sauces: items.filter((item) => item.category === 'Sauces'),
      cheeses: items.filter((item) => item.category === 'Cheeses'),
      vegetables: items.filter((item) => item.category === 'Vegetables'),
    };

    return res.status(200).json({ success: true, options });
  } catch (err) {
    console.error('Get pizza options error:', err);
    return res.status(500).json({ message: 'Failed to retrieve pizza options.' });
  }
};

// 2. Get curated dashboard pizzas
exports.getCuratedPizzas = (req, res) => {
  const curated = [
    {
      id: 'margherita',
      name: 'Margherita',
      description: 'Tomato sauce, mozzarella, and fresh basil on classic crust.',
      price: 240,
      image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=600&auto=format&fit=crop&q=80',
      configuration: {
        base: 'Classic',
        sauce: 'Classic Tomato',
        cheese: 'Mozzarella',
        vegetables: ['Tomato'],
      },
    },
    {
      id: 'pepperoni',
      name: 'Pepperoni Delight',
      description: 'Spicy marinara, rich cheddar, jalapeños, and savory seasoning.',
      price: 320,
      image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&auto=format&fit=crop&q=80',
      configuration: {
        base: 'Thin Crust',
        sauce: 'Spicy Marinara',
        cheese: 'Cheddar',
        vegetables: ['Jalapeño', 'Bell Pepper'],
      },
    },
    {
      id: 'veggie-supreme',
      name: 'Veggie Supreme',
      description: 'Fresh vegetables with mozzarella, olives, mushrooms, and signature sauce.',
      price: 350,
      image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&auto=format&fit=crop&q=80',
      configuration: {
        base: 'Cheese Burst',
        sauce: 'Garlic Cream',
        cheese: 'Cheese Blend',
        vegetables: ['Bell Pepper', 'Mushroom', 'Olive', 'Corn'],
      },
    },
  ];

  return res.status(200).json({ success: true, pizzas: curated });
};
