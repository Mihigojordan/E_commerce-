import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  Package,
  Users,
  DollarSign,
  Calendar,
  Clock,
  TrendingUp,
  Bell,
  Settings,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Layers,
  Star,
  Mail,
  FileText,
  Tag
} from 'lucide-react';

import orderService, { type Order } from '../../services/orderService';
import productService, { type Product } from '../../services/ProductService';
import purchasingUserService, { type PurchasingUser } from '../../services/purchasingUserService';
import testimonialService, { type Testimonial } from '../../services/testmonialService';
import subscriberService, { type Subscriber } from '../../services/subscribeService';
import contactService, { type ContactMessage } from '../../services/contactService';
import blogService, { type Blog } from '../../services/blogService';
import categoryService, { type Category } from '../../services/categoryService';

// --- Type Definitions ---
interface RecentOrder {
  id: string;
  customerName: string;
  amount: number;
  status: string;
  createdAt: string;
}

interface PendingContact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

interface RecentBlog {
  id: string;
  title: string;
  createdAt: string;
}

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
  newOrders: number;
  pendingOrders: number;
  lowStockProducts: number;
  totalCategories: number;
  totalSubscribers: number;
  totalTestimonials: number;
}

interface DashboardData {
  products: Product[];
  orders: Order[];
  users: PurchasingUser[];
  testimonials: Testimonial[];
  subscribers: Subscriber[];
  contacts: ContactMessage[];
  blogs: Blog[];
  categories: Category[];
  lowStockProducts: Product[];
  stats: Stats;
}

interface StatCard {
  label: string;
  value: string | number;
  change: string;
  icon: React.FC<any>;
  color: string;
  trend: 'up' | 'down';
}

