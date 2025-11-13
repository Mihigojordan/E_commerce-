import {
  LogOut,
  Menu,
  User,
  ChevronDown,
  ChevronUp,
  Minimize,
  Maximize,
} from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation, useOutletContext } from "react-router-dom";
import useAdminAuth, { type AuthContextType } from "../../context/AuthContext";
import usePurchasingUserAuth, {
  type PurchasingUserAuthContextType,
} from "../../context/PurchasingUserAuthContext";
import { type OutletContextType } from "../../router";

interface HeaderProps {
  onToggle: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path?: string;
  isDropdown?: boolean;
  children?: NavItem[];
  allowedRoles?: string[];
}

const Header: React.FC<HeaderProps> = ({ onToggle }) => {
  const { role } = useOutletContext<OutletContextType>();
  const { user: adminUser, logout: adminLogout } =
    useAdminAuth() as AuthContextType;
  const { user: purchasingUser, logout: userLogout } =
    usePurchasingUserAuth() as PurchasingUserAuthContextType;

  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const navRef = useRef<HTMLDivElement | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user: any = role === "admin" ? adminUser : purchasingUser;
  const logout = role === "admin" ? adminLogout : userLogout;

  const navlinks: NavItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Menu,
      path: `/${role}/dashboard`,
      allowedRoles: ["admin", "user"],
    },
    {
      id: "categoryManagement",
      label: "Category Management",
      icon: Menu,
      path: `/${role}/dashboard/category-management`,
      allowedRoles: ["admin"],
    },
    {
      id: "productManagement",
      label: "Product Management",
      icon: Menu,
      path: `/${role}/dashboard/product-management`,
      allowedRoles: ["admin"],
    },
    {
      id: "blogManagement",
      label: "Blog Management",
      icon: Menu,
      path: `/${role}/dashboard/blog-management`,
      allowedRoles: ["admin"],
    },
    {
      id: "testimonialManagement",
      label: "Testimonial Management",
      icon: Menu,
      path: `/${role}/dashboard/testimonial-management`,
      allowedRoles: ["admin"],
    },
    {
      id: "orderManagement",
      label: "Order Management",
      icon: Menu,
      path: `/${role}/dashboard/order-management`,
      allowedRoles: ["admin"],
    },
    {
      id: "myOrder",
      label: "My Orders",
      icon: Menu,
      path: `/${role}/dashboard/my-order`,
      allowedRoles: ["user"],
    },
  ];

  const filteredNavlinks = navlinks.filter((item) =>
    item.allowedRoles ? item.allowedRoles.includes(role) : true
  );

  const toggleDropdown = (dropdownId: string) => {
    setOpenDropdown(openDropdown === dropdownId ? null : dropdownId);
  };

  const onLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const getDisplayName = (): string => {
    return role === "admin"
      ? user?.names || "Admin User"
      : user?.name || "User";
  };

  const handleNavClick = (path: string) => {
    navigate(path);
    setIsNavOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsNavOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () =>
      setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsNavOpen(false);
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, []);

  const renderNavItem = (item: NavItem) => {
    const Icon = item.icon;
    const isActive = item.path ? location.pathname === item.path : false;

    if (item.isDropdown) {
      const isOpen = openDropdown === item.id;
      const filteredChildren = item.children?.filter((child) =>
        child.allowedRoles ? child.allowedRoles.includes(role) : true
      );
      if (!filteredChildren?.length) return null;

      const hasActiveChild = filteredChildren.some(
        (child) => child.path && location.pathname === child.path
      );

      return (
        <div key={item.id} className="space-y-1">
          <button
            onClick={() => toggleDropdown(item.id)}
            className={`flex items-center justify-between w-full px-3 py-2 text-sm text-gray-700 hover:bg-primary-50 transition-colors ${
              hasActiveChild ? "bg-primary-50 text-primary-600" : ""
            }`}
          >
            <div className="flex items-center space-x-2">
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </div>
            {isOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          {isOpen && (
            <div className="space-y-1 ml-4">
              {filteredChildren.map((child) => (
                <button
                  key={child.id}
                  onClick={() => handleNavClick(child.path!)}
                  className={`flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-primary-50 transition-colors ${
                    location.pathname === child.path
                      ? "bg-primary-50 text-primary-600"
                      : ""
                  }`}
                >
                  <child.icon className="w-4 h-4 mr-2" />
                  {child.label}
                </button>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <button
        key={item.id}
        onClick={() => handleNavClick(item.path!)}
        className={`flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-primary-50 transition-colors ${
          isActive ? "bg-primary-50 text-primary-600" : ""
        }`}
      >
        <Icon className="w-4 h-4 mr-2" />
        {item.label}
      </button>
    );
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center space-x-3">
            <div
              className="w-7 h-7 bg-gradient-to-r from-primary-500 to-teal-500 rounded-lg lg:hidden flex items-center justify-center cursor-pointer hover:from-primary-600 hover:to-teal-600 transition-colors"
              onClick={onToggle}
            >
              <Menu className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-lg font-semibold text-gray-900 hidden sm:block">
              Welcome To Peace Bijouterie Dashboard
            </h1>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2">
            {/* Navigation Dropdown */}
            <div className="relative" ref={navRef}>
              <button
                onClick={() => setIsNavOpen(!isNavOpen)}
                className="flex items-center space-x-1 p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="w-4 h-4" />
                <span className="text-sm hidden md:inline">Navigation</span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-200 ${
                    isNavOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isNavOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                  <div className="py-1">{filteredNavlinks.map(renderNavItem)}</div>
                </div>
              )}
            </div>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isFullscreen ? (
                <Minimize className="w-4 h-4" />
              ) : (
                <Maximize className="w-4 h-4" />
              )}
            </button>

            {/* User Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center overflow-hidden">
                  <User className="w-4 h-4 text-primary-600" />
                </div>
                <div className="text-left hidden md:block">
                  <div className="text-xs font-medium text-gray-700">
                    {getDisplayName()}
                  </div>
                </div>
                <ChevronDown
                  className={`w-3 h-3 text-gray-500 transition-transform duration-200 hidden md:block ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                  <div className="py-1">
                    <div className="px-3 py-2 border-b border-gray-100 bg-primary-50">
                      <div className="text-sm font-medium text-gray-900">
                        {getDisplayName()}
                      </div>
                      <div className="text-xs text-gray-600">
                        {user?.email || "user@example.com"}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        navigate(`/${role}/dashboard/profile`);
                        setIsProfileOpen(false);
                      }}
                      className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-primary-50 transition-colors"
                    >
                      <User className="w-4 h-4 mr-2" />
                      My Profile
                    </button>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={() => {
                        onLogout();
                        setIsProfileOpen(false);
                      }}
                      className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
