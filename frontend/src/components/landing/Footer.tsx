/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  ArrowRight,

  Home,
  Info,
  ShoppingBag,
  User,

  Package,

  Shield,
  Award,
  CheckCircle,
  AlertCircle,

  MessageCircle
} from 'lucide-react';
import Logo from '../../assets/logo.png'


// Mock axios for demonstration
const axios = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  post: async (url: any, data: { email: string | string[]; }) => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (data.email && data.email.includes('@')) {
          resolve({ data: { success: true, message: 'Subscription successful!' } });
        } else {
          reject(new Error('Invalid email address'));
        }
      }, 1000);
    });
  }
};

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  const handleSubscribe = async () => {
    if (!email) {
      setMessage('Please enter your email address');
      setSubscribeStatus('error');
      return;
    }

    setSubscribeStatus('loading');
    setMessage('');

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const response = await axios.post('/api/subscribe', {
        email: email,
        source: 'footer_newsletter'
      });
      
      setSubscribeStatus('success');
      setMessage('Thank you for subscribing! Check your email for confirmation.');
      setEmail('');
    } catch (error) {
      setSubscribeStatus('error');
      setMessage('Subscription failed. Please try again.');
    }
  };

  const mainLinks = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'About', href: '/about', icon: Info },
    { name: 'Products', href: '/products', icon: ShoppingBag },
    { name: 'Services', href: '/services', icon: Package },
    { name: 'Contact', href: '/contact', icon: Phone }
  ];

  const myAccountLinks = [
    'My Profile',
    'Order History',
    'Wishlist',
    'Track Orders',
    'Returns & Refunds',
    'Account Settings',
    'Logout'
  ];

  const supportLinks = [
    'Help Center',
    'Customer Service',
    'Live Chat',
    'FAQ',
    'Shipping Info',
    'Size Guide'
  ];

  const companyLinks = [
    'About ABY HR',
    'Careers',
    'Press',
    'Investor Relations',
    'Corporate Social Responsibility',
    'Sustainability'
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', name: 'Facebook', color: 'hover:text-primary-600' },
    { icon: Twitter, href: '#', name: 'Twitter', color: 'hover:text-primary-400' },
    { icon: Instagram, href: '#', name: 'Instagram', color: 'hover:text-pink-600' },
    { icon: Linkedin, href: '#', name: 'LinkedIn', color: 'hover:text-primary-700' }
  ];

  return (
    <footer className="bg-white border-t border-gray-200 max-w-9xl">
      {/* Newsletter Section */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Mail className="mx-auto mb-4 text-gray-600" size={48} />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Stay Updated with Latest Offers
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter and get exclusive deals, early access to new products, 
              and receive $25 coupon for your first purchase!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto">
              <div className="flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-6 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  disabled={subscribeStatus === 'loading'}
                />
              </div>
              <motion.button
                onClick={handleSubscribe}
                disabled={subscribeStatus === 'loading'}
                whileHover={{ scale: subscribeStatus === 'loading' ? 1 : 1.05 }}
                whileTap={{ scale: subscribeStatus === 'loading' ? 1 : 0.95 }}
                className={`px-8 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${
                  subscribeStatus === 'loading'
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700 text-white'
                }`}
              >
                {subscribeStatus === 'loading' ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Subscribing...
                  </>
                ) : (
                  <>
                    Subscribe <ArrowRight size={18} />
                  </>
                )}
              </motion.button>
            </div>

            {/* Status Message */}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 p-3 rounded-lg flex items-center gap-2 justify-center max-w-xl mx-auto ${
                  subscribeStatus === 'success'
                    ? 'bg-primary-50 text-primary-700 border border-primary-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {subscribeStatus === 'success' ? (
                  <CheckCircle size={16} />
                ) : (
                  <AlertCircle size={16} />
                )}
                {message}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-8xl mx-auto px-8 sm:px-6 lg:px-16 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Company Info & Main Links */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
            <div className="flex items-center space-x-3 mb-6">
     <img src={Logo} alt="" className='h-16 w-48 object-cover' />
</div>

<p className="text-gray-600 mb-6 ml-2 leading-relaxed">
  Discover a wide range of quality products at unbeatable prices.  
  Shop smarter and enjoy a seamless online shopping experience with ABY Store.  
  Fast delivery and secure checkout — everything you need, just a click away.
</p>



              
              <div className="space-y-3">
              
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-primary-600" />
                  <span className="text-gray-700">Kigali Business District, Rwanda</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* My Account */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
              <User size={20} className="text-primary-600" />
              My Account
            </h3>
            <ul className="space-y-2">
              {myAccountLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-primary-600 transition-colors text-sm block py-1"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Customer Support</h3>
            <ul className="space-y-2">
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-primary-600 transition-colors text-sm block py-1"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Company</h3>
            <ul className="space-y-2">
              {companyLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-primary-600 transition-colors text-sm block py-1"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
              <MessageCircle size={20} className="text-primary-600" />
              Contact Info
            </h3>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Phone size={16} className="text-primary-600" />
                  Customer Service
                </h4>
                <p className="text-gray-600 text-sm mb-1">+250 123 456 789</p>
                <p className="text-gray-500 text-xs">Mon-Fri: 8AM - 8PM</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Mail size={16} className="text-primary-600" />
                  Email Support
                </h4>
                <p className="text-gray-600 text-sm mb-1">support@abyhr.com</p>
                <p className="text-gray-500 text-xs">24/7 Online Support</p>
              </div>

             

            </div>
          </motion.div>
        </div>
      </div>

      {/* Security & Trust Badges */}
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center items-center gap-6 text-gray-600"
          >
            <div className="flex items-center gap-2">
              <Shield size={20} className="text-primary-600" />
              <span className="text-sm">SSL Secured</span>
            </div>
            <div className="flex items-center gap-2">
              <Award size={20} className="text-primary-600" />
              <span className="text-sm">Trusted by 50k+ Users</span>
            </div>
            <div className="flex items-center gap-2">
              <Package size={20} className="text-purple-600" />
              <span className="text-sm">Free Shipping over $50</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={20} className="text-primary-600" />
              <span className="text-sm">30-Day Money Back</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 bg-white">
        <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row items-center gap-4 text-gray-600 text-sm"
            >
              <span>© 2025 David ECoomerce Shop. All rights reserved.</span>
              <div className="flex gap-4">
                <a href="#" className="hover:text-primary-600 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-primary-600 transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-primary-600 transition-colors">Cookie Policy</a>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex items-center gap-4"
            >
              <span className="text-gray-600 text-sm">Follow us:</span>
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`text-gray-500 ${social.color} transition-colors`}
                  aria-label={social.name}
                >
                  <social.icon size={20} />
                </motion.a>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;