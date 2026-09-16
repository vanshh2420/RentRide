import React, { useState } from 'react';
import { maintenanceApi } from '../../services/maintenanceApi';
import { CheckCircle, X, AlertTriangle, IndianRupee, FileCheck } from 'lucide-react';

export const CompleteMaintenanceModal = ({ isOpen, onClose, maintenance, onSuccess }) => {
  const [actualCost, setActualCost] = useState(maintenance?.estimatedCost || 2500);
  const [serviceCenterName, setServiceCenterName] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen || !maintenance) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await maintenanceApi.completeMaintenance(maintenance._id, {
        actualCost: Number(actualCost),
        serviceCenterName,
        invoiceNumber,
        notes
      });

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to complete maintenance');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
              Fleet Return to Service
            </span>
            <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
              Complete Maintenance Service
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
          <div className="font-bold text-slate-900 dark:text-white">
            {maintenance.vehicleId?.brand} {maintenance.vehicleId?.model} ({maintenance.vehicleId?.registrationNumber})
          </div>
          <div className="text-slate-500">{maintenance.title} • {maintenance.serviceType}</div>
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
              Final Actual Invoiced Cost (₹)
            </label>
            <input
              type="number"
              value={actualCost}
              onChange={(e) => setActualCost(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold uppercase text-slate-600 dark:text-slate-300 mb-1">
                Workshop / Center Name
              </label>
              <input
                type="text"
                placeholder="e.g. Express Auto Garage"
                value={serviceCenterName}
                onChange={(e) => setServiceCenterName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase text-slate-600 dark:text-slate-300 mb-1">
                Invoice / Bill Number
              </label>
              <input
                type="text"
                placeholder="e.g. INV-98432"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold uppercase text-slate-600 dark:text-slate-300 mb-1">
              Completion Notes
            </label>
            <textarea
              rows="2"
              placeholder="All fluids changed, brake pads replaced with OEM parts"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            ></textarea>
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
              {isSubmitting ? 'Saving...' : 'Mark Completed & Restore Available'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