// --- Component ---
const DashboardHome: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    products: [],
    orders: [],
    users: [],
    testimonials: [],
    subscribers: [],
    contacts: [],
    blogs: [],
    categories: [],
    lowStockProducts: [],
    stats: {
      totalProducts: 0,
      totalOrders: 0,
      totalCustomers: 0,
      totalRevenue: 0,
      newOrders: 0,
      pendingOrders: 0,
      lowStockProducts: 0,
      totalCategories: 0,
      totalSubscribers: 0,
      totalTestimonials: 0,
    }
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          productsRes,
          orders,
          users,
          testimonials,
          subscribers,
          contacts,
          blogs,
          categories,
          lowStock
        ] = await Promise.all([
          productService.getAllProducts(),
          orderService.getAllOrders(),
          purchasingUserService.getAllUsers(),
          testimonialService.getAllTestimonials(),
          subscriberService.getAllSubscribers(),
          contactService.getAllMessages(),
          blogService.getAllBlogs(),
          categoryService.getAllCategories(),
          productService.getLowStockProducts(10) // threshold 10
        ]);

        const products = productsRes.data;

        // Calculate stats
        const currentDate = new Date('2025-10-04');
        const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;

        const totalRevenue = orders
          .filter(o => o.status === 'COMPLETED')
          .reduce((sum, o) => sum + o.amount, 0);

        const newOrders = orders.filter(o => o.createdAt.startsWith(currentMonth)).length;

        const pendingOrders = orders.filter(o => o.status === 'PENDING').length;

        const stats: Stats = {
          totalProducts: products.length,
          totalOrders: orders.length,
          totalCustomers: users.length,
          totalRevenue,
          newOrders,
          pendingOrders,
          lowStockProducts: lowStock.length,
          totalCategories: categories.length,
          totalSubscribers: subscribers.length,
          totalTestimonials: testimonials.length,
        };

        setDashboardData({
          products,
          orders,
          users,
          testimonials,
          subscribers,
          contacts,
          blogs,
          categories,
          lowStockProducts: lowStock,
          stats
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Prepare recent orders (last 3, sorted by createdAt desc)
  const recentOrders = [...dashboardData.orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3)
    .map(order => ({
      id: order.id,
      customerName: order.customerName,
      amount: order.amount,
      status: order.status,
      createdAt: order.createdAt
    }));

  // Prepare pending contacts (last 3, sorted by createdAt desc)
  const pendingContacts = [...dashboardData.contacts]
    .sort((a, b) => new Date(b.createdAt ?? '').getTime() - new Date(a.createdAt ?? '').getTime())
    .slice(0, 3);

  // Prepare recent blogs (last 3, sorted by createdAt desc)
  const recentBlogs = [...dashboardData.blogs]
    .sort((a, b) => new Date(b.createdAt ?? '').getTime() - new Date(a.createdAt ?? '').getTime())
    .slice(0, 3)
    .map(blog => ({
      id: blog.id,
      title: blog.title,
      createdAt: blog.createdAt ?? ''
    }));

  const statsCards: StatCard[] = [
    {
      label: 'Total Products',
      value: dashboardData.stats.totalProducts,
      change: '+5.2%',
      icon: Package,
      color: 'bg-primary-500',
      trend: 'up'
    },
    {
      label: 'Total Orders',
      value: dashboardData.stats.totalOrders,
      change: '+12%',
      icon: ShoppingCart,
      color: 'bg-primary-500',
      trend: 'up'
    },
    {
      label: 'Total Customers',
      value: dashboardData.stats.totalCustomers,
      change: '+2.1%',
      icon: Users,
      color: 'bg-primary-500',
      trend: 'up'
    },
    {
      label: 'Total Revenue',
      value: `$${dashboardData.stats.totalRevenue.toLocaleString()}`,
      change: '+15%',
      icon: DollarSign,
      color: 'bg-primary-500',
      trend: 'up'
    }
  ];

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-5 h-5 text-primary-500 animate-spin" />
          <span className="text-base text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">NovaGems Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">Welcome back! Here's your e-commerce overview.</p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Search className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors relative">
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                  <p className="text-xl font-semibold text-gray-900 mt-2">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    {stat.trend === 'up' ? (
                      <ArrowUpRight className="w-4 h-4 text-green-500" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`text-sm font-medium ml-1 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">vs last month</span>
                  </div>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center shadow-sm`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">Recent Orders</h3>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <ShoppingCart className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{order.customerName}</p>
                        <p className="text-sm text-gray-500">${order.amount.toLocaleString()}</p>
                        <p className="text-sm text-gray-400">{order.status}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-medium text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button className="w-full text-primary-600 hover:text-primary-700 font-medium text-sm py-2">
                  View All Orders →
                </button>
              </div>
            </div>
          </div>

          {/* Pending Contacts */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">Recent Contact Messages</h3>
                <div className="flex items-center space-x-1 bg-yellow-100 px-2 py-1 rounded-lg">
                  <Mail className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-700">
                    {dashboardData.contacts.length} Total
                  </span>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {pendingContacts.map((contact) => (
                  <div key={contact.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                          <Mail className="w-4 h-4 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{contact.firstName} {contact.lastName}</p>
                          <p className="text-sm text-gray-500">{contact.email}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-sm text-gray-500 mt-1">
                          {new Date(contact.createdAt ?? '').toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button className="w-full text-primary-600 hover:text-primary-700 font-medium text-sm py-2">
                  View All Messages →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Category Overview */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">Category Overview</h3>
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View Details
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dashboardData.categories.map((cat) => (
                  <div key={cat.id} className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                          <Tag className="w-4 h-4 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{cat.name}</p>
                          <p className="text-sm text-gray-500">{cat.subCategory ?? 'No subcategory'}</p>
                        </div>
                      </div>
                      <span className="text-green-600 text-sm font-medium">
                        {cat.status ?? 'Active'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Blogs */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-base font-semibold text-gray-900">Recent Blogs</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentBlogs.map((blog) => (
                  <div key={blog.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{blog.title}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{new Date(blog.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button className="w-full text-primary-600 hover:text-primary-700 font-medium text-sm py-2">
                  View All Blogs →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;