/* eslint-disable react-refresh/only-export-components */
import React, { type FC, lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, Outlet, useRouteError } from 'react-router-dom';
import Home from '../pages/landing/Home';
import MainLayout from '../layout/MainLayout';
import BlogsPage from '../pages/landing/BlogsPage';
import BlogViewPage from '../components/landing/BlogViewPage';
import AuthLayout from '../layout/AuthLayout';
import AdminLogin from '../pages/auth/admin/Login';
import logo from '../assets/images/aby_hr.png';
import UnlockScreen from '../pages/auth/admin/UnlockScreen';
import DashboardLayout from '../layout/DashboardLayout';
import DashboardHome from '../pages/dashboard/DashboardHome';
import ProtectPrivateAdminRoute from '../components/protectors/ProtectPrivateAdminRoute';
import AdminProfile from '../pages/dashboard/AdminProfile';
import EmployeeFormExample from '../components/dashboard/employee/EmployeeForm';
import ContractDashboard from '../pages/dashboard/ContractManagement';
import ViewEmployee from '../components/dashboard/employee/EmployeeViewMorePage';
import SitesManagement from '../pages/dashboard/SitesManagement';
import UpserJobPost from '../components/dashboard/recruitment/UpsertJobPost';
import JobView from '../components/dashboard/recruitment/JobView';
import JobBoard from '../pages/landing/JobBoard';
import JobPostView from '../components/landing/JobViewPage';
import JobApplicationForm from '../components/landing/ApplyJob';
import ApplicantView from '../components/dashboard/recruitment/ApplicantView';
import ClientManagement from '../pages/dashboard/ClientManagement';
import MaterialManagement from '../pages/dashboard/MaterialManagement';
import CategoryDashboard from '../pages/dashboard/CategoryManagement';
import UnitDashboard from '../pages/dashboard/UnitManagement';
import RoleManagement from '../pages/dashboard/RoleManagement';
import MaterialRequisition from '../pages/dashboard/MaterialRequisition';
import SiteAssignmentDashboard from '../pages/dashboard/SiteAssignmentDashboard';
import MaterialRequisitionDetail from '../pages/dashboard/MaterialRequisitionDetail';
import ProductFormExample from '../pages/dashboard/product/AddProduct';
import ProductManagement from '../pages/dashboard/product/ProductManagement';
import ProductViewPage from '../components/landing/shop/ShopViewPage';
import ShoppingCartPage from '../pages/landing/ShoppingCartPage';
import Gallery from '../pages/landing/Gallery';
import WishlistPage from '../pages/landing/ShoppingWishlist';
import BlogDashboard from '../pages/dashboard/blog/BlogManagement';
import BlogFormPage from '../pages/dashboard/blog/BlogFormPage';
import ProductViewMorePage from '../pages/dashboard/product/ProductViewPage';
import BlogViewMorePage from '../pages/dashboard/blog/BlogViewMorePage';
import TestimonialDashboard from '../pages/dashboard/testimonial/TestimonialManagement';
import TestimonialFormExample from '../pages/dashboard/testimonial/TestimonialFormPage';
import TestimonialViewMorePage from '../pages/dashboard/testimonial/TestimonialViewMorePage';
import PaymentStatusPage from '../pages/landing/PaymentStatusPage';
import ContactMessagesDashboard from '../pages/dashboard/ContactMessage';
import SubscriberDashboard from '../pages/dashboard/Subscribers';
import HelpCenter from '../pages/landing/HelpCenterPage';
import FAQ from '../pages/landing/FaqPage';
import ShippingInfo from '../pages/landing/ShipingInfoPage';
import CustomerService from '../pages/landing/CustomerServicePage';
import SizeGuide from '../pages/landing/SizeGuidePage';
import TermsAndConditions from '../pages/landing/Terms&Condition';
import PrivacyPolicy from '../pages/landing/PrivacyPolicyPage';
import LoginPage from '../pages/auth/purcahing-user/Login';
import RegisterPage from '../pages/auth/purcahing-user/Register';
import ProtectPrivatePurchasingUserRoute from '../components/protectors/ProtectPrivatePurchasingUserRoute';
import OrderDashboard from '../pages/dashboard/order/OrderDashboard';
import AdminOrderDetailView from '../pages/dashboard/order/AdminOrderDetailView';
import CustomerOrderDetailView from '../pages/user-dashboard/CustomerOrderDetailView';
import CustomerOrderDashboard from '../pages/user-dashboard/CustomerOrderDashboard';

