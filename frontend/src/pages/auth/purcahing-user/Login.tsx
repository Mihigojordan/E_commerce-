import { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, ChevronLeft } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import usePurchasingUserAuth from '../../../context/PurchasingUserAuthContext';
import Swal from 'sweetalert2';
import { nav } from 'framer-motion/client';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login ,isAuthenticated , isLoading:authLoading } = usePurchasingUserAuth();

  
    // Redirect if already authenticated
    useEffect(() => {
      if (isAuthenticated && !authLoading) {
        const from =  "/user/dashboard";
        navigate(from);
      }
    }, [isAuthenticated, authLoading, location, navigate]);

  const validateEmail = (value: string) => {
    if (!value.trim()) return 'Please enter your email address';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
    return '';
  };

  const validatePassword = (value: string) => {
    if (!value.trim()) return 'Please enter your password';
    return '';
  };

  const handleInputChange = (field: string, value: string) => {
    let newError = '';
    switch (field) {
      case 'email':
        setEmail(value);
        newError = validateEmail(value);
        break;
      case 'password':
        setPassword(value);
        newError = validatePassword(value);
        break;
    }
    setError(newError);
  };

  const validateAllFields = () => {
    const errors = [
      validateEmail(email),
      validatePassword(password),
    ].filter((error) => error);
    return errors[0] || '';
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const validationError = validateAllFields();
    if (validationError) {
      setError(validationError);
      setIsLoading(false);
      return;
    }

    try {
    const response =  await login({ email, password });
      Swal.fire({
        icon: 'success',
        title: 'Logged In!',
        text: 'You have successfully logged in.',
        timer: 1500,
        showConfirmButton: false,
      });
     
      if (response) {
        const from =  "/user/dashboard";
        navigate(from);
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  // Clear error when all fields are valid
  useEffect(() => {
    const validationError = validateAllFields();
    if (!validationError) {
      setError('');
    }
  }, [email, password]);

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-500 via-teal-500 to-green-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold mb-6">Welcome Back!</h1>
            <p className="text-xl opacity-90">
              Sign in to continue your journey with Peace Bijouterie. Access your account and explore our exclusive jewelry collection.
            </p>
            <div className="mt-12 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-lg">Secure Authentication</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-lg">Fast & Reliable</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white overflow-y-auto">
        <div className="w-full max-w-md py-8">

          <div className="mb-8">
            <div className="flex  flex-col gap-5 justify-between">

            <span 
            onClick={()=>navigate('/products')}
            className='flex cursor-pointer items-center gap-1 '><ChevronLeft size={20} className='font-medium' /> Go back</span>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
            </div>
            <p className="text-gray-600">Enter your credentials to access your account</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/auth/user/register')}
                className="text-green-600 hover:text-green-700 font-semibold"
              >
                Create Account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;