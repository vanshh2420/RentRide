import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileFormSchema, changePasswordFormSchema } from '../../validators/authValidators';
import { userApi } from '../../services/userApi';
import { updateUserProfile } from '../../features/auth/authSlice';
import { 
  User, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Lock, 
  Store, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Save,
  Camera,
  Calendar,
  Eye,
  EyeOff,
  Building,
  MapPin,
  KeyRound,
  Shield,
  Copy,
  Check,
  Sparkles
} from 'lucide-react';
import { CityAutocomplete } from '../../components/common/CityAutocomplete';

export const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  // States
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');
  const [profileErrorMsg, setProfileErrorMsg] = useState('');
  const [isProfileSaving, setIsProfileSaving] = useState(false);

  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState('');
  const [passwordErrorMsg, setPasswordErrorMsg] = useState('');
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);

  const [avatarPreview, setAvatarPreview] = useState(user?.avatar?.url || '');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Profile Form setup
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfileForm,
    setValue: setValueProfile,
    watch: watchProfile,
    formState: { errors: profileErrors, isDirty: isProfileDirty }
  } = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      businessName: user?.vendorProfile?.businessName || '',
      gstNumber: user?.vendorProfile?.gstNumber || '',
      city: user?.vendorProfile?.address?.city || '',
      street: user?.vendorProfile?.address?.street || '',
      state: user?.vendorProfile?.address?.state || '',
      pincode: user?.vendorProfile?.address?.pincode || '',
      drivingLicenseNumber: user?.customerProfile?.drivingLicenseNumber || ''
    }
  });

  // Keep form updated if user state changes
  useEffect(() => {
    if (user) {
      resetProfileForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        businessName: user.vendorProfile?.businessName || '',
        gstNumber: user.vendorProfile?.gstNumber || '',
        city: user.vendorProfile?.address?.city || '',
        street: user.vendorProfile?.address?.street || '',
        state: user.vendorProfile?.address?.state || '',
        pincode: user.vendorProfile?.address?.pincode || '',
        drivingLicenseNumber: user.customerProfile?.drivingLicenseNumber || ''
      });
      if (user.avatar?.url) {
        setAvatarPreview(user.avatar.url);
      }
    }
  }, [user, resetProfileForm]);

  // Change Password Form setup
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    watch: watchPassword,
    formState: { errors: passwordErrors }
  } = useForm({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const newPasswordValue = watchPassword('newPassword', '');

  // Calculate password strength indicator (0-4)
  const calculatePasswordStrength = (pwd) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd) || /[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const passwordStrength = calculatePasswordStrength(newPasswordValue);

  // Avatar change handler
  const handleAvatarFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setProfileErrorMsg('Image size cannot exceed 5MB');
      return;
    }

    // Local preview
    const objectUrl = URL.createObjectURL(file);
    setAvatarPreview(objectUrl);

    // Upload immediately
    setIsUploadingAvatar(true);
    setProfileSuccessMsg('');
    setProfileErrorMsg('');

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await userApi.updateProfile(formData);
      dispatch(updateUserProfile(response.data.user));
      setProfileSuccessMsg('Profile picture updated successfully!');
    } catch (err) {
      setProfileErrorMsg(err.message || 'Failed to upload profile picture.');
      setAvatarPreview(user?.avatar?.url || '');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // Profile update submit
  const onUpdateProfile = async (data) => {
    setIsProfileSaving(true);
    setProfileSuccessMsg('');
    setProfileErrorMsg('');
    try {
      const response = await userApi.updateProfile(data);
      dispatch(updateUserProfile(response.data.user));
      setProfileSuccessMsg('Profile details updated successfully!');
    } catch (err) {
      setProfileErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setIsProfileSaving(false);
    }
  };

  // Change password submit
  const onChangePassword = async (data) => {
    setIsPasswordSaving(true);
    setPasswordSuccessMsg('');
    setPasswordErrorMsg('');
    try {
      await userApi.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword
      });
      setPasswordSuccessMsg('Your password has been changed successfully!');
      resetPasswordForm();
    } catch (err) {
      setPasswordErrorMsg(err.message || 'Failed to update password.');
    } finally {
      setIsPasswordSaving(false);
    }
  };

  const handleCopyId = () => {
    if (user?._id) {
      navigator.clipboard.writeText(user._id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const formattedJoinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
      })
    : 'Recently';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* 1. PROFILE HEADER CARD */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-glass flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden">
        {/* Background Ambient Glow */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Profile Picture with Upload Overlay */}
        <div className="relative group flex-shrink-0">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden border-2 border-brand-500/30 shadow-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center relative">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt={user?.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-brand-600 to-sky-600 text-white font-extrabold text-3xl sm:text-4xl flex items-center justify-center">
                {user?.name ? user.name[0].toUpperCase() : 'U'}
              </div>
            )}

            {isUploadingAvatar && (
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center text-white text-xs font-bold">
                Uploading...
              </div>
            )}
          </div>

          {/* Change Avatar Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Upload Profile Picture"
            className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-lg transition-transform hover:scale-110 flex items-center justify-center border-2 border-white dark:border-slate-900"
          >
            <Camera className="w-4 h-4" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarFileChange}
            accept="image/png, image/jpeg, image/jpg, image/webp"
            className="hidden"
          />
        </div>

        {/* Header Details */}
        <div className="space-y-2 text-center md:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {user?.name}
            </h1>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-xs ${
              user?.role === 'admin'
                ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                : user?.role === 'vendor'
                ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                : 'bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border-brand-200 dark:border-brand-800'
            }`}>
              {user?.role} Account
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400 pt-1">
            <span className="flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-slate-400" />
              {user?.email}
            </span>
            {user?.phone && (
              <span className="flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-slate-400" />
                {user?.phone}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              Member since {formattedJoinedDate}
            </span>
          </div>
        </div>
      </div>

      {/* Global Alerts */}
      {profileSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm flex items-center justify-between shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{profileSuccessMsg}</span>
          </div>
          <button onClick={() => setProfileSuccessMsg('')} className="text-xs text-emerald-600 hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {profileErrorMsg && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 text-sm flex items-center justify-between shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span>{profileErrorMsg}</span>
          </div>
          <button onClick={() => setProfileErrorMsg('')} className="text-xs text-red-600 hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* 2. MAIN FORMS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT 2 COLUMNS: EDIT PROFILE DETAILS */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-glass space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-brand-600" />
                  Personal Information
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Update your contact info, full name, and role details.
                </p>
              </div>
            </div>

            <form onSubmit={handleProfileSubmit(onUpdateProfile)} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      {...registerProfile('name')}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
                    />
                  </div>
                  {profileErrors.name && (
                    <p className="text-xs text-red-500 mt-1">{profileErrors.name.message}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      {...registerProfile('phone')}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
                    />
                  </div>
                  {profileErrors.phone && (
                    <p className="text-xs text-red-500 mt-1">{profileErrors.phone.message}</p>
                  )}
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    {...registerProfile('email')}
                    placeholder="e.g. rahul@example.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
                  />
                </div>
                {profileErrors.email && (
                  <p className="text-xs text-red-500 mt-1">{profileErrors.email.message}</p>
                )}
                <p className="text-[11px] text-slate-400 mt-1">
                  Note: Updating your email address will change your login credentials.
                </p>
              </div>

              {/* Customer Specific Fields (Driving License) */}
              {user?.role === 'customer' && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Driving License Number (KYC)
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="e.g. KA0320190012345"
                      {...registerProfile('drivingLicenseNumber')}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white uppercase focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Used for expedited vehicle pickup verification at vendor desks.
                  </p>
                </div>
              )}

              {/* Vendor Specific Business Profile */}
              {user?.role === 'vendor' && (
                <div className="space-y-4 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <h3 className="font-heading font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Store className="w-4 h-4 text-amber-500" /> Fleet Vendor Business Details
                  </h3>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Business / Agency Name
                    </label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        {...registerProfile('businessName')}
                        placeholder="e.g. Apex Bangalore Fleet Rentals"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        GST Number
                      </label>
                      <input
                        type="text"
                        {...registerProfile('gstNumber')}
                        placeholder="e.g. 29ABCDE1234F1Z5"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white uppercase focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
                      />
                    </div>

                    <div>
                      <CityAutocomplete
                        label="Operating Hub City"
                        placeholder="Select hub (Indore, Bhopal, Gwalior)"
                        value={watchProfile('city')}
                        onChange={(cityName) => setValueProfile('city', cityName, { shouldValidate: true, shouldDirty: true })}
                        error={profileErrors.city?.message}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Admin Privileges Info */}
              {user?.role === 'admin' && (
                <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs text-purple-800 dark:text-purple-200 space-y-1">
                  <span className="font-bold flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" /> Platform Administrator Privileges
                  </span>
                  <p className="leading-relaxed">
                    You have global access to manage vehicles, platform commissions, coupons, and user management.
                  </p>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={isProfileSaving}
                  className="px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md hover:shadow-hover flex items-center gap-2 transition-all duration-200 disabled:opacity-60"
                >
                  <Save className="w-4 h-4" />
                  {isProfileSaving ? 'Saving Changes...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: SECURITY & PASSWORD CHANGE */}
        <div className="space-y-6">
          {/* Security & Password Card */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-glass space-y-6">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
              <h2 className="font-heading text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-accent-500" />
                Change Password
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Ensure your account is protected with a strong password.
              </p>
            </div>

            {passwordSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 flex-shrink-0" /> {passwordSuccessMsg}
              </div>
            )}

            {passwordErrorMsg && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" /> {passwordErrorMsg}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit(onChangePassword)} className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Current Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    {...registerPassword('currentPassword')}
                    placeholder="Enter current password"
                    className="w-full px-3.5 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-accent-500 focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordErrors.currentPassword && (
                  <p className="text-xs text-red-500 mt-1">{passwordErrors.currentPassword.message}</p>
                )}
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    {...registerPassword('newPassword')}
                    placeholder="Min 6 characters"
                    className="w-full px-3.5 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-accent-500 focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordErrors.newPassword && (
                  <p className="text-xs text-red-500 mt-1">{passwordErrors.newPassword.message}</p>
                )}

                {/* Password Strength Indicator */}
                {newPasswordValue.length > 0 && (
                  <div className="space-y-1 pt-1.5">
                    <div className="grid grid-cols-4 gap-1.5 h-1 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700">
                      <div className={`h-full ${passwordStrength >= 1 ? 'bg-red-500' : ''}`} />
                      <div className={`h-full ${passwordStrength >= 2 ? 'bg-amber-500' : ''}`} />
                      <div className={`h-full ${passwordStrength >= 3 ? 'bg-sky-500' : ''}`} />
                      <div className={`h-full ${passwordStrength >= 4 ? 'bg-emerald-500' : ''}`} />
                    </div>
                    <span className="text-[10px] text-slate-400 block text-right">
                      {passwordStrength <= 1 && 'Weak'}
                      {passwordStrength === 2 && 'Fair'}
                      {passwordStrength === 3 && 'Good'}
                      {passwordStrength >= 4 && 'Strong'}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Confirm New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...registerPassword('confirmPassword')}
                    placeholder="Repeat new password"
                    className="w-full px-3.5 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-accent-500 focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordErrors.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">{passwordErrors.confirmPassword.message}</p>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isPasswordSaving}
                  className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-black dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold text-xs shadow-md transition-all duration-200 disabled:opacity-60"
                >
                  {isPasswordSaving ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>

          {/* Account Overview Metadata Card */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-glass space-y-4">
            <h3 className="font-heading font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-brand-600" /> Account Security & Status
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                <span className="text-slate-500">Status</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Active & Verified
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                <span className="text-slate-500">Account ID</span>
                <button
                  onClick={handleCopyId}
                  className="font-mono text-[11px] text-slate-700 dark:text-slate-300 flex items-center gap-1 hover:text-brand-600"
                  title="Copy User ID"
                >
                  <span>{user?._id?.substring(0, 10)}...</span>
                  {copiedId ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-slate-400" />}
                </button>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                <span className="text-slate-500">Registered</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