import ErrorBoundary from '../pages/landing/ErrorBoundary';
import { AlertTriangle, RefreshCw, Home as HomeIcon } from 'lucide-react';
import NotFoundPage from '../pages/landing/NotFound';
import PurchasingUserProfilePage from '../pages/user-dashboard/UserProfilePage';
import UserDashboard from '../pages/dashboard/UserManagement';
import RetryPaymentPage from '../pages/landing/RetryPayment';
import UserDashboardHome from '../pages/user-dashboard/DashboardHome';

const ProductPage = lazy(() => import('../pages/landing/ShoppingPage'));
const ServicesPage = lazy(() => import('../pages/landing/ServicePage'));
const ContactPage = lazy(() => import('../pages/landing/ContactUs'));
const AboutPage = lazy(() => import('../pages/landing/AboutPage'));
const StockManagement = lazy(() => import('../pages/dashboard/StockManagement'));

export type OutletContextType = {
  role: 'admin' | 'user';
};

/**
 * Loading spinner component for Suspense fallback
 */
const LoadingSpinner: FC = () => (
  <div className="w-full min-h-screen py-12 px-4 bg-gradient-to-br from-slate-50 via-primary-50/30 to-slate-100 flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
  </div>
);

/**
 * Router Error Handler Component
 * This displays errors caught by React Router's errorElement
 */
const RouterErrorBoundary: FC = () => {
  const error = useRouteError() as any;

  const handleReload = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-green-50 to-primary-50 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-primary-500 to-green-600 p-8 text-white">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                <AlertTriangle className="w-16 h-16" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">
              Oops! Something Went Wrong
            </h1>
            <p className="text-center text-primary-100 text-lg">
              Your sparkle got dimmed for a moment
            </p>
          </div>

          <div className="p-8">
            <div className="mb-8">
              <p className="text-gray-700 text-lg mb-4 text-center">
                Don't worry, our team has been notified and we're working to restore the shine.
              </p>
              <p className="text-gray-600 text-center">
                In the meantime, you can try refreshing the page or returning to discover more jewelry.
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && error && (
              <details className="mb-8 bg-gray-50 rounded-lg p-4 border border-gray-200">
                <summary className="cursor-pointer font-semibold text-gray-700 mb-2">
                  Technical Details (Dev Mode)
                </summary>
                <div className="mt-4 space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Error Message:</p>
                    <pre className="bg-primary-50 border border-primary-200 p-3 rounded text-xs text-primary-800 overflow-x-auto">
                      {error?.message || error?.toString() || 'Unknown error'}
                    </pre>
                  </div>
                  {error?.stack && (
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2">Stack Trace:</p>
                      <pre className="bg-gray-100 border border-gray-300 p-3 rounded text-xs text-gray-700 overflow-x-auto max-h-64 overflow-y-auto">
                        {error.stack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={handleReload}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-green-600 hover:from-primary-700 hover:to-green-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <RefreshCw className="w-5 h-5" />
                Refresh Page
              </button>
              <button
                onClick={handleGoHome}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200"
              >
                <HomeIcon className="w-5 h-5" />
                Back to Home
              </button>
            </div>

            <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 text-center">
              <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-4">
                If this problem persists, please contact our customer support team.
              </p>
              <a
                href="mailto:support@novagems.rw"
                className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium text-sm"
              >
                support@novagems.rw
              </a>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Error ID: {Date.now().toString(36).toUpperCase()}
        </p>
      </div>
    </div>
  );
};

/**
 * Suspense wrapper for lazy-loaded components
 */
interface SuspenseWrapperProps {
  children: React.ReactNode;
}

const SuspenseWrapper: FC<SuspenseWrapperProps> = ({ children }) => {
  return <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>;
};

/**
 * Application routes configuration
 */
const routes = createBrowserRouter([
  {
    path: '/',
    element: (
      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
    ),
    errorElement: <RouterErrorBoundary />,
    children: [
      {
        path: '',
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: (
              <SuspenseWrapper>
                <Home />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'about',
            element: (
              <SuspenseWrapper>
                <AboutPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'cart',
            element: (
              <SuspenseWrapper>
                <ShoppingCartPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'payment-status',
            element: (
              <SuspenseWrapper>
                <PaymentStatusPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'wishlist',
            element: (
              <SuspenseWrapper>
                <WishlistPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'Gallery',
            element: (
              <SuspenseWrapper>
                <Gallery />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'products',
            element: (
              <SuspenseWrapper>
                <ProductPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'products/:id',
            element: (
              <SuspenseWrapper>
                <ProductViewPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'contact',
            element: (
              <SuspenseWrapper>
                <ContactPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'blogs',
            element: (
              <SuspenseWrapper>
                <BlogsPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'blogs/:id',
            element: (
              <SuspenseWrapper>
                <BlogViewPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/help-center',
            element: (
              <SuspenseWrapper>
                <HelpCenter />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/faq',
            element: (
              <SuspenseWrapper>
                <FAQ />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/shipping-info',
            element: (
              <SuspenseWrapper>
                <ShippingInfo />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/customer-service',
            element: (
              <SuspenseWrapper>
                <CustomerService />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/size-guide',
            element: (
              <SuspenseWrapper>
                <SizeGuide />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/terms-condition',
            element: (
              <SuspenseWrapper>
                <TermsAndConditions />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/privacy-policy',
            element: (
              <SuspenseWrapper>
                <PrivacyPolicy />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/retry-payment',
            element: (
              <SuspenseWrapper>
                <RetryPaymentPage />
              </SuspenseWrapper>
            ),
          },
        ],
      },
      {
        path: 'user',
        element: (
          <SuspenseWrapper>
            <ProtectPrivatePurchasingUserRoute>
              <Outlet context={{ role: 'user' } satisfies OutletContextType} />
            </ProtectPrivatePurchasingUserRoute>
          </SuspenseWrapper>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="/user/dashboard" replace />,
          },
          {
            path: 'dashboard',
            element: <DashboardLayout />,
            children: [
              {
                path: '',
                element: (
                  <SuspenseWrapper>
                    <UserDashboardHome />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'my-orders',
                element: (
                  <SuspenseWrapper>
                    <CustomerOrderDashboard />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'my-orders/:id',
                element: (
                  <SuspenseWrapper>
                    <CustomerOrderDetailView />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'profile',
                element: (
                  <SuspenseWrapper>
                    <PurchasingUserProfilePage />
                  </SuspenseWrapper>
                ),
              },
            ],
          },
        ],
      },
      {
        path: 'admin',
        element: (
          <SuspenseWrapper>
            <ProtectPrivateAdminRoute>
              <Outlet context={{ role: 'admin' } satisfies OutletContextType} />
            </ProtectPrivateAdminRoute>
          </SuspenseWrapper>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="/admin/dashboard" replace />,
          },
          {
            path: 'dashboard',
            element: <DashboardLayout />,
            children: [
              {
                path: '',
                element: (
                  <SuspenseWrapper>
                    <DashboardHome />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'profile',
                element: (
                  <SuspenseWrapper>
                    <AdminProfile />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'user-management',
                element: (
                  <SuspenseWrapper>
                    <UserDashboard />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'order-management',
                element: (
                  <SuspenseWrapper>
                    <OrderDashboard />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'order-management/:id',
                element: (
                  <SuspenseWrapper>
                    <AdminOrderDetailView />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'product-management',
                element: (
                  <SuspenseWrapper>
                    <ProductManagement />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'product-management/add',
                element: (
                  <SuspenseWrapper>
                    <ProductFormExample />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'product-management/edit/:id',
                element: (
                  <SuspenseWrapper>
                    <ProductFormExample />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'product-management/:id',
                element: (
                  <SuspenseWrapper>
                    <ProductViewMorePage />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'blog-management',
                element: (
                  <SuspenseWrapper>
                    <BlogDashboard />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'blog-management/add',
                element: (
                  <SuspenseWrapper>
                    <BlogFormPage />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'blog-management/edit/:id',
                element: (
                  <SuspenseWrapper>
                    <BlogFormPage />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'blog-management/:id',
                element: (
                  <SuspenseWrapper>
                    <BlogViewMorePage />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'testimonial-management',
                element: (
                  <SuspenseWrapper>
                    <TestimonialDashboard />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'testimonial-management/add',
                element: (
                  <SuspenseWrapper>
                    <TestimonialFormExample />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'testimonial-management/edit/:id',
                element: (
                  <SuspenseWrapper>
                    <TestimonialFormExample />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'testimonial-management/:id',
                element: (
                  <SuspenseWrapper>
                    <TestimonialViewMorePage />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'employee-management/:id',
                element: (
                  <SuspenseWrapper>
                    <ViewEmployee />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'employee-management/create',
                element: (
                  <SuspenseWrapper>
                    <EmployeeFormExample />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'employee-management/update/:id',
                element: (
                  <SuspenseWrapper>
                    <EmployeeFormExample />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'material-management',
                element: (
                  <SuspenseWrapper>
                    <MaterialManagement />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'contact-message',
                element: (
                  <SuspenseWrapper>
                    <ContactMessagesDashboard />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'subscribe-message',
                element: (
                  <SuspenseWrapper>
                    <SubscriberDashboard />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'category-management',
                element: (
                  <SuspenseWrapper>
                    <CategoryDashboard />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'units-management',
                element: (
                  <SuspenseWrapper>
                    <UnitDashboard />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'contract-management',
                element: (
                  <SuspenseWrapper>
                    <ContractDashboard />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'site-management',
                element: (
                  <SuspenseWrapper>
                    <SitesManagement />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'site-assign-management',
                element: (
                  <SuspenseWrapper>
                    <SiteAssignmentDashboard />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'recruiting-management/create',
                element: (
                  <SuspenseWrapper>
                    <UpserJobPost />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'recruiting-management/update/:id',
                element: (
                  <SuspenseWrapper>
                    <UpserJobPost />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'recruiting-management/:id',
                element: (
                  <SuspenseWrapper>
                    <JobView />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'recruiting-management/:jobId/applicants/:applicantId',
                element: (
                  <SuspenseWrapper>
                    <ApplicantView />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'client-management',
                element: (
                  <SuspenseWrapper>
                    <ClientManagement />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'role-management',
                element: (
                  <SuspenseWrapper>
                    <RoleManagement />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'material-requisition',
                element: (
                  <SuspenseWrapper>
                    <MaterialRequisition />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'material-requisition/:id',
                element: (
                  <SuspenseWrapper>
                    <MaterialRequisitionDetail />
                  </SuspenseWrapper>
                ),
              },
            ],
          },
        ],
      },
      {
        path: '/auth',
        element: <AuthLayout />,
        children: [
          {
            path: 'admin/login',
            element: (
              <SuspenseWrapper>
                <AdminLogin />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'admin/unlock',
            element: (
              <SuspenseWrapper>
                <UnlockScreen />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'user/login',
            element: (
              <SuspenseWrapper>
                <LoginPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'user/register',
            element: (
              <SuspenseWrapper>
                <RegisterPage />
              </SuspenseWrapper>
            ),
          },
        ],
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);

export default routes;