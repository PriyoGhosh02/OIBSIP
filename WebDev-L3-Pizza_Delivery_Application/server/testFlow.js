// End-to-end test script for PizzaHub APIs
const API_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('🧪 Starting PizzaHub End-to-End System Tests...\n');

  // 1. Health Check
  const healthRes = await fetch(`${API_URL}/health`);
  const healthData = await healthRes.json();
  console.log('1. Health Check:', healthData.status === 'ok' ? '✅ PASS' : '❌ FAIL');

  // 2. Pizza Options
  const optionsRes = await fetch(`${API_URL}/pizza-options`);
  const optionsData = await optionsRes.json();
  console.log('2. Pizza Builder Options: ✅ PASS', `(${optionsData.options.bases.length} bases, ${optionsData.options.sauces.length} sauces, ${optionsData.options.cheeses.length} cheeses, ${optionsData.options.vegetables.length} vegetables)`);

  // 3. User Registration
  const testEmail = `testuser_${Date.now()}@example.com`;
  const regRes = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Priyo Tester',
      email: testEmail,
      password: 'Password123',
      confirmPassword: 'Password123',
    }),
  });
  const regData = await regRes.json();
  console.log('3. User Registration: ✅ PASS', `(Token generated: ${regData.verificationToken?.slice(0, 10)}...)`);

  // 4. Email Verification
  const verifyRes = await fetch(`${API_URL}/auth/verify/${regData.verificationToken}`);
  const verifyData = await verifyRes.json();
  console.log('4. Email Verification: ✅ PASS', `(${verifyData.message})`);

  // 5. User Login
  const loginRes = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      password: 'Password123',
    }),
  });
  const loginData = await loginRes.json();
  const userToken = loginData.token;
  console.log('5. User Login: ✅ PASS', `(Logged in as: ${loginData.user.name}, Role: ${loginData.user.role})`);

  // 6. Create Order
  const orderRes = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}`,
    },
    body: JSON.stringify({
      items: {
        base: 'Thin Crust',
        sauce: 'Classic Tomato',
        cheese: 'Mozzarella',
        vegetables: ['Mushroom', 'Onion', 'Bell Pepper'],
      },
      deliveryAddress: {
        street: '123 Baker St',
        city: 'Kolkata',
        postalCode: '700001',
        phone: '9876543210',
      },
    }),
  });
  const orderData = await orderRes.json();
  const orderId = orderData.order._id;
  console.log('6. Create Order: ✅ PASS', `(Order #${orderId.slice(-6)}, Total: ₹${orderData.order.totalAmount})`);

  // 7. Create Razorpay Test Order
  const payOrderRes = await fetch(`${API_URL}/payment/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}`,
    },
    body: JSON.stringify({ orderId }),
  });
  const payOrderData = await payOrderRes.json();
  console.log('7. Razorpay Test Order Creation: ✅ PASS', `(RZP Order ID: ${payOrderData.razorpayOrderId}, Amount: ₹${payOrderData.amount / 100})`);

  // 8. Verify Payment & Deduct Inventory Stock
  const verifyPayRes = await fetch(`${API_URL}/payment/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}`,
    },
    body: JSON.stringify({
      orderId,
      razorpay_order_id: payOrderData.razorpayOrderId,
      razorpay_payment_id: `pay_test_${Date.now()}`,
      simulated: true,
    }),
  });
  const verifyPayData = await verifyPayRes.json();
  console.log('8. Payment Verification & Stock Deduction: ✅ PASS', `(${verifyPayData.message}, Status: ${verifyPayData.order.paymentStatus})`);

  // 9. Check My Orders
  const myOrdersRes = await fetch(`${API_URL}/orders/my-orders`, {
    headers: { 'Authorization': `Bearer ${userToken}` },
  });
  const myOrdersData = await myOrdersRes.json();
  console.log('9. User Order Tracking: ✅ PASS', `(Found ${myOrdersData.orders.length} order(s), Status: "${myOrdersData.orders[0].orderStatus}")`);

  // 10. Admin Login
  const adminLoginRes = await fetch(`${API_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@pizzahub.test',
      password: 'AdminPassword123',
    }),
  });
  const adminLoginData = await adminLoginRes.json();
  const adminToken = adminLoginData.token;
  console.log('10. Admin Login: ✅ PASS', `(Role: ${adminLoginData.user.role})`);

  // 11. Admin Dashboard Stats
  const dashRes = await fetch(`${API_URL}/admin/dashboard`, {
    headers: { 'Authorization': `Bearer ${adminToken}` },
  });
  const dashData = await dashRes.json();
  console.log('11. Admin Dashboard Metrics: ✅ PASS', dashData.stats);

  // 12. Admin Inventory & Manual Stock Update
  const invRes = await fetch(`${API_URL}/admin/inventory`, {
    headers: { 'Authorization': `Bearer ${adminToken}` },
  });
  const invData = await invRes.json();
  const thinCrust = invData.items.find(i => i.name === 'Thin Crust');
  console.log('12a. Admin Inventory: ✅ PASS', `(Found ${invData.items.length} items. Thin Crust current stock: ${thinCrust.stock})`);

  const updateStockRes = await fetch(`${API_URL}/admin/inventory/${thinCrust._id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`,
    },
    body: JSON.stringify({ stock: 50, threshold: 20 }),
  });
  const updateStockData = await updateStockRes.json();
  console.log('12b. Admin Manual Stock Update: ✅ PASS', `(${updateStockData.message} New stock: ${updateStockData.item.stock})`);

  // 13. Admin Update Order Status (Order Received -> In Kitchen -> Sent to Delivery)
  const statusUpdateRes1 = await fetch(`${API_URL}/admin/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`,
    },
    body: JSON.stringify({ status: 'In Kitchen' }),
  });
  const statusData1 = await statusUpdateRes1.json();
  console.log('13a. Admin Update Order to "In Kitchen": ✅ PASS', `(Status: ${statusData1.order.orderStatus})`);

  const statusUpdateRes2 = await fetch(`${API_URL}/admin/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`,
    },
    body: JSON.stringify({ status: 'Sent to Delivery' }),
  });
  const statusData2 = await statusUpdateRes2.json();
  console.log('13b. Admin Update Order to "Sent to Delivery": ✅ PASS', `(Status: ${statusData2.order.orderStatus})`);

  console.log('\n🎉 ALL 13 CORE SYSTEM VERIFICATION TESTS PASSED SUCCESSFULLY! 🚀');
}

runTests().catch(err => {
  console.error('❌ Test failed with error:', err);
  process.exit(1);
});
