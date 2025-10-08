import React, { useEffect, useState } from "react";
import {
  TrendingUp,
  User,
  X,
  Store,
  Layers,
  ChevronDown,
  ChevronUp,
  Newspaper,
  MessageSquareQuote,
  ShoppingCart,
  Users,
  Package,
} from "lucide-react";
import { NavLink, useLocation, useNavigate, useOutletContext } from "react-router-dom";
import useAdminAuth from "../../context/AuthContext";
import Logo from '../../assets/logo.png';
import type { OutletContextType } from "../../router";
import usePurchasingUserAuth from "../../context/PurchasingUserAuthContext";

interface SidebarProps {
  isOpen?: boolean;
  onToggle: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path?: string;
  isDropdown?: boolean;
  children?: NavItem[];
  allowedRoles?: string[]; // Add role-based access control
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onToggle }) => {
  const { role } = useOutletContext<OutletContextType>();
  const { user:adminData } = useAdminAuth();
  const { user:userData } = usePurchasingUserAuth();

  
  const user : any = role == 'admin' ? adminData : userData;
  const navigate = useNavigate();
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Auto-open dropdowns based on current path
  useEffect(() => {
    const currentPath = location.pathname;
    const materialPages = [
      `/${role}/dashboard/material-management`,
      `/${role}/dashboard/category-management`,
      `/${role}/dashboard/units-management`,
    ];
    const sitePages = [
      `/${role}/dashboard/site-assign-management`,
      `/${role}/dashboard/site-management`
    ];

    if (materialPages.includes(currentPath)) {
      setOpenDropdown("materialManagement");
    } 
    else if(sitePages.includes(currentPath)){
      setOpenDropdown("siteManagement");
    }
    else {
      setOpenDropdown(null);
    }
  }, [location.pathname]);

  const toggleDropdown = (dropdownId: string) => {
    setOpenDropdown(openDropdown === dropdownId ? null : dropdownId);
  };

  // Define navigation items with role permissions
  const navlinks: NavItem[] = [
    { 
      id: "dashboard", 
      label: "Dashboard", 
      icon: TrendingUp, 
      path: `/${role}/dashboard`,
      allowedRoles: ["admin", "user"] // Both can access dashboard
    },
    { 
      id: "Category", 
      label: "Category Management", 
      icon: Layers, 
      path: `/${role}/dashboard/category-management`,
      allowedRoles: ["admin"] // Only admin
    },
    { 
      id: "Product Management", 
      label: "Product Management", 
      icon: Store, 
      path: `/${role}/dashboard/product-management`,
      allowedRoles: ["admin",] // Both can access
    },
    { 
      id: "Blog Management", 
      label: "Blog Management", 
      icon: Newspaper, 
      path: `/${role}/dashboard/blog-management`,
      allowedRoles: ["admin"] // Only admin
    },
    { 
      id: "Testimonial Management", 
      label: "Testimonial Management", 
      icon: MessageSquareQuote, 
      path: `/${role}/dashboard/testimonial-management`,
      allowedRoles: ["admin"] // Both can access
    },
    { 
      id: "Order Management", 
      label: "Order Management", 
      icon: ShoppingCart, 
      path: `/${role}/dashboard/order-management`,
      allowedRoles: ["admin"] // Both can access
    },
    { 
      id: "User Management", 
      label: "User Management", 
      icon: Users, 
      path: `/${role}/dashboard/user-management`,
      allowedRoles: ["admin"] // Both can access
    },
    { 
      id: "My Order Management", 
      label: "My Orders", 
      icon: Package, 
      path: `/${role}/dashboard/my-orders`,
      allowedRoles: ["user"] // Both can access
    },
  ];

  // Filter navigation items based on user role
  const filteredNavlinks = navlinks.filter((item) => {
    // If no allowedRoles specified, show to everyone
    if (!item.allowedRoles) return true;
    
    // Check if user's role is in the allowed roles
    return item.allowedRoles.includes(role);
  });

  const getProfileRoute = () => `/${role}/dashboard/profile`;

  const handleNavigateProfile = () => {
    const route = getProfileRoute();
    if (route) navigate(route, { replace: true });
  };

  const renderMenuItem = (item: NavItem) => {
    const Icon = item.icon;
    const isActive = item.path ? location.pathname === item.path : false;

    if (item.isDropdown) {
      const isOpen = openDropdown === item.id;
      
      // Filter children based on role
      const filteredChildren = item.children?.filter((child) => {
        if (!child.allowedRoles) return true;
        return child.allowedRoles.includes(role);
      });

      // Don't show dropdown if no accessible children
      if (!filteredChildren || filteredChildren.length === 0) return null;

      const hasActiveChild = filteredChildren.some(
        (child) => child.path && location.pathname === child.path
      );

      return (
        <div key={item.id} className="space-y-1">
          <button
            onClick={() => toggleDropdown(item.id)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 group ${hasActiveChild
              ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white"
              : "text-black hover:bg-primary-50"
              }`}
          >
            <div className="flex items-center space-x-2">
              <Icon
                className={`w-4 h-4 ${hasActiveChild ? "text-white" : "text-gray-600 group-hover:text-primary-600"}`}
              />
              <span className="text-sm font-light">{item.label}</span>
            </div>
            <div className="transition-transform duration-200">
              {isOpen ? <ChevronUp className={`w-4 h-4 ${hasActiveChild ? "text-white" : "text-gray-600 group-hover:text-primary-600"}`} />
                       : <ChevronDown className={`w-4 h-4 ${hasActiveChild ? "text-white" : "text-gray-600 group-hover:text-primary-600"}`} />}
            </div>
          </button>
          {isOpen && (
            <div className="space-y-1 ml-4">
              {filteredChildren.map((child) => (
                <NavLink
                  key={child.id}
                  to={child.path!}
                  end
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${isActive
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-600 hover:bg-primary-50 hover:text-primary-700"
                    }`
                  }
                  onClick={() => { if (window.innerWidth < 1024) onToggle(); }}
                >
                  <child.icon className="w-4 h-4" />
                  <span className="text-xs">{child.label}</span>
                </NavLink>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <NavLink
        key={item.id}
        to={item.path!}
        end
        className={({ isActive }) =>
          `w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 group ${isActive
            ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white"
            : "text-black hover:bg-primary-50"
          }`
        }
        onClick={() => { if (window.innerWidth < 1024) onToggle(); }}
      >
        <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-600 group-hover:text-primary-600"}`} />
        <span className="text-sm font-light">{item.label}</span>
      </NavLink>
    );
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onToggle} />}
      <div className={`fixed left-0 top-0 min-h-screen bg-white flex flex-col border-r border-primary-200 shadow-lg transform transition-transform duration-300 z-50 lg:relative lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"} w-64 lg:w-70`}>
        <div className="flex items-center justify-between p-4 border-b border-primary-200">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-[180px] h-8  rounded-lg">
              <div className="flex items-center space-x-0.5">
                <img src={Logo} alt="" className="h-[160px] w-[220px]" />
              </div>
            </div>
            <div>
            </div>
          </div>
          <button onClick={onToggle} className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <nav className="space-y-1">
            {filteredNavlinks.map(renderMenuItem)}
          </nav>
        </div>

        <div className="p-3 border-t border-primary-200 cursor-pointer" onClick={handleNavigateProfile}>
          <div className="flex items-center space-x-2 p-2 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-primary-600" />
            </div>
            {
              role == 'admin'   ?

              <div className="flex-1 min-w-0">
              <p className="text-xs font-normal text-gray-900 truncate">{user?.names || "Admin User"}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email || "admin@example.com"}</p>
            </div>
            :
            <div className="flex-1 min-w-0">
              <p className="text-xs font-normal text-gray-900 truncate">{user?.name || " User"}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email || "user@example.com"}</p>
            </div>
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;