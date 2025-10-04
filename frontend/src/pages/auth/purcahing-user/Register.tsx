import { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Phone, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import usePurchasingUserAuth from '../../../context/PurchasingUserAuthContext';
import Swal from 'sweetalert2';

interface RegisterData {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
}

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = usePurchasingUserAuth();
  const navigate = useNavigate();

  const validateName = (value: string) => {
    if (!value.trim()) return 'Please enter your full name';
    return '';
  };

  const validateEmail = (value: string) => {
    if (!value.trim()) return 'Please enter your email address';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
    return '';
  };

  const validatePhoneNumber = (value: string) => {
    if (!value.trim()) return 'Please enter your phone number';
    if (!/^\+?[1-9]\d{1,14}$/.test(value)) return 'Please enter a valid phone number';
    return '';
  };

  const validatePassword = (value: string) => {
    if (!value.trim()) return 'Please enter a password';
    if (value.length < 8) return 'Password must be at least 8 characters long';
    return '';
  };

  const validateConfirmPassword = (value: string, password: string) => {
    if (!value.trim()) return 'Please confirm your password';
    if (value !== password) return 'Passwords do not match';
    return '';
  };

  const validateTerms = (value: boolean) => {
    if (!value) return 'Please agree to the Terms of Service and Privacy Policy';
    return '';
  };

  const handleInputChange = (field: string, value: any) => {
    let newError = '';
    switch (field) {
      case 'name':
        setName(value);
        newError = validateName(value);
        break;
      case 'email':
        setEmail(value);
        newError = validateEmail(value);
        break;
      case 'phoneNumber':
        setPhoneNumber(value);
        newError = validatePhoneNumber(value);
        break;
      case 'password':
        setPassword(value);
        newError = validatePassword(value);
        if (confirmPassword && !newError) {
          newError = validateConfirmPassword(confirmPassword, value);
        }
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        newError = validateConfirmPassword(value, password);
        break;
      case 'agreeToTerms':
        setAgreeToTerms(value);
        newError = validateTerms(value);
        break;
    }
    setError(newError);
  };

  const validateAllFields = () => {
    const errors = [
      validateName(name),
      validateEmail(email),
      validatePhoneNumber(phoneNumber),
      validatePassword(password),
      validateConfirmPassword(confirmPassword, password),
      validateTerms(agreeToTerms),
    ].filter((error) => error);
    return errors[0] || ''; // Return the first error, if any
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
      await register({ name, email, phoneNumber, password });
      Swal.fire({
        icon: 'success',
        title: 'Account Created!',
        text: 'Your account has been successfully created.',
        timer: 1500,
        showConfirmButton: false,
      });
      navigate('/auth/user/login');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
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
  }, [name, email, phoneNumber, password, confirmPassword, agreeToTerms]);

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-500 via-teal-500 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold mb-6">Join NovaGems Today!</h1>
            <p className="text-xl opacity-90">
              Create your account and unlock a world of exclusive jewelry. Start your journey with us now.
            </p>
            <div className="mt-12 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-lg">Quick Setup</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-lg">Free Forever</span>
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
                onClick={() => navigate(-1)}
                className='flex cursor-pointer items-center gap-1 '><ChevronLeft size={20} className='font-medium' /> Go back</span>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
            </div>
            <p className="text-gray-600">Fill in your details to get started</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  placeholder="John Doe"
                />
              </div>
            </div>

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
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  placeholder="+250 XXX XXX XXX"
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mt-1 cursor-pointer"
              />
              <span className="ml-2 text-sm text-gray-600">
                I agree to the{' '}
                <button
                  onClick={() => navigate('/terms-condition')}
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  Terms of Service
                </button>{' '}
                and{' '}
                <button
                  onClick={() => navigate('/privacy-policy')}
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  Privacy Policy
                </button>
              </span>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/auth/user/login')}
                className="text-green-600 hover:text-green-700 font-semibold"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;