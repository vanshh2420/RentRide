import React, { useState, useEffect } from 'react';
import { maintenanceApi } from '../../services/maintenanceApi';
import { Wrench, X, AlertTriangle, Calendar, IndianRupee, ShieldAlert } from 'lucide-react';

export const ScheduleMaintenanceModal = ({ isOpen, onClose, vehicles = [], onSuccess }) => {
  const [vehicleId, setVehicleId] = useState('');
  const [title, setTitle] = useState('');
  const [serviceType, setServiceType] = useState('GENERAL_SERVICE');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [estimatedCost, setEstimatedCost] = useState(2500);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Sync default vehicleId whenever vehicles change or modal opens
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
    setTitle('');
    setStartDate('');
    setEndDate('');
    setEstimatedCost(2500);
    setNotes('');
    setErrorMessage('');
    onClose();
  };

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!vehicleId) {
      setErrorMessage('Please select a vehicle for maintenance');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await maintenanceApi.scheduleMaintenance({
        vehicleId,
        title,
        serviceType,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        estimatedCost: Number(estimatedCost),
        notes
      });

      if (onSuccess) onSuccess();
      handleClose();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to schedule maintenance');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-fadeIn">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
              Fleet Maintenance & Availability Control
            </span>
            <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
              Schedule Vehicle Maintenance
            </h3>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold uppercase text-slate-600 dark:text-slate-300 mb-1">
              Select Fleet Vehicle
            </label>
            <select
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
              required
            >
              {vehicles.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.brand} {v.model} ({v.registrationNumber}) — {v.status}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold uppercase text-slate-600 dark:text-slate-300 mb-1">
                Reason / Title
              </label>
              <input
                type="text"
                placeholder="e.g. 10,000 KM Periodic Service"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                required
              />
            </div>

            <div>
              <label className="block font-semibold uppercase text-slate-600 dark:text-slate-300 mb-1">
                Service Category
              </label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
              >
                <option value="GENERAL_SERVICE">🔧 General Service</option>
                <option value="OIL_CHANGE">🛢️ Oil & Filter Change</option>
                <option value="BRAKE_INSPECTION">🛑 Brake Pad Inspection</option>
                <option value="TIRE_ROTATION">🔄 Tire Alignment & Rotation</option>
                <option value="ACCIDENT_REPAIR">💥 Body & Dent Repair</option>
                <option value="EMERGENCY">⚠️ Emergency Breakdown</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold uppercase text-slate-600 dark:text-slate-300 mb-1">
                Blackout Start Date/Time
              </label>
              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                required
              />
            </div>

            <div>
              <label className="block font-semibold uppercase text-slate-600 dark:text-slate-300 mb-1">
                Expected Completion Date/Time
              </label>
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold uppercase text-slate-600 dark:text-slate-300 mb-1">
                Estimated Service Budget (₹)
              </label>
              <input
                type="number"
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase text-slate-600 dark:text-slate-300 mb-1">
                Service Center / Mechanic Notes
              </label>
              <input
                type="text"
                placeholder="e.g. Authorized Hyundai Service Center"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>
              Anti-collision active: The system will verify that no active customer bookings conflict with this blackout interval.
            </span>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-md disabled:opacity-50"
            >
              {isSubmitting ? 'Scheduling...' : 'Lock Slot for Maintenance'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
