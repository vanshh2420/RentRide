import { connectDB } from '../config/db.js';
import { Vehicle, Category, User } from '../models/index.js';

async function inspect() {
  await connectDB();
  const totalVehicles = await Vehicle.countDocuments();
  const approvedVehicles = await Vehicle.countDocuments({ isApproved: true });
  const availableVehicles = await Vehicle.countDocuments({ status: 'AVAILABLE' });
  const availableApproved = await Vehicle.countDocuments({ status: 'AVAILABLE', isApproved: true });
  const categories = await Category.find({}).lean();
  const users = await User.find({}).select('name email role vendorProfile').lean();
  const vehicles = await Vehicle.find({}).populate('categoryId').lean();

  const { Booking, Payment, Review } = await import('../models/index.js');
  const bookingCount = await Booking.countDocuments();
  const paymentCount = await Payment.countDocuments();
  const reviewCount = await Review.countDocuments();

  const cityCounts = {};
  vehicles.forEach(v => {
    const city = v.location?.city || 'Unknown';
    cityCounts[city] = (cityCounts[city] || 0) + 1;
  });

  console.log('SUMMARY:', JSON.stringify({
    totalVehicles,
    approvedVehicles,
    availableVehicles,
    availableApproved,
    cityCounts,
    bookingCount,
    paymentCount,
    reviewCount,
    categoryCount: categories.length,
    userCount: users.length
  }, null, 2));

  process.exit(0);
}

inspect().catch(err => {
  console.error(err);
  process.exit(1);
});
