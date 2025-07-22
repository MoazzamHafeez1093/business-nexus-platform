import React from 'react';
import { motion } from 'framer-motion';

const InputField = ({ 
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon,
  className = '',
  required = false,
  disabled = false,
  multiline = false,
  rows = 3,
  endIcon,
  ...props 
}) => {
  return (
    <motion.div
      className={`space-y-2 ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400 w-5 h-5">{icon}</span>
          </div>
        )}
        {multiline ? (
          <motion.textarea
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
            className={`
              w-full px-4 py-3 text-sm border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-all duration-200 
              focus:outline-none focus:ring-2 focus:ring-offset-0
              placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed
              ${icon ? 'pl-10' : ''}
              ${endIcon ? 'pr-10' : ''}
              ${error 
                ? 'border-error-300 focus:ring-error-500 focus:border-error-500' 
                : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500 hover:border-gray-400'
              }
            `}
            whileFocus={{ scale: 1.01 }}
            {...props}
          />
        ) : (
          <motion.input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            className={`
              w-full px-4 py-3 text-sm border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-all duration-200 
              focus:outline-none focus:ring-2 focus:ring-offset-0
              placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed
              ${icon ? 'pl-10' : ''}
              ${endIcon ? 'pr-10' : ''}
              ${error 
                ? 'border-error-300 focus:ring-error-500 focus:border-error-500' 
                : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500 hover:border-gray-400'
              }
            `}
            whileFocus={{ scale: 1.01 }}
            {...props}
          />
        )}
        {endIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {endIcon}
          </div>
        )}
      </div>
      
      {error && (
        <motion.p
          className="text-sm text-error-600"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
};

export default InputField;
