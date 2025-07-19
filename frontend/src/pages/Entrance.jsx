import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, TrendingUp, Users, Shield, Zap, Globe, DollarSign } from 'lucide-react';
import './Entrance.css';

const Button = ({ children, onClick, variant = 'primary', className = '', size = 'lg', icon }) => {
  const sizeClasses = {
    md: 'px-8 py-3 text-lg',
    lg: 'px-10 py-4 text-xl',
    xl: 'px-12 py-5 text-2xl'
  };

  const baseClasses = `relative overflow-hidden font-bold rounded-2xl transition-all duration-500 transform hover:scale-105 focus:outline-none focus:ring-4 active:scale-95 group ${sizeClasses[size]} shadow-2xl`;
  
  const variants = {
    primary: 'bg-gradient-to-r from-teal-600 via-purple-600 to-indigo-700 text-white hover:from-teal-500 hover:via-purple-500 hover:to-indigo-600 focus:ring-teal-200 border-2 border-teal-400/30',
    secondary: 'bg-gradient-to-r from-gold-600 to-amber-700 text-white border-2 border-gold-600 hover:from-gold-500 hover:to-amber-600 focus:ring-gold-200'
  };
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${className}`}
      onClick={onClick}
    >
      <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
      <span className="relative z-10 flex items-center justify-center gap-3">
        {icon && <span className="text-white">{icon}</span>}
        {children}
        {variant === 'primary' && <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-2" />}
      </span>
    </button>
  );
};

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }) => (
  <div 
    className="group relative bg-white/5 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/10 hover:border-teal-400/50 transition-all duration-500 hover:bg-white/10 transform hover:-translate-y-2"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-purple-600/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    <div className="relative z-10">
      <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
        <Icon className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
      <p className="text-gray-300 leading-relaxed">{description}</p>
    </div>
  </div>
);

const StatCard = ({ number, label, icon: Icon }) => (
  <div className="text-center group">
    <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
      <Icon className="w-10 h-10 text-white" />
    </div>
    <div className="text-3xl sm:text-4xl font-bold text-white mb-2">{number}</div>
    <div className="text-gray-300 text-base sm:text-lg">{label}</div>
  </div>
);

const ParticleBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles = [];
    const particleCount = 80;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.2
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(45, 212, 191, ${particle.alpha})`;
        ctx.fill();
      });

      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
          const distance = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(45, 212, 191, ${0.1 * (1 - distance / 100)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
};

const Entrance = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: TrendingUp,
      title: "AI-Powered Matching",
      description: "Our advanced algorithm analyzes investment patterns and startup profiles to create perfect matches, maximizing success rates."
    },
    {
      icon: Users,
      title: "Global Network",
      description: "Connect with over 50,000+ verified investors and entrepreneurs across 120+ countries in our thriving ecosystem."
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade encryption, multi-factor authentication, and regulatory compliance ensure your investments are always protected."
    }
  ];

  const stats = [
    { number: "50K+", label: "Active Users", icon: Users },
    { number: "$2.5B", label: "Funded", icon: DollarSign },
    { number: "120+", label: "Countries", icon: Globe }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-teal-900 relative overflow-hidden">
      {/* Particle Background */}
      <ParticleBackground />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 via-transparent to-teal-900/80"></div>
      
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center">
          {/* Logo */}
          <div className="flex justify-center mb-10 animate-fade-in">
            <div className="w-20 sm:w-24 h-20 sm:h-24 bg-gradient-to-r from-teal-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
              <Sparkles className="w-10 sm:w-12 h-10 sm:h-12 text-white" />
        </div>
      </div>
      
          {/* Main Heading */}
        <div className="mb-12 animate-fade-in-up">
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-extrabold mb-6 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-purple-500 to-indigo-400">
            Welcome to
            </span>
              <br />
              <span className="text-white text-5xl sm:text-7xl md:text-9xl">FundFlow</span>
          </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-2xl sm:max-w-4xl mx-auto leading-relaxed mb-8 sm:mb-12">
            Connect investors with entrepreneurs. Transform ideas into reality. Build the future together.
          </p>
        </div>
        
        {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-10 sm:mb-16 animate-fade-in-up">
          <Button
            onClick={() => navigate('/login')}
              variant="primary"
              size="xl"
              className="w-full sm:w-auto min-w-0 sm:min-w-64"
              icon={<Zap className="w-6 h-6" />}
          >
              Get Started
          </Button>
          <Button
            onClick={() => navigate('/register')}
              variant="secondary"
              size="xl"
              className="w-full sm:w-auto min-w-0 sm:min-w-64"
          >
              Sign Up
          </Button>
        </div>
        
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-20 animate-fade-in-up">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>
        </div>
          </div>

      {/* Features Section */}
      <div className="relative z-10 py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4 sm:mb-6">
              Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-purple-500">FundFlow</span>
            </h2>
            <p className="text-base sm:text-xl text-gray-300 max-w-xl sm:max-w-3xl mx-auto">
              Experience the future of investment networking with our cutting-edge platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} delay={index * 200} />
            ))}
          </div>
        </div>
      </div>
      
      {/* Animated CSS */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fade-in-up {
          from { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
        }
        
        @keyframes pulse {
          0%, 100% { 
            transform: scale(1);
            box-shadow: 0 0 20px rgba(45, 212, 191, 0.5);
          }
          50% { 
            transform: scale(1.05);
            box-shadow: 0 0 30px rgba(45, 212, 191, 0.8);
          }
        }
        
        .animate-pulse {
          animation: pulse 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Entrance;