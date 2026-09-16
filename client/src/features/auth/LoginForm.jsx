import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { loginFormSchema } from '../../validators/authValidators';
import { authApi } from '../../services/authApi';
import { loginSuccess } from './authSlice';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, Shield, User, Store } from 'lucide-react';

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const response = await authApi.login(data);
      dispatch(loginSuccess(response.data));
      
      // Redirect based on role
      const role = response.data.user.role;
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else if (role === 'vendor') {
        navigate('/vendor/dashboard');
      } else {
        if (redirectPath && redirectPath !== '/' && redirectPath !== '/login' && !redirectPath.startsWith('/admin') && !redirectPath.startsWith('/vendor')) {
          navigate(redirectPath);
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      setErrorMessage(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = (email, password) => {
    setValue('email', email, { shouldValidate: true });
    setValue('password', password, { shouldValidate: true });
    setErrorMessage('');
  };

  return (
    <div className="w-full space-y-6">
      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm flex items-start gap-3 animate-fadeIn">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Login Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Field */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="email"
              placeholder="you@example.com"
              {...register('email')}
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border ${
                errors.email
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-slate-200 dark:border-slate-700 focus:ring-brand-500'
              } text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:outline-none transition-all`}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Password
            </label>
            <a href="#" className="text-xs text-brand-600 dark:text-brand-400 hover:underline">
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              {...register('password')}
              className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border ${
                errors.password
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-slate-200 dark:border-slate-700 focus:ring-brand-500'
              } text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:outline-none transition-all`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-semibold text-sm shadow-md hover:shadow-hover transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              Sign In <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Quick-Fill Demo Credentials for Easy Testing */}
      <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 space-y-2.5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-brand-500" /> Quick-Fill Demo Accounts
        </span>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleQuickFill('customer1@rentride.in', 'Customer@123')}
            className="px-2 py-1.5 rounded-lg bg-white dark:bg-slate-700/80 border border-slate-200 dark:border-slate-600 text-xs font-medium text-slate-700 dark:text-slate-200 hover:border-brand-500 hover:text-brand-600 flex items-center justify-center gap-1 transition-colors"
          >
            <User className="w-3 h-3 text-brand-500" /> Customer
          </button>
          <button
            type="button"
            onClick={() => handleQuickFill('vendor1@rentride.in', 'Vendor@123')}
            className="px-2 py-1.5 rounded-lg bg-white dark:bg-slate-700/80 border border-slate-200 dark:border-slate-600 text-xs font-medium text-slate-700 dark:text-slate-200 hover:border-amber-500 hover:text-amber-600 flex items-center justify-center gap-1 transition-colors"
          >
            <Store className="w-3 h-3 text-amber-500" /> Vendor
          </button>
          <button
            type="button"
            onClick={() => handleQuickFill('admin@rentride.in', 'Admin@123')}
            className="px-2 py-1.5 rounded-lg bg-white dark:bg-slate-700/80 border border-slate-200 dark:border-slate-600 text-xs font-medium text-slate-700 dark:text-slate-200 hover:border-purple-500 hover:text-purple-600 flex items-center justify-center gap-1 transition-colors"
          >
            <Shield className="w-3 h-3 text-purple-500" /> Admin
          </button>
        </div>
      </div>

      {/* Switch to Register */}
      <div className="text-center text-xs text-slate-500">
        Don't have an account yet?{' '}
        <Link to="/register" className="font-semibold text-brand-600 dark:text-brand-400 hover:underline">
          Create free account
        </Link>
      </div>
    </div>
  );
};
