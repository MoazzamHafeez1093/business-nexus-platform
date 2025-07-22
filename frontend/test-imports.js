// Test file to verify imports are working
import React from 'react';
import { ChatProvider } from './src/context/ChatContext.jsx';
import { ThemeProvider } from './src/context/ThemeContext.jsx';
import api from './src/services/api.js';

console.log('✅ All imports successful!');
console.log('✅ ChatProvider:', ChatProvider);
console.log('✅ ThemeProvider:', ThemeProvider);
console.log('✅ API:', api); 