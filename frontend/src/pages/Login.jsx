import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import { authAPI, userAPI } from '../services/api';

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false, type = 'button' }) => {
  const baseClasses = 'relative overflow-hidden font-semibold rounded-xl transition-all duration-300 transform focus:outline-none focus:ring-4 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg shadow-lg w-full';
  const variants = {
    primary: `${disabled ? 'bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 hover:scale-105 active:scale-95'} text-white focus:ring-blue-300`,
    ghost: 'bg-transparent text-white border-2 border-white/30 hover:bg-white/10 hover:border-white/50 focus:ring-white/20'
  };
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-1000"></span>
      <span className="relative z-10">
        {children}
      </span>
    </button>
  );
};

const InputField = ({ 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  error, 
  icon: Icon,
  showPasswordToggle = false,
  name,
  className
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const inputType = type === 'password' && showPassword ? 'text' : type;
  
  return (
    <div className="relative group">
      <label className={`block text-sm font-semibold mb-3 transition-colors duration-300 ${isFocused ? 'text-blue-300' : 'text-gray-300'}`}>
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon 
            className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
              isFocused ? 'text-blue-400' : error ? 'text-red-400' : 'text-gray-400'
            }`} 
            size={20} 
          />
        )}
        <input
          type={inputType}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full ${Icon ? 'pl-12' : 'pl-4'} ${showPasswordToggle ? 'pr-12' : 'pr-4'} py-3 sm:py-4 bg-white/5 border-2 rounded-xl text-white placeholder-gray-500 transition-all duration-300 focus:outline-none focus:ring-4 backdrop-blur-sm text-sm sm:text-base ${
            error 
              ? 'border-red-400 focus:border-red-300 focus:ring-red-300/20' 
              : isFocused
                ? 'border-blue-400 focus:border-blue-300 focus:ring-blue-300/20 bg-white/10'
                : 'border-white/20 hover:border-white/40 hover:bg-white/10'
          } ${className}`}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-400 transition-colors duration-300"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-400 flex items-center gap-2 animate-fade-in">
          <XCircle size={16} />
          {error}
        </p>
      )}
    </div>
  );
};

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl backdrop-blur-md border transform transition-all duration-500 animate-slide-in-right ${
      type === 'success'
        ? 'bg-emerald-500/90 border-emerald-400 text-white'
        : 'bg-red-500/90 border-red-400 text-white'
    }`}>
      {type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
      <span className="font-medium">{message}</span>
    </div>
  );
};

const FloatingParticles = () => {
  const particles = Array.from({ length: 20 }, (_, i) => (
    <div
      key={i}
      className="absolute w-2 h-2 bg-blue-400/30 rounded-full animate-float"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 10}s`,
        animationDuration: `${10 + Math.random() * 10}s`
      }}
    />
  ));

  return <div className="absolute inset-0 overflow-hidden pointer-events-none">{particles}</div>;
};

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const res = await authAPI.login({ email: formData.email, password: formData.password });
      localStorage.setItem('token', res.data.token);
      userAPI.setUserData(res.data.user);
      setToast({ message: 'Login successful! Redirecting...', type: 'success' });
      setTimeout(() => {
        navigate(`/dashboard/${res.data.user.role}`);
      }, 1000);
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Login failed', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <div className="w-full flex items-center justify-center">
        <div className="w-full mx-auto max-w-xs sm:max-w-sm md:max-w-md lg:max-w-[40vw] xl:max-w-[30vw] bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl px-6 py-8 border border-white/20">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mb-6 shadow-2xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Sign In</h2>
            <p className="text-gray-300">Sign in to your account</p>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <InputField
              label="Email Address"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              icon={Mail}
            />
            <InputField
              label="Password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              icon={Lock}
              showPasswordToggle={true}
            />
            <Button
              type="submit"
              className="group flex items-center gap-2 justify-center mx-auto mt-2"
              disabled={loading}
              variant="primary"
              style={{minWidth: '8rem'}}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </form>
          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
};

export default Login;