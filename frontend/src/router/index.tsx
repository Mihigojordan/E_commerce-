/* eslint-disable react-refresh/only-export-components */
import { AlertTriangle, RefreshCw, Home as HomeIcon } from 'lucide-react';
import React, { type FC, lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, Outlet, useRouteError } from 'react-router-dom';

// Wrap lazy imports with React.lazy
const Home = React.lazy(() => import('../pages/landing/Home'));
const MainLayout = React.lazy(() => import('../layout/MainLayout'));
const BlogsPage = React.lazy(() => import('../pages/landing/BlogsPage'));
const BlogViewPage = React.lazy(() => import('../components/landing/BlogViewPage'));
const AuthLayout = React.lazy(() => import('../layout/AuthLayout'));
const AdminLogin = React.lazy(() => import('../pages/auth/admin/Login'));
const UnlockScreen = React.lazy(() => import('../pages/auth/admin/UnlockScreen'));
const DashboardLayout = React.lazy(() => import('../layout/DashboardLayout'));
const DashboardHome = React.lazy(() => import('../pages/dashboard/DashboardHome'));
const ProtectPrivateAdminRoute = React.lazy(() => import('../components/protectors/ProtectPrivateAdminRoute'));
const AdminProfile = React.lazy(() => import('../pages/dashboard/AdminProfile'));
const CategoryDashboard = React.lazy(() => import('../pages/dashboard/CategoryManagement'));
const ProductFormExample = React.lazy(() => import('../pages/dashboard/product/AddProduct'));
const ProductManagement = React.lazy(() => import('../pages/dashboard/product/ProductManagement'));
const ProductViewPage = React.lazy(() => import('../components/landing/shop/ShopViewPage'));
const ShoppingCartPage = React.lazy(() => import('../pages/landing/ShoppingCartPage'));
const Gallery = React.lazy(() => import('../pages/landing/Gallery'));
const WishlistPage = React.lazy(() => import('../pages/landing/ShoppingWishlist'));
const BlogDashboard = React.lazy(() => import('../pages/dashboard/blog/BlogManagement'));
const BlogFormPage = React.lazy(() => import('../pages/dashboard/blog/BlogFormPage'));
const ProductViewMorePage = React.lazy(() => import('../pages/dashboard/product/ProductViewPage'));
const BlogViewMorePage = React.lazy(() => import('../pages/dashboard/blog/BlogViewMorePage'));
const TestimonialDashboard = React.lazy(() => import('../pages/dashboard/testimonial/TestimonialManagement'));
const TestimonialFormExample = React.lazy(() => import('../pages/dashboard/testimonial/TestimonialFormPage'));
const TestimonialViewMorePage = React.lazy(() => import('../pages/dashboard/testimonial/TestimonialViewMorePage'));
const PaymentStatusPage = React.lazy(() => import('../pages/landing/PaymentStatusPage'));
const ContactMessagesDashboard = React.lazy(() => import('../pages/dashboard/ContactMessage'));
const SubscriberDashboard = React.lazy(() => import('../pages/dashboard/Subscribers'));
const HelpCenter = React.lazy(() => import('../pages/landing/HelpCenterPage'));
const FAQ = React.lazy(() => import('../pages/landing/FaqPage'));
const ShippingInfo = React.lazy(() => import('../pages/landing/ShipingInfoPage'));
const CustomerService = React.lazy(() => import('../pages/landing/CustomerServicePage'));
const SizeGuide = React.lazy(() => import('../pages/landing/SizeGuidePage'));
const TermsAndConditions = React.lazy(() => import('../pages/landing/Terms&Condition'));
const PrivacyPolicy = React.lazy(() => import('../pages/landing/PrivacyPolicyPage'));
const LoginPage = React.lazy(() => import('../pages/auth/purcahing-user/Login'));
const RegisterPage = React.lazy(() => import('../pages/auth/purcahing-user/Register'));
const ProtectPrivatePurchasingUserRoute = React.lazy(() => import('../components/protectors/ProtectPrivatePurchasingUserRoute'));
const OrderDashboard = React.lazy(() => import('../pages/dashboard/order/OrderDashboard'));
const AdminOrderDetailView = React.lazy(() => import('../pages/dashboard/order/AdminOrderDetailView'));
const CustomerOrderDetailView = React.lazy(() => import('../pages/user-dashboard/CustomerOrderDetailView'));
const CustomerOrderDashboard = React.lazy(() => import('../pages/user-dashboard/CustomerOrderDashboard'));
const ErrorBoundary = React.lazy(() => import('../pages/landing/ErrorBoundary'));
const NotFoundPage = React.lazy(() => import('../pages/landing/NotFound'));
const PurchasingUserProfilePage = React.lazy(() => import('../pages/user-dashboard/UserProfilePage'));
const UserDashboard = React.lazy(() => import('../pages/dashboard/UserManagement'));
const RetryPaymentPage = React.lazy(() => import('../pages/landing/RetryPayment'));
const UserDashboardHome = React.lazy(() => import('../pages/user-dashboard/DashboardHome'));


const ProductPage = lazy(() => import('../pages/landing/ShoppingPage'));
const ContactPage = lazy(() => import('../pages/landing/ContactUs'));
const AboutPage = lazy(() => import('../pages/landing/AboutPage'));

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                href="mailto:support@peacebijouterie.rw"
                className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium text-sm"
              >
                support@peacebijouterie.rw
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
            path: 'payments/callback',
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