const cron = require('node-cron');
const { getLowStockItems } = require('../services/inventoryService');
const { sendLowStockAlert } = require('../services/emailService');

let lastAlertedItemIds = new Set();

const runStockCheck = async () => {
  try {
    const lowStockItems = await getLowStockItems();
    if (lowStockItems.length === 0) {
      return;
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@pizzahub.test';

    // Prevent spamming identical alerts continuously if no change
    const currentItemKeys = lowStockItems.map((i) => `${i._id}_${i.stock}`).join('|');
    if (lastAlertedItemIds.has(currentItemKeys)) {
      return;
    }

    console.log(`⏰ [Cron Stock Monitor] Found ${lowStockItems.length} items below threshold.`);
    await sendLowStockAlert(adminEmail, lowStockItems);
    lastAlertedItemIds.clear();
    lastAlertedItemIds.add(currentItemKeys);
  } catch (err) {
    console.error('Error running stock monitor cron job:', err.message);
  }
};

const startStockMonitor = () => {
  // Run every 30 minutes as specified
  cron.schedule('*/30 * * * *', async () => {
    console.log('⏰ Running scheduled 30-minute inventory stock check...');
    await runStockCheck();
  });

  console.log('⏱️ Stock monitor cron job scheduled (every 30 minutes).');
};

module.exports = {
  startStockMonitor,
  runStockCheck,
};
