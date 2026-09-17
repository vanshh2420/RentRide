import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileFormSchema, changePasswordFormSchema } from '../../validators/authValidators';
import { userApi } from '../../services/userApi';
import { updateUserProfile } from '../../features/auth/authSlice';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { Tabs } from '../../components/ui/Tabs';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
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
  Sparkles,
  Bell
} from 'lucide-react';
import { CityAutocomplete } from '../../components/common/CityAutocomplete';
import { cn } from '../../utils/cn';

export const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  // Tabs state
  const [activeTab, setActiveTab] = useState('personal');

  // Feedback States
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

    if (file.size > 5 * 1024 * 1024) {
      setProfileErrorMsg('Image size cannot exceed 5MB');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setAvatarPreview(objectUrl);

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

  const profileTabs = [
    { id: 'personal', label: 'Personal Information', icon: User },
    { id: 'kyc', label: 'KYC & License', icon: ShieldCheck },
    { id: 'security', label: 'Password & Security', icon: Lock },
    { id: 'preferences', label: 'Preferences', icon: Bell }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Breadcrumb Header */}
      <Breadcrumb
        items={[
          { label: 'Account Center' },
          { label: 'Profile Settings' }
        ]}
      />

      {/* 1. PROFILE HEADER HERO CARD */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-subtle flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden">
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
            <h1 className="font-heading text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {user?.name}
            </h1>
            <StatusBadge status={user?.role?.toUpperCase()} size="xs" />
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

          <div className="pt-2 flex items-center justify-center md:justify-start gap-2">
            <span className="font-mono text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
              UID: {user?._id?.slice(-8).toUpperCase()}
            </span>
            <button
              type="button"
              onClick={handleCopyId}
              className="text-xs font-semibold text-slate-500 hover:text-brand-600 flex items-center gap-1"
            >
              {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedId ? 'Copied' : 'Copy ID'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. SECTION TABS (Guideline 22) */}
      <Tabs
        tabs={profileTabs}
        activeTab={activeTab}
        onChange={(t) => setActiveTab(t)}
      />

      {/* Alert Notices */}
      {profileSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2.5">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{profileSuccessMsg}</span>
        </div>
      )}

      {profileErrorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{profileErrorMsg}</span>
        </div>
      )}

      {/* TAB 1: PERSONAL INFORMATION */}
      {activeTab === 'personal' && (
        <form onSubmit={handleProfileSubmit(onUpdateProfile)} className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-subtle space-y-6">
          <div className="space-y-1 pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-heading font-extrabold text-lg text-slate-900 dark:text-white">
              Personal Information
            </h3>
            <p className="text-xs text-slate-500">
              Update your contact profile and rental preferences.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Full Legal Name
              </label>
              <input
                type="text"
                {...registerProfile('name')}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
              {profileErrors.name && (
                <p className="text-[11px] text-rose-500 font-semibold">{profileErrors.name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-medium text-slate-500 cursor-not-allowed"
              />
              <span className="text-[10px] text-slate-400">Primary authentication identifier</span>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Contact Phone Number
              </label>
              <input
                type="tel"
                {...registerProfile('phone')}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
              {profileErrors.phone && (
                <p className="text-[11px] text-rose-500 font-semibold">{profileErrors.phone.message}</p>
              )}
            </div>
          </div>

          {/* Vendor Specific Business Fields */}
          {user?.role === 'vendor' && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Store className="w-4 h-4 text-amber-500" />
                <span>Commercial Fleet Partner Info</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Business / Fleet Name
                  </label>
                  <input
                    type="text"
                    {...registerProfile('businessName')}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    GSTIN / Tax ID
                  </label>
                  <input
                    type="text"
                    {...registerProfile('gstNumber')}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none uppercase"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isProfileSaving}
              leftIcon={Save}
            >
              Save Profile Changes
            </Button>
          </div>
        </form>
      )}

      {/* TAB 2: KYC & LICENSE */}
      {activeTab === 'kyc' && (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-subtle space-y-6">
          <div className="space-y-1 pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-heading font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span>KYC & Verification Status</span>
            </h3>
            <p className="text-xs text-slate-500">
              Government verification ensures rapid, keyless, and contactless vehicle dispatch.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
                <Check className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-200">
                  Aadhaar & Identity Verified
                </h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-300">
                  Your identity has been pre-verified by RentRide's automated security check.
                </p>
              </div>
            </div>
            <StatusBadge status="VERIFIED" size="xs" />
          </div>

          <div className="space-y-3 pt-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Driving Licence Number
            </label>
            <div className="max-w-md">
              <input
                type="text"
                {...registerProfile('drivingLicenseNumber')}
                placeholder="e.g. MP-09-20210012345"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-medium text-slate-900 dark:text-white uppercase focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Your physical driving licence will be visually confirmed by the hub manager upon initial vehicle pickup.
            </p>
          </div>
        </div>
      )}

      {/* TAB 3: PASSWORD & SECURITY */}
      {activeTab === 'security' && (
        <form onSubmit={handlePasswordSubmit(onChangePassword)} className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-subtle space-y-6">
          <div className="space-y-1 pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-heading font-extrabold text-lg text-slate-900 dark:text-white">
              Password & Security Settings
            </h3>
            <p className="text-xs text-slate-500">
              Ensure your account is protected with a strong, distinct password.
            </p>
          </div>

          {passwordSuccessMsg && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{passwordSuccessMsg}</span>
            </div>
          )}

          {passwordErrorMsg && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{passwordErrorMsg}</span>
            </div>
          )}

          <div className="max-w-md space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  {...registerPassword('currentPassword')}
                  className="w-full px-4 py-2.5 pr-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-3 text-slate-400"
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordErrors.currentPassword && (
                <p className="text-[11px] text-rose-500">{passwordErrors.currentPassword.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  {...registerPassword('newPassword')}
                  className="w-full px-4 py-2.5 pr-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-3 text-slate-400"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Strength Meter */}
              {newPasswordValue && (
                <div className="space-y-1 pt-1">
                  <div className="flex gap-1 h-1.5">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={cn(
                          "flex-1 rounded-full transition-colors",
                          passwordStrength >= step
                            ? step <= 2
                              ? "bg-amber-500"
                              : "bg-emerald-500"
                            : "bg-slate-200 dark:bg-slate-700"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400 block text-right">
                    {passwordStrength <= 2 ? 'Weak' : passwordStrength === 3 ? 'Good' : 'Strong'}
                  </span>
                </div>
              )}
              {passwordErrors.newPassword && (
                <p className="text-[11px] text-rose-500">{passwordErrors.newPassword.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...registerPassword('confirmPassword')}
                  className="w-full px-4 py-2.5 pr-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-slate-400"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordErrors.confirmPassword && (
                <p className="text-[11px] text-rose-500">{passwordErrors.confirmPassword.message}</p>
              )}
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isPasswordSaving}
              >
                Update Password
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 4: PREFERENCES */}
      {activeTab === 'preferences' && (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-subtle space-y-6">
          <div className="space-y-1 pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-heading font-extrabold text-lg text-slate-900 dark:text-white">
              Account Preferences
            </h3>
            <p className="text-xs text-slate-500">
              Manage notifications and marketing messages.
            </p>
          </div>

          <div className="space-y-4 max-w-xl text-xs">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">Booking Reminders & OTPs</h4>
                <p className="text-[11px] text-slate-400">Receive SMS & notifications regarding pickup and return times</p>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-brand-600 cursor-pointer" />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">Promotional Discounts & Coupons</h4>
                <p className="text-[11px] text-slate-400">Special weekend getaway coupons and festival flash rentals</p>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-brand-600 cursor-pointer" />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProfilePage;
