import React, { useState } from 'react';
import { vendorApi } from '../../services/vendorApi';
import { 
  X, 
  Gauge, 
  Fuel, 
  AlertTriangle, 
  CheckCircle, 
  Car, 
  ArrowRight,
  ShieldCheck,
  IndianRupee
} from 'lucide-react';

export const VehicleHandoverModal = ({ isOpen, onClose, booking, mode = 'START_TRIP', onSuccess }) => {
  // Mode: 'START_TRIP' or 'COMPLETE_TRIP'
  const [startOdometer, setStartOdometer] = useState(booking?.vehicleId?.year ? 15200 : 5000);
  const [notes, setNotes] = useState('');

  // Return fields
  const [endOdometer, setEndOdometer] = useState(
    (booking?.handoverDetails?.startOdometer || 15200) + 120
  );
  const [fuelLevel, setFuelLevel] = useState('FULL');
  const [damageReport, setDamageReport] = useState('');
  const [extraCharges, setExtraCharges] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen || !booking) return null;

  const handleStartSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await vendorApi.startTrip(booking._id, {
        startOdometer: Number(startOdometer),
        notes
      });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to start trip');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await vendorApi.completeTrip(booking._id, {
        endOdometer: Number(endOdometer),
        fuelLevel,
        damageReport,
        extraCharges: Number(extraCharges)
      });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to complete trip');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 dark:border-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600">
              Vehicle Handover Operations
            </span>
            <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
              {mode === 'START_TRIP' ? 'Start Ride (Key Handover)' : 'Return Inspection (End Ride)'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Vehicle Mini Info */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400 block font-semibold">Booking #{booking.bookingNumber}</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {booking.vehicleId?.brand} {booking.vehicleId?.model} ({booking.vehicleId?.registrationNumber})
            </span>
          </div>
          <div className="text-right">
            <span className="text-slate-400 block font-semibold">Customer</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {booking.customerId?.name || booking.offlineCustomerDetails?.name || 'Walk-in'}
            </span>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Start Trip Form */}
        {mode === 'START_TRIP' && (
          <form onSubmit={handleStartSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold uppercase text-slate-600 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-brand-600" /> Current Odometer (KM)
              </label>
              <input
                type="number"
                value={startOdometer}
                onChange={(e) => setStartOdometer(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-sm font-bold focus:ring-2 focus:ring-brand-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-semibold uppercase text-slate-600 dark:text-slate-300 mb-1">
                Handover Notes / Pre-existing Scratches
              </label>
              <textarea
                rows="2"
                placeholder="e.g. Minor scratch on left bumper, verified driving license"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              ></textarea>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Starting trip will mark the vehicle as in-use and notify the customer.</span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md disabled:opacity-50"
              >
                {isSubmitting ? 'Starting...' : 'Handover Keys & Start Ride'}
              </button>
            </div>
          </form>
        )}

        {/* Complete Trip Form */}
        {mode === 'COMPLETE_TRIP' && (
          <form onSubmit={handleCompleteSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold uppercase text-slate-600 dark:text-slate-300 mb-1">
                  Start Odometer
                </label>
                <input
                  type="number"
                  value={booking.handoverDetails?.startOdometer || 0}
                  disabled
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-slate-400 font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-slate-600 dark:text-slate-300 mb-1 flex items-center gap-1">
                  <Gauge className="w-3.5 h-3.5 text-brand-600" /> Return Odometer (KM)
                </label>
                <input
                  type="number"
                  value={endOdometer}
                  onChange={(e) => setEndOdometer(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-sm font-bold"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold uppercase text-slate-600 dark:text-slate-300 mb-1 flex items-center gap-1">
                  <Fuel className="w-3.5 h-3.5 text-accent-500" /> Return Fuel Level
                </label>
                <select
                  value={fuelLevel}
                  onChange={(e) => setFuelLevel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                >
                  <option value="FULL">⛽ Full Tank (100%)</option>
                  <option value="THREE_QUARTERS">75% Tank</option>
                  <option value="HALF">50% Half Tank</option>
                  <option value="QUARTER">25% Low Fuel</option>
                  <option value="EMPTY">⚠️ Empty / Reserve</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold uppercase text-slate-600 dark:text-slate-300 mb-1">
                  Extra Penalty / Fuel Fee (₹)
                </label>
                <input
                  type="number"
                  value={extraCharges}
                  onChange={(e) => setExtraCharges(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold uppercase text-slate-600 dark:text-slate-300 mb-1">
                Damage Check & Return Inspection Notes
              </label>
              <textarea
                rows="2"
                placeholder="No new damages observed, vehicle clean and returned in good condition"
                value={damageReport}
                onChange={(e) => setDamageReport(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              ></textarea>
            </div>

            {/* Extra Kilometer & Distance Inspection Details */}
            {(() => {
              const startKm = booking.handoverDetails?.startOdometer || 0;
              const distanceDriven = Math.max(0, Number(endOdometer) - startKm);
              const rentalDays = Math.max(1, Math.ceil((booking.durationHours || 24) / 24));
              const allowedKm = rentalDays * (booking.vehicleId?.mileageLimitPerDayKm || 250);
              const extraKm = Math.max(0, distanceDriven - allowedKm);
              const extraKmRate = booking.vehicleId?.extraKmCharge || 10;
              const autoExtraCharge = extraKm * extraKmRate;
              const totalExtras = autoExtraCharge + Number(extraCharges || 0);

              return (
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-600 dark:text-slate-300">Total Distance Driven:</span>
                    <span className="font-heading font-extrabold text-slate-900 dark:text-white">
                      {distanceDriven} KM
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[11px] text-slate-500">
                    <span>Plan Allowance ({rentalDays} days × {booking.vehicleId?.mileageLimitPerDayKm || 250} km):</span>
                    <span>{allowedKm} KM included</span>
                  </div>

                  {extraKm > 0 ? (
                    <div className="flex justify-between items-center text-rose-600 dark:text-rose-400 font-bold">
                      <span>Extra Kilometers ({extraKm} km × ₹{extraKmRate}/km):</span>
                      <span>+₹{autoExtraCharge}</span>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center text-emerald-600 text-[11px] font-semibold">
                      <span>Within daily kilometer limit</span>
                      <span>₹0 Extra Fee</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-bold text-slate-900 dark:text-white">
                    <span>Vendor Payout (88% net share):</span>
                    <span className="text-emerald-600 font-extrabold">
                      ₹{Math.round(((booking.priceBreakdown?.subtotal || 0) + totalExtras) * 0.88)}
                    </span>
                  </div>
                </div>
              );
            })()}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-md disabled:opacity-50"
              >
                {isSubmitting ? 'Completing...' : 'Complete Ride & Release Fleet'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
