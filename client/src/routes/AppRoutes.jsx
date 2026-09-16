import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CustomerLayout } from '../layouts/CustomerLayout';
import { VendorLayout } from '../layouts/VendorLayout';
import { AdminLayout } from '../layouts/AdminLayout';

// Public & Customer Pages
import { HomePage } from '../pages/customer/HomePage';
import { ExplorePage } from '../pages/customer/ExplorePage';
import { CategoriesPage } from '../pages/customer/CategoriesPage';
import { RentalPlansPage } from '../pages/customer/RentalPlansPage';
import { VehicleDetailsPage } from '../pages/customer/VehicleDetailsPage';
import { LoginPage } from '../pages/public/LoginPage';
import { RegisterPage } from '../pages/public/RegisterPage';
import { ProfilePage } from '../pages/customer/ProfilePage';
import { CheckoutPage } from '../pages/customer/CheckoutPage';
import { PaymentPage } from '../pages/customer/PaymentPage';
import { MyBookingsPage } from '../pages/customer/MyBookingsPage';
import { BookingDetailsPage } from '../pages/customer/BookingDetailsPage';

// Vendor Pages
import { VendorDashboardPage } from '../pages/vendor/VendorDashboardPage';
import { MyVehiclesPage } from '../pages/vendor/MyVehiclesPage';

// Admin Pages
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminUsersPage } from '../pages/admin/AdminUsersPage';
import { AdminVendorsPage } from '../pages/admin/AdminVendorsPage';
import { AdminVehiclesPage } from '../pages/admin/AdminVehiclesPage';
import { AdminBookingsPage } from '../pages/admin/AdminBookingsPage';
import { AdminPaymentsPage } from '../pages/admin/AdminPaymentsPage';
import { AdminMaintenancePage } from '../pages/admin/AdminMaintenancePage';
import { AdminReviewsPage } from '../pages/admin/AdminReviewsPage';
import { AdminCouponsPage } from '../pages/admin/AdminCouponsPage';

// Route Guards & Constants
import { ProtectedRoute, RoleRoute } from '../components/navigation/ProtectedRoute';
import { ROLES } from '../constants/roles';

const NotFoundPage = () => (
  <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
    <h1 className="text-4xl font-extrabold text-slate-800 dark:text-slate-100">404</h1>
    <p className="text-slate-500">The page you are looking for does not exist.</p>
  </div>
);

export const AppRoutes = () => {
  return (
    <Routes>
      {/* ================================================================= */}
      {/* 1. CUSTOMER & PUBLIC STOREFRONT INTERFACE                         */}
      {/* ================================================================= */}
      <Route element={<CustomerLayout />}>
        {/* Public Browsing Routes */}
        <Route index element={<HomePage />} />
        <Route path="explore" element={<ExplorePage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="rental-plans" element={<RentalPlansPage />} />
        <Route path="pricing" element={<RentalPlansPage />} />
        <Route path="vehicles/:id" element={<VehicleDetailsPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="vendor/register" element={<RegisterPage />} />

        {/* Protected Authenticated Profile */}
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Protected Customer-Exclusive Rental & Checkout Flows */}
        <Route
          path="checkout/:id"
          element={
            <RoleRoute allowedRoles={[ROLES.CUSTOMER]}>
              <CheckoutPage />
            </RoleRoute>
          }
        />
        <Route
          path="payment/:id"
          element={
            <RoleRoute allowedRoles={[ROLES.CUSTOMER]}>
              <PaymentPage />
            </RoleRoute>
          }
        />
        <Route
          path="my-bookings"
          element={
            <RoleRoute allowedRoles={[ROLES.CUSTOMER]}>
              <MyBookingsPage />
            </RoleRoute>
          }
        />
        <Route
          path="bookings/:id"
          element={
            <ProtectedRoute>
              <BookingDetailsPage />
            </ProtectedRoute>
          }
        />

        {/* Public / Catch-all 404 within Customer Shell */}
        <Route path="404" element={<NotFoundPage />} />
      </Route>

      {/* ================================================================= */}
      {/* 2. VENDOR OPERATIONS & FLEET DISPATCH PORTAL                     */}
      {/* ================================================================= */}
      <Route
        path="vendor"
        element={
          <RoleRoute allowedRoles={[ROLES.VENDOR]}>
            <VendorLayout />
          </RoleRoute>
        }
      >
        <Route index element={<Navigate to="/vendor/dashboard" replace />} />
        <Route path="dashboard" element={<VendorDashboardPage />} />
        <Route path="vehicles" element={<MyVehiclesPage />} />
        <Route path="bookings" element={<VendorDashboardPage />} />
        <Route path="maintenance" element={<VendorDashboardPage />} />
        <Route path="earnings" element={<VendorDashboardPage />} />
        <Route path="forecast" element={<VendorDashboardPage />} />
        <Route path="walkin" element={<VendorDashboardPage defaultWalkinOpen={true} />} />
      </Route>

      {/* ================================================================= */}
      {/* 3. MASTER ADMIN GOVERNANCE & PLATFORM CONTROL                    */}
      {/* ================================================================= */}
      <Route
        path="admin"
        element={
          <RoleRoute allowedRoles={[ROLES.ADMIN]}>
            <AdminLayout />
          </RoleRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="vendors" element={<AdminVendorsPage />} />
        <Route path="vehicles" element={<AdminVehiclesPage />} />
        <Route path="bookings" element={<AdminBookingsPage />} />
        <Route path="payments" element={<AdminPaymentsPage />} />
        <Route path="maintenance" element={<AdminMaintenancePage />} />
        <Route path="reviews" element={<AdminReviewsPage />} />
        <Route path="coupons" element={<AdminCouponsPage />} />
        <Route path="revenue" element={<Navigate to="/admin/dashboard" replace />} />
      </Route>

      {/* Catch-all global route */}
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};
