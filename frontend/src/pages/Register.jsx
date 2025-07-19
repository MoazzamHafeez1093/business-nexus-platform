import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, User, Mail, Lock, Sparkles, CheckCircle, XCircle, ArrowRight, Building2, Users } from 'lucide-react';
import { authAPI, userAPI } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

// Exact Button component from Entrance.jsx
const Button = ({ children, onClick, variant = 'primary', className = '' }) => {
  const baseClasses = 'relative overflow-hidden font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 active:scale-95 px-8 py-4 text-lg';
  const variants = {
    primary: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-xl focus:ring-indigo-200',
    ghost: 'bg-transparent text-white border-2 border-white/20 hover:bg-white/10 focus:ring-white/20'
  };
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${className}`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
};

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);
  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-lg transform transition-all duration-300 animate-slide-in-right ${
      type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
    }`}>
      {type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
      <span className="font-medium">{message}</span>
    </div>
  );
};

const InputField = ({ label, name, type = 'text', value, onChange, onBlur, error, touched, placeholder, icon: Icon, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === 'password' && showPassword ? 'text' : type;
  return (
    <div className="relative group">
      <label className="block text-sm font-semibold text-gray-200 mb-3 transition-colors">{label}</label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-indigo-400" size={20} />
        )}
        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`w-full ${Icon ? 'pl-12' : 'pl-4'} ${type === 'password' ? 'pr-12' : 'pr-4'} py-4 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 hover:border-white/30 hover:bg-white/15 ${error && touched ? 'border-red-400 focus:border-red-500' : 'focus:border-indigo-500'}`}
          {...props}
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-400 transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      {error && touched && (
        <p className="mt-2 text-sm text-red-400 animate-fade-in">{error}</p>
      )}
    </div>
  );
};

const RoleSelector = ({ value, onChange }) => {
  const roles = [
    { id: 'investor', label: 'Investor', icon: Users, description: 'I want to invest in projects' },
    { id: 'entrepreneur', label: 'Entrepreneur', icon: Building2, description: 'I have a project to pitch' }
  ];
  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-gray-200 mb-3">I am a...</label>
      <div className="grid grid-cols-1 gap-4">
        {roles.map((role) => {
          const Icon = role.icon;
          return (
            <button
              key={role.id}
              type="button"
              onClick={() => onChange(role.id)}
              className={`relative p-4 rounded-xl border-2 transition-all duration-300 text-left group ${value === role.id ? 'border-indigo-500 bg-indigo-500/20 shadow-lg' : 'border-white/20 bg-white/5 hover:border-white/30 hover:bg-white/10'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${value === role.id ? 'bg-indigo-500 text-white' : 'bg-white/10 text-gray-400 group-hover:text-indigo-400'}`}>
                  <Icon size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">{role.label}</h3>
                  <p className="text-sm text-gray-400">{role.description}</p>
                </div>
                {value === role.id && (
                  <CheckCircle className="w-6 h-6 text-indigo-400" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const useFormValidation = (initialState, validationRules) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const validate = (name, value) => {
    const rule = validationRules[name];
    if (!rule) return '';
    if (rule.required && !value.trim()) return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    if (rule.minLength && value.length < rule.minLength) return `${name.charAt(0).toUpperCase() + name.slice(1)} must be at least ${rule.minLength} characters`;
    if (rule.pattern && !rule.pattern.test(value)) return rule.message || `Invalid ${name}`;
    return '';
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    if (touched[name]) setErrors(prev => ({ ...prev, [name]: validate(name, value) }));
  };
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validate(name, value) }));
  };
  const validateAll = () => {
    const newErrors = {};
    const newTouched = {};
    Object.keys(validationRules).forEach(name => {
      newTouched[name] = true;
      const error = validate(name, values[name] || '');
      if (error) newErrors[name] = error;
    });
    setTouched(newTouched);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  return { values, errors, touched, handleChange, handleBlur, validateAll, setValues };
};

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();
  const registerValidation = {
    name: { required: true, minLength: 2 },
    email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Please enter a valid email address' },
    password: { required: true, minLength: 8, pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' }
  };
  const registerForm = useFormValidation({ name: '', email: '', password: '', role: 'investor' }, registerValidation);
  
  const handleRegister = async () => {
    if (!registerForm.validateAll()) return;
    setLoading(true);
    
    try {
      const res = await authAPI.register({
        name: registerForm.values.name,
        email: registerForm.values.email,
        password: registerForm.values.password,
        role: registerForm.values.role
      });
      
      localStorage.setItem('token', res.data.token);
      userAPI.setUserData(res.data.user);
      
      setToast({ message: 'Registration successful! Please login to continue.', type: 'success' });
      
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      setToast({ 
        message: error.response?.data?.message || 'Registration failed. Please try again.', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="w-full flex items-center justify-center">
        <div className="w-full mx-auto max-w-xs sm:max-w-sm md:max-w-md lg:max-w-[40vw] xl:max-w-[30vw] bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl px-6 py-8 border border-white/20">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mb-6 shadow-2xl">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-2">Register</h2>
            <p className="text-gray-300 text-lg">Join our community today</p>
          </div>
          <form className="space-y-6" onSubmit={e => { e.preventDefault(); handleRegister(); }}>
            <InputField label="Full Name" name="name" value={registerForm.values.name} onChange={registerForm.handleChange} onBlur={registerForm.handleBlur} error={registerForm.errors.name} touched={registerForm.touched.name} placeholder="Enter your full name" icon={User} />
            <InputField label="Email Address" name="email" type="email" value={registerForm.values.email} onChange={registerForm.handleChange} onBlur={registerForm.handleBlur} error={registerForm.errors.email} touched={registerForm.touched.email} placeholder="Enter your email" icon={Mail} />
            <InputField label="Password" name="password" type="password" value={registerForm.values.password} onChange={registerForm.handleChange} onBlur={registerForm.handleBlur} error={registerForm.errors.password} touched={registerForm.touched.password} placeholder="Create a strong password" icon={Lock} />
            <RoleSelector value={registerForm.values.role} onChange={(role) => registerForm.setValues({ ...registerForm.values, role })} />
            <Button className="w-full group flex items-center gap-2 justify-center" onClick={handleRegister} variant="primary" type="submit">
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating account...</span>
                </div>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>
          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
};

export default RegisterPage;