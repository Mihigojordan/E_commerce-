import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  User,
  Phone,

  ShoppingCart,
  Heart,
  MapPin,
  Globe,
  Facebook,
  Twitter,
  Instagram,
  PhoneCall
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import Logo from '../../assets/logo.png'
import SearchBar from './SearchBar';

type NavLink = {
  name: string;
  path: string;
};

type Country = {
  code: string;
  name: string;
  flag: string;
};

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [selectedCountry, setSelectedCountry] = useState<Country>({
    code: 'US',
    name: 'English',
    flag: '🇺🇸'
  });
  const [showCountryDropdown, setShowCountryDropdown] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigate = useNavigate()
  const {cart} = useCart()
  const {wishlist} = useWishlist()

  const links: NavLink[] = [
    { name: 'Home', path: "/" },
    { name: 'About Us', path: "/about" },
    { name: 'Product', path: "/products" },
     { name: 'Our Gallery', path: "/gallery" },
    { name: 'News & Update', path: "/blogs" },
    { name: 'Contact Us', path: "/contact" },
  ];

  const countries: Country[] = [
    { code: 'US', name: 'English', flag: '🇺🇸' },
    { code: 'FR', name: 'Français', flag: '🇫🇷' },
    { code: 'ES', name: 'Español', flag: '🇪🇸' },
    { code: 'DE', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'RW', name: 'Kinyarwanda', flag: '🇷🇼' }
  ];

  // Handle navigation
  const handleNavigate = (path?: string) => {
    setIsOpen(false);
    if (!path) return;
    navigate(path)
  };

  // Handle search
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSearch = () => {
    console.log(`Searching for: ${searchQuery}`);
  };

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top Header Bar */}
      <div className="bg-primary-600 text-white py-2 px-4 text-sm">
        <div className="max-w-8xl mx-auto flex justify-between px-10 items-center">
          {/* Left Section - Contact Info */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Phone size={12} />
              <span>(+01) - 2345 - 6789</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin size={12} />
              <span>Our location</span>
            </div>
          </div>

          {/* Middle Section - Promotional Banner */}
          <div className="hidden md:block">
            <span className="animate-pulse">Trendy 25% off jewelry, save up 25% off today! Shop now</span>
          </div>

          {/* Right Section - Language & Social */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                className="flex items-center space-x-1 hover:bg-primary-700 px-2 py-1 rounded transition-colors duration-200"
              >
                <Globe size={12} />
                <span className="text-xs">{selectedCountry.flag} {selectedCountry.name}</span>
              </button>
              
              {showCountryDropdown && (
                <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-40">
                  {countries.map((country) => (
                    <button
                      key={country.code}
                      onClick={() => {
                        setSelectedCountry(country);
                        setShowCountryDropdown(false);
                      }}
                      className="flex items-center space-x-2 w-full px-3 py-2 text-gray-700 hover:bg-gray-100 text-sm"
                    >
                      <span>{country.flag}</span>
                      <span>{country.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Social Media Links */}
            <div className="flex items-center space-x-2">
              <Facebook size={14} className="hover:text-blue-400 cursor-pointer transition-colors" />
              <Twitter size={14} className="hover:text-blue-400 cursor-pointer transition-colors" />
              <Instagram size={14} className="hover:text-pink-400 cursor-pointer transition-colors" />
            </div>

            {/* Login/Signup */}
            <div className="flex items-center space-x-1 text-xs">
              <User size={12} />
              <span>
                <span className='cursor-pointer' onClick={()=> navigate('/auth/user/login')}>Log In</span> 
                {' '}
                / 
                {' '}
                <span className='cursor-pointer' onClick={()=> navigate('/auth/user/register')}> Sign Up</span> 
               
                </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Section */}
      <nav className={`bg-white shadow-md sticky top-0 z-40 transition-all duration-300 ${
        scrolled ? 'shadow-lg bg-white/95 backdrop-blur-sm' : 'shadow-md'
      }`}>
        {/* Top Section - Logo, Search, Cart */}
        <div className="border-b border-gray-100">
          <div className="max-w-8xl mx-auto px-16 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex-shrink-0 cursor-pointer" onClick={() => handleNavigate('/')}>
                <div className="flex items-center space-x-3">
             
                  <div>
                  <img src={Logo} alt="" className='h-24 scale-125' />
                  </div>
                </div>
              </div>

              {/* Search Bar */}
              <div className="flex-1 max-w-2xl mx-8 hidden md:block">
               <SearchBar />
              </div>

              {/* Cart and Wishlist */}
              <div className="flex items-center space-x-4">
                <div 
                 onClick={()=> handleNavigate('/wishlist')}
                className="relative cursor-pointer group"
                >
                  <Heart size={24} className="text-gray-600 group-hover:text-primary-600 transition-colors" />
                  <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{wishlist.length}</span>
                </div>
                <div 
                onClick={()=> handleNavigate('/cart')}
                className="relative cursor-pointer group"
                 >
                  <ShoppingCart size={24} className="text-gray-600 group-hover:text-primary-600 transition-colors" />
                <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{cart?.length}</span>
                </div>

                {/* Mobile menu button */}
                <div className="md:hidden">
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-300"
                  >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Search */}
            <div className="md:hidden mt-4">
              <SearchBar isMobile />
            </div>
          </div>
        </div>

        {/* Bottom Section - Categories and Navigation */}
        <div className="max-w-8xl mx-auto px-16">
          <div className="flex items-center justify-between h-14">
            {/* Browse Categories */}
            <div className="hidden lg:flex items-center">
              <button className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                <Menu size={16} />
                <span className="font-medium">Browse Categories</span>
              </button>
            </div>

            {/* Main Navigation Links */}
            <div className="hidden lg:flex items-center space-x-8">
              {links.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleNavigate(item.path)}
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-300 relative group"
                >
                  {item.name}
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300"></div>
                </button>
              ))}
            </div>

            {/* Hotline */}
            <div className="hidden lg:flex items-center space-x-2 text-primary-600">
              <PhoneCall size={16} />
              <div>
                <div className="text-xs text-gray-500">Hotline</div>
                <div className="font-bold">1900 - 888</div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`lg:hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden bg-white border-t border-gray-100`}>
          <div className="px-4 py-6 space-y-3">
            <button className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg w-full">
              <Menu size={16} />
              <span>Browse Categories</span>
            </button>
            
            {links.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavigate(item.path)}
                className="block w-full text-left px-12 ml-16 py-3 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg  transition-all duration-300"
              >
                {item.name}
              </button>
            ))}
            
            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-2 text-primary-600 px-4">
                <PhoneCall size={16} />
                <div>
                  <div className="text-xs text-gray-500">Hotline</div>
                  <div className="font-bold">1900 - 888</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Backdrop for dropdown */}
      {showCountryDropdown && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowCountryDropdown(false)}
        />
      )}
    </>
  );
};

export default Navbar;