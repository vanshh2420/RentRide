import React, { useState, useEffect } from 'react';
import { vendorApi } from '../../services/vendorApi';
import { bookingApi } from '../../services/bookingApi';
import { toLocalISOString, toApiISOString } from '../../utils/dateUtils';
import { 
  X, 
  Car, 
  User, 
  Phone, 
  CreditCard, 
  Calendar, 
  Clock, 
  AlertCircle, 
  CheckCircle,
  IndianRupee,
  FileText
} from 'lucide-react';

export const CreateOfflineBookingModal = ({ isOpen, onClose, vehicles = [], defaultVehicleId = '', onSuccess }) => {
  const [vehicleId, setVehicleId] = useState(defaultVehicleId || (vehicles[0]?._id || ''));
  const [rentalPlan, setRentalPlan] = useState('HOURLY');
  const [hours, setHours] = useState(4);

  // Set default start time 30 mins from now in local timezone
  const defaultStartTime = toLocalISOString(new Date(Date.now() + 30 * 60 * 1000));
  const [startDateTime, setStartDateTime] = useState(defaultStartTime);
  const [endDateTime, setEndDateTime] = useState('');

  // Customer Form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [drivingLicenseNumber, setDrivingLicenseNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('offline_cash');
  const [isPaymentCollected, setIsPaymentCollected] = useState(true);
  const [customPrice, setCustomPrice] = useState('');

  // Status & Live preview
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [conflictReason, setConflictReason] = useState('');
  const [priceData, setPriceData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (defaultVehicleId) setVehicleId(defaultVehicleId);
  }, [defaultVehicleId]);

  useEffect(() => {
    if (vehicles && vehicles.length > 0 && (!vehicleId || !vehicles.find(v => v._id === vehicleId))) {
      setVehicleId(vehicles[0]._id);
    }
  }, [vehicles, isOpen]);

  // Keyboard Escape listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleClose = () => {
    setName('');
    setPhone('');
    setDrivingLicenseNumber('');
    setNotes('');
    setCustomPrice('');
    setErrorMessage('');
    onClose();
  };

  useEffect(() => {
    computeEndDateTime();
  }, [startDateTime, rentalPlan, hours]);

  useEffect(() => {
    if (vehicleId && startDateTime && endDateTime) {
      checkLiveSlot();
    }
  }, [vehicleId, rentalPlan, startDateTime, endDateTime]);

  const computeEndDateTime = () => {
    if (!startDateTime) return;
    const start = new Date(startDateTime);
    let durationHours = hours;
    if (rentalPlan === '12_HOURS') durationHours = 12;
    if (rentalPlan === '24_HOURS') durationHours = 24;

    const end = new Date(start.getTime() + durationHours * 60 * 60 * 1000);
    setEndDateTime(toLocalISOString(end));
  };

  const checkLiveSlot = async () => {
    setIsCheckingAvailability(true);
    setErrorMessage('');
    try {
      const res = await bookingApi.checkAvailability({
        vehicleId,
        rentalPlan,
        startDateTime: toApiISOString(startDateTime),
        endDateTime: toApiISOString(endDateTime)
      });

      if (res.data.available) {
        setIsAvailable(true);
        setConflictReason('');
        setPriceData(res.data.priceBreakdown);
      } else {
        setIsAvailable(false);
        setConflictReason(res.data.reason || 'Vehicle is booked for this time slot');
      }
    } catch (err) {
      setIsAvailable(false);
      setConflictReason(err.message || 'Availability check failed');
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAvailable) {
      setErrorMessage('Selected slot is unavailable. Please pick another vehicle or time.');
      return;
    }

    if (!name.trim() || !phone.trim() || !drivingLicenseNumber.trim()) {
      setErrorMessage('Please fill in customer name, phone, and driving license.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const payload = {
        vehicleId,
        rentalPlan,
        startDateTime: toApiISOString(startDateTime),
        endDateTime: toApiISOString(endDateTime),
        offlineCustomer: {
          name: name.trim(),
          phone: phone.trim(),
          drivingLicenseNumber: drivingLicenseNumber.trim().toUpperCase(),
          notes: notes.trim()
        },
        paymentMethod,
        isPaymentCollected,
        customBasePrice: customPrice ? Number(customPrice) : undefined
      };

      const res = await vendorApi.createOfflineBooking(payload);
      if (onSuccess) onSuccess(res.data.booking);
      handleClose();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to create offline booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 dark:border-slate-800 my-8 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200">
              Vendor Desk
            </span>
            <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white mt-1">
              Create Walk-in Offline Booking
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {/* 1. Vehicle Selector */}
          <div>
            <label className="block font-semibold uppercase text-slate-600 dark:text-slate-300 mb-1">
              Select Fleet Vehicle
            </label>
            <select
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold focus:ring-2 focus:ring-brand-500 focus:outline-none"
            >
              {vehicles.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.brand} {v.model} ({v.registrationNumber}) — ₹{v.pricing?.hourlyRate}/hr
                </option>
              ))}
            </select>
          </div>

          {/* 2. Plan & Duration */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'HOURLY', label: 'Hourly Plan' },
              { id: '12_HOURS', label: '12-Hour Day Pack' },
              { id: '24_HOURS', label: '24-Hour 1-Day Pack' }
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setRentalPlan(p.id)}
                className={`py-2 px-3 rounded-xl border text-center font-bold transition-all ${
                  rentalPlan === p.id
                    ? 'border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {rentalPlan === 'HOURLY' && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
              <span className="font-semibold text-slate-600 dark:text-slate-300">Duration (Hours):</span>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="1"
                  max="11"
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  className="w-36 accent-brand-600"
                />
                <span className="font-bold text-brand-600 text-sm">{hours} hrs</span>
              </div>
            </div>
          )}

          {/* 3. Date Pickers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold uppercase text-slate-500 mb-1">Pickup Date & Time</label>
              <input
                type="datetime-local"
                value={startDateTime}
                onChange={(e) => setStartDateTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
              />
            </div>
            <div>
              <label className="block font-semibold uppercase text-slate-500 mb-1">Return Date & Time</label>
              <input
                type="datetime-local"
                value={endDateTime}
                readOnly
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-semibold text-slate-400 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Slot availability status badge */}
          {!isAvailable ? (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-amber-800 dark:text-amber-300 font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{conflictReason}</span>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-800 dark:text-emerald-300 font-semibold flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" /> Slot is 100% Available
              </span>
              <span className="font-bold">Calculated Rent: ₹{priceData?.totalAmount || '0'}</span>
            </div>
          )}

          {/* 4. Walk-in Customer Details */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <h4 className="font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-brand-600" /> Walk-in Customer Details
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">Customer Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">Driving License Number</label>
              <input
                type="text"
                placeholder="e.g. KA0120200001234"
                value={drivingLicenseNumber}
                onChange={(e) => setDrivingLicenseNumber(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 uppercase font-mono"
              />
            </div>
          </div>

          {/* 5. Payment Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                <option value="offline_cash">💵 Cash at Desk</option>
                <option value="upi">📱 Desk Counter QR / UPI</option>
                <option value="card">💳 POS Card Swipe</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">Custom Base Amount (Optional Override)</label>
              <input
                type="number"
                placeholder="Leave blank for auto-calculate"
                value={customPrice}
                onChange={(e) => setCustomPrice(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isAvailable || isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-md disabled:opacity-50"
            >
              {isSubmitting ? 'Recording Booking...' : 'Confirm Offline Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
