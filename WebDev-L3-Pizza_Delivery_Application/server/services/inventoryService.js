const Inventory = require('../models/Inventory');

/**
 * Validates selected ingredients, ensures they are in stock,
 * and calculates genuine server-side subtotal and total prices.
 */
const validateAndCalculatePrice = async (items) => {
  const { base, sauce, cheese, vegetables = [] } = items;

  if (!base || !sauce || !cheese) {
    return {
      valid: false,
      message: 'Base, sauce, and cheese selections are all required.',
    };
  }

  const allNames = [base, sauce, cheese, ...vegetables];

  // Fetch all requested inventory records from database
  const inventoryItems = await Inventory.find({ name: { $in: allNames } });

  // Map by name for quick lookup
  const itemMap = new Map();
  inventoryItems.forEach((item) => itemMap.set(item.name, item));

  // Check each required item
  for (const name of allNames) {
    const item = itemMap.get(name);
    if (!item) {
      return {
        valid: false,
        message: `Ingredient "${name}" is not recognized in inventory.`,
      };
    }
    if (item.stock <= 0) {
      return {
        valid: false,
        message: `Sorry, ${name} is currently out of stock.`,
      };
    }
  }

  // Calculate pricing server-side
  const baseItem = itemMap.get(base);
  const sauceItem = itemMap.get(sauce);
  const cheeseItem = itemMap.get(cheese);

  let subtotal = (baseItem?.price || 0) + (sauceItem?.price || 0) + (cheeseItem?.price || 0);

  for (const vegName of vegetables) {
    const vegItem = itemMap.get(vegName);
    subtotal += vegItem?.price || 0;
  }

  const deliveryFee = 40;
  const totalAmount = subtotal + deliveryFee;

  return {
    valid: true,
    subtotal,
    deliveryFee,
    totalAmount,
    inventoryItems,
  };
};

/**
 * Automatically decrements inventory by 1 for each used ingredient.
 * Uses atomic updates with $gte: 1 to guarantee stock never drops below 0.
 */
const deductInventoryStock = async (items) => {
  const { base, sauce, cheese, vegetables = [] } = items;
  const allNames = [base, sauce, cheese, ...vegetables];

  const updatePromises = allNames.map((name) =>
    Inventory.updateOne(
      { name, stock: { $gt: 0 } },
      { $inc: { stock: -1 }, $set: { updatedAt: new Date() } }
    )
  );

  await Promise.all(updatePromises);
  console.log(`📦 Inventory automatically deducted for ingredients: ${allNames.join(', ')}`);
};

/**
 * Finds all inventory items where stock has fallen below or equal to threshold.
 */
const getLowStockItems = async () => {
  return await Inventory.find({
    $expr: { $lte: ['$stock', '$threshold'] },
  });
};

module.exports = {
  validateAndCalculatePrice,
  deductInventoryStock,
  getLowStockItems,
};
