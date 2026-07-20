import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

// Layouts
import { MainLayout } from '@/layouts/MainLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { AdminLayout } from '@/layouts/AdminLayout';

// Lazy Loaded Public Pages
const Home = lazy(() => import('@/pages/public/Home').then((m) => ({ default: m.Home })));
const Marketplace = lazy(() => import('@/pages/public/Marketplace').then((m) => ({ default: m.Marketplace })));
const ListingDetail = lazy(() => import('@/pages/public/ListingDetail').then((m) => ({ default: m.ListingDetail })));
const Categories = lazy(() => import('@/pages/public/Categories').then((m) => ({ default: m.Categories })));
const About = lazy(() => import('@/pages/public/About').then((m) => ({ default: m.About })));
const Contact = lazy(() => import('@/pages/public/Contact').then((m) => ({ default: m.Contact })));
const NotFound = lazy(() => import('@/pages/public/NotFound').then((m) => ({ default: m.NotFound })));

// Lazy Loaded Auth Pages
const Login = lazy(() => import('@/pages/auth/Login').then((m) => ({ default: m.Login })));
const Register = lazy(() => import('@/pages/auth/Register').then((m) => ({ default: m.Register })));
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword').then((m) => ({ default: m.ForgotPassword })));
const ResetPassword = lazy(() => import('@/pages/auth/ResetPassword').then((m) => ({ default: m.ResetPassword })));
const VerifyEmailSuccess = lazy(() => import('@/pages/auth/VerifyEmailSuccess').then((m) => ({ default: m.VerifyEmailSuccess })));

// Lazy Loaded Dashboard Pages
const Dashboard = lazy(() => import('@/pages/dashboard/Dashboard').then((m) => ({ default: m.Dashboard })));
const Profile = lazy(() => import('@/pages/dashboard/Profile').then((m) => ({ default: m.Profile })));
const Wishlist = lazy(() => import('@/pages/dashboard/Wishlist').then((m) => ({ default: m.Wishlist })));
const MyListings = lazy(() => import('@/pages/dashboard/MyListings').then((m) => ({ default: m.MyListings })));
const SellItem = lazy(() => import('@/pages/dashboard/SellItem').then((m) => ({ default: m.SellItem })));
const Orders = lazy(() => import('@/pages/dashboard/Orders').then((m) => ({ default: m.Orders })));
const Messages = lazy(() => import('@/pages/dashboard/Messages').then((m) => ({ default: m.Messages })));
const Notifications = lazy(() => import('@/pages/dashboard/Notifications').then((m) => ({ default: m.Notifications })));
const Settings = lazy(() => import('@/pages/dashboard/Settings').then((m) => ({ default: m.Settings })));

// Lazy Loaded Admin Pages
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard })));

const SuspenseFallback = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <LoadingSpinner size="lg" label="Loading page..." />
  </div>
);

export const AppRoutes: React.FC = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<SuspenseFallback />}>
      <Routes>
        {/* Public Routes inside MainLayout */}
        <Route element={<MainLayout />}>
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.MARKETPLACE} element={<Marketplace />} />
          <Route path="/marketplace/:id" element={<ListingDetail />} />
          <Route path={ROUTES.CATEGORIES} element={<Categories />} />
          <Route path={ROUTES.ABOUT} element={<About />} />
          <Route path={ROUTES.CONTACT} element={<Contact />} />
        </Route>

        {/* Auth Routes inside AuthLayout */}
        <Route element={<AuthLayout />}>
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.REGISTER} element={<Register />} />
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
          <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
          <Route path={ROUTES.VERIFY_EMAIL_SUCCESS} element={<VerifyEmailSuccess />} />
        </Route>

        {/* Protected User Dashboard Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
            <Route path={ROUTES.PROFILE} element={<Profile />} />
            <Route path={ROUTES.WISHLIST} element={<Wishlist />} />
            <Route path={ROUTES.MY_LISTINGS} element={<MyListings />} />
            <Route path={ROUTES.SELL} element={<SellItem />} />
            <Route path={ROUTES.ORDERS} element={<Orders />} />
            <Route path={ROUTES.MESSAGES} element={<Messages />} />
            <Route path={ROUTES.NOTIFICATIONS} element={<Notifications />} />
            <Route path={ROUTES.SETTINGS} element={<Settings />} />
          </Route>
        </Route>

        {/* Admin Routes inside AdminLayout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path={ROUTES.ADMIN} element={<AdminDashboard />} />
            <Route path={`${ROUTES.ADMIN}/*`} element={<AdminDashboard />} />
          </Route>
        </Route>

        {/* 404 Fallback Route */}
        <Route element={<MainLayout />}>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};
