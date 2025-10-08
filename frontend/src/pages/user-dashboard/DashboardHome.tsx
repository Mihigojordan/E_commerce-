import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  DollarSign,
  Clock,
  CheckCircle,
  Bell,
  Settings,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Package,
} from 'lucide-react';
import orderService, { type Order, type OrderStatus } from '../../services/orderService';
import usePurchasingUserAuth from '../../context/PurchasingUserAuthContext';

// --- Type Definitions ---
interface DashboardData {
  orders: Order[];
  stats: {
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    totalRevenue: number;
  };
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
const UserDashboardHome: React.FC = () => {
  const { user, isAuthenticated, isLoading: authLoading } = usePurchasingUserAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    orders: [],
    stats: {
      totalOrders: 0,
      pendingOrders: 0,
      completedOrders: 0,
      totalRevenue: 0,
    },
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Fetch user orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated || !user?.id) {
        setLoading(false);
        setError('Please log in to view your orders.');
        return;
      }

      setLoading(true);
      setError('');

      try {
        const orders = await orderService.getOrdersByUser(user.id);
        const stats = {
          totalOrders: orders.length,
          pendingOrders: orders.filter((order) => order.status === 'PENDING').length,
          completedOrders: orders.filter((order) => order.status === 'COMPLETED').length,
          totalRevenue: orders.reduce((sum, order) => sum + order.amount, 0),
        };
        setDashboardData({ orders, stats });
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch orders.');
        setDashboardData({ orders: [], stats: { totalOrders: 0, pendingOrders: 0, completedOrders: 0, totalRevenue: 0 } });
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchOrders();
    }
  }, [user, isAuthenticated, authLoading]);

  const statsCards: StatCard[] = [
    {
      label: 'Total Orders',
      value: dashboardData.stats.totalOrders,
      change: '+10%',
      icon: ShoppingCart,
      color: 'bg-primary-500',
      trend: 'up',
    },
    {
      label: 'Pending Orders',
      value: dashboardData.stats.pendingOrders,
      change: '-5%',
      icon: Clock,
      color: 'bg-yellow-500',
      trend: 'down',
    },
    {
      label: 'Completed Orders',
      value: dashboardData.stats.completedOrders,
      change: '+15%',
      icon: CheckCircle,
      color: 'bg-green-500',
      trend: 'up',
    },
    {
      label: 'Total Revenue',
      value: `${dashboardData.stats.totalRevenue.toFixed(2)} USD`,
      change: '+8%',
      icon: DollarSign,
      color: 'bg-blue-500',
      trend: 'up',
    },
  ];

  if (authLoading || loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-5 h-5 text-primary-500 animate-spin" />
          <span className="text-base text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-red-600">{error}</div>
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
              <h1 className="text-xl font-semibold text-gray-900">Order Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">
                Welcome back, {user?.name || 'User'}! Here's your order overview.
              </p>
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
                {dashboardData.orders.slice(0, 3).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Order #{order.id}</p>
                        <p className="text-sm text-gray-500">{order.customerName}</p>
                        <p className="text-sm text-gray-400">{order.currency} {order.amount.toFixed(2)}</p>
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

          {/* Pending Orders */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">Pending Orders</h3>
                <div className="flex items-center space-x-1 bg-yellow-100 px-2 py-1 rounded-lg">
                  <Clock className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-700">
                    {dashboardData.stats.pendingOrders} Pending
                  </span>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {dashboardData.orders
                  .filter((order) => order.status === 'PENDING')
                  .slice(0, 3)
                  .map((order) => (
                    <div key={order.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                            <Package className="w-4 h-4 text-primary-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">Order #{order.id}</p>
                            <p className="text-sm text-gray-500">{order.customerName}</p>
                            <p className="text-sm text-gray-400">{order.currency} {order.amount.toFixed(2)}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-sm px-2 py-1 rounded-lg bg-yellow-100 text-yellow-700">
                            {order.status}
                          </span>
                          <span className="text-sm text-gray-500 mt-1">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button className="w-full text-primary-600 hover:text-primary-700 font-medium text-sm py-2">
                  View All Pending Orders →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Status Breakdown */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">Order Status Breakdown</h3>
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View Details
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { status: 'Pending', count: dashboardData.stats.pendingOrders, color: 'bg-yellow-100', textColor: 'text-yellow-700' },
                  { status: 'Completed', count: dashboardData.stats.completedOrders, color: 'bg-green-100', textColor: 'text-green-700' },
                  { status: 'Cancelled', count: dashboardData.orders.filter((order) => order.status === 'CANCELLED').length, color: 'bg-red-100', textColor: 'text-red-700' },
                ].map((status, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 ${status.color} rounded-lg flex items-center justify-center`}>
                          <Package className={`w-4 h-4 ${status.textColor}`} />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{status.status}</p>
                          <p className="text-sm text-gray-500">{status.count} orders</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* User Profile Summary */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-base font-semibold text-gray-900">Your Profile</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-4 h-4 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{user?.name || 'N/A'}</p>
                    <p className="text-sm text-gray-500">{user?.email || 'N/A'}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button className="w-full text-primary-600 hover:text-primary-700 font-medium text-sm py-2">
                  Edit Profile →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardHome;