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
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import useAdminAuth from "../../context/AuthContext";
import Logo from '../../assets/logo.png';

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
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onToggle }) => {
  const { user } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Auto-open dropdowns based on current path
  useEffect(() => {
    const currentPath = location.pathname;
    const materialPages = [
      "/admin/dashboard/material-management",
      "/admin/dashboard/category-management",
      "/admin/dashboard/units-management",
    ];
    const sitePages = [
      "/admin/dashboard/site-assign-management",
      "/admin/dashboard/site-management"
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

  const navlinks: NavItem[] = [
    { id: "dashboard", label: "Dashboard", icon: TrendingUp, path: "/admin/dashboard" },
    { id: "Category", label: "Category Management", icon: Layers, path: "/admin/dashboard/category-management" },
    { id: "Product Management", label: "Product Management", icon: Store, path: "/admin/dashboard/product-management" },
    { id: "Product Management", label: "Blog Management", icon: Newspaper, path: "/admin/dashboard/blog-management" },
    { id: "Contact Message", label: "Contact Message", icon: Newspaper, path: "/admin/dashboard/contact-message" },
 
          { id: "Subscribers", label: "Subscribers Message", icon: Newspaper, path: "/admin/dashboard/subscribe-message" },
 
  ];

  const getProfileRoute = () => "/admin/dashboard/profile";

  const handleNavigateProfile = () => {
    const route = getProfileRoute();
    if (route) navigate(route, { replace: true });
  };

  const renderMenuItem = (item: NavItem) => {
    const Icon = item.icon;
    const isActive = item.path ? location.pathname === item.path : false;

    if (item.isDropdown) {
      const isOpen = openDropdown === item.id;
      const hasActiveChild = item.children?.some(
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
              {item.children?.map((child) => (
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
            {navlinks.map(renderMenuItem)}
          </nav>
        </div>

        <div className="p-3 border-t border-primary-200 cursor-pointer" onClick={handleNavigateProfile}>
          <div className="flex items-center space-x-2 p-2 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-primary-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-normal text-gray-900 truncate">{user?.names || "Admin User"}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email || "admin@example.com"}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
