import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch } from 'react-redux';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { registerFormSchema } from '../../validators/authValidators';
import { authApi } from '../../services/authApi';
import { loginSuccess } from './authSlice';
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Store, 
  MapPin, 
  FileText, 
  AlertCircle, 
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2
} from 'lucide-react';
import { CityAutocomplete } from '../../components/common/CityAutocomplete';

export const RegisterForm = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'vendor' ? 'vendor' : 'customer';
  
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      role: initialRole,
      businessName: '',
      gstNumber: '',
      city: 'Indore',
    },
  });

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setValue('role', role);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const response = await authApi.register(data);
      dispatch(loginSuccess(response.data));

      if (data.role === 'vendor') {
        navigate('/vendor/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed. Please check your information.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Role Selection Tabs */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
        <button
          type="button"
          onClick={() => handleRoleChange('customer')}
          className={`py-2.5 px-4 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
            selectedRole === 'customer'
              ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          <User className="w-4 h-4" />
          Customer
        </button>
        <button
          type="button"
          onClick={() => handleRoleChange('vendor')}
          className={`py-2.5 px-4 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
            selectedRole === 'vendor'
              ? 'bg-white dark:bg-slate-700 text-accent-600 dark:text-accent-400 shadow-sm'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          <Store className="w-4 h-4" />
          Vehicle Vendor
        </button>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm flex items-start gap-3 animate-fadeIn">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
            {selectedRole === 'vendor' ? 'Owner / Contact Name' : 'Full Name'}
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder={selectedRole === 'vendor' ? 'e.g. Ramesh Kumar' : 'e.g. Rahul Sharma'}
              {...register('name')}
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border ${
                errors.name
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-slate-200 dark:border-slate-700 focus:ring-brand-500'
              } text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:outline-none transition-all`}
            />
          </div>
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
        </div>

        {/* Email & Phone Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                placeholder="name@example.com"
                {...register('email')}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border ${
                  errors.email
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-slate-200 dark:border-slate-700 focus:ring-brand-500'
                } text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:outline-none transition-all`}
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="tel"
                placeholder="+91 98765 43210"
                {...register('phone')}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:ring-brand-500 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Vendor Specific Fleet Fields */}
        {selectedRole === 'vendor' && (
          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 space-y-4 animate-fadeIn">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5" /> Fleet Business Information
            </h4>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                Business / Agency Name
              </label>
              <div className="relative">
                <Store className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="e.g. Royal Urban Wheels Pvt Ltd"
                  {...register('businessName')}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-amber-500 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                  GST Number (Optional)
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    placeholder="29ABCDE1234F1Z5"
                    {...register('gstNumber')}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-amber-500 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:outline-none uppercase transition-all"
                  />
                </div>
              </div>

              <div>
                <CityAutocomplete
                  label="Operating City"
                  placeholder="Select operating hub (Indore, Bhopal, Gwalior)"
                  value={watch('city')}
                  onChange={(cityName) => setValue('city', cityName, { shouldValidate: true })}
                  error={errors.city?.message}
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Passwords Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
              Password
            </label>
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
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('confirmPassword')}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border ${
                  errors.confirmPassword
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-slate-200 dark:border-slate-700 focus:ring-brand-500'
                } text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:outline-none transition-all`}
              />
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-xl text-white font-semibold text-sm shadow-md transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 ${
            selectedRole === 'vendor'
              ? 'bg-accent-600 hover:bg-accent-700 hover:shadow-accent-500/25'
              : 'bg-brand-600 hover:bg-brand-700 hover:shadow-hover'
          }`}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              {selectedRole === 'vendor' ? 'Register Vendor Account' : 'Create Customer Account'}
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Login */}
      <div className="text-center text-xs text-slate-500">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-brand-600 dark:text-brand-400 hover:underline">
          Sign in here
        </Link>
      </div>
    </div>
  );
};
