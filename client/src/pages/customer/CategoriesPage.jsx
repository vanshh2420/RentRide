import React from 'react';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { CategorySection } from '../../components/categories/CategorySection';
import { ShieldCheck, CheckCircle2, Zap } from 'lucide-react';

export const CategoriesPage = () => {
  return (
    <div className="py-6 sm:py-10 space-y-10 sm:space-y-12">
      {/* Top Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: 'Explore Fleet', href: '/explore' },
            { label: 'Vehicle Categories' }
          ]}
        />
      </div>

      {/* Canonical Category Showcase System */}
      <CategorySection 
        showViewAll={false}
        asHeading="h1"
      />

      {/* Trust & Guarantee Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-card">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-brand-500/10 text-brand-400 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-heading font-bold text-sm text-white">Zero Double-Booking Guarantee</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Every category is scheduled with atomic concurrency locks across all physical hubs.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-heading font-bold text-sm text-white">100% Verified Fleet</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Commercial RC, updated fitness inspection, and hub-maintained sanitization standards.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-heading font-bold text-sm text-white">Instant Online Confirmation</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Lock your vehicle instantly online and pick up at your chosen city hub in 3 minutes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
