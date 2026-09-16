import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { categoryApi } from '../../services/categoryApi';
import { vehicleApi } from '../../services/vehicleApi';
import { catalogApi } from '../../services/catalogApi';
import { CityAutocomplete } from '../../components/common/CityAutocomplete';
import { 
  X, 
  Upload, 
  Car, 
  Bike, 
  MapPin, 
  IndianRupee, 
  Check, 
  AlertCircle, 
  Plus, 
  Trash2,
  Sparkles
} from 'lucide-react';

export const AddVehicleModal = ({ isOpen, onClose, onVehicleAdded, vehicleToEdit = null }) => {
  const [categories, setCategories] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableFeatureList = [
    'Helmet Included',
    'Dual Helmet Included',
    'GPS Navigation',
    'USB Fast Charger',
    'Bluetooth Audio',
    'ABS Braking',
    'Sunroof',
    'Rear Camera',
    'Keyless Start',
    'Fastag Available',
    'Child Seat Available'
  ];
  const [selectedFeatures, setSelectedFeatures] = useState(['Helmet Included', 'GPS Navigation']);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      categoryId: '',
      brand: '',
      model: '',
      registrationNumber: '',
      year: 2023,
      fuelType: 'petrol',
      transmission: 'manual',
      seatingCapacity: 2,
      engineCapacity: 150,
      fuelEconomy: '',
      fuelEconomyUnit: 'km/l',
      city: 'Indore',
      address: '',
      hourlyRate: 80,
      rate12Hour: 500,
      rate24Hour: 850,
      minRentalHours: 1,
      securityDeposit: 1000
    }
  });

  const selectedFuel = watch('fuelType');
  useEffect(() => {
    if (selectedFuel === 'electric') {
      setValue('fuelEconomyUnit', 'km/charge');
    } else if (selectedFuel === 'cng') {
      setValue('fuelEconomyUnit', 'km/kg');
    } else {
      setValue('fuelEconomyUnit', 'km/l');
    }
  }, [selectedFuel]);

  const [catalogBrands, setCatalogBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [catalogModels, setCatalogModels] = useState([]);
  const [selectedCatalogModel, setSelectedCatalogModel] = useState(null);
  const [catalogId, setCatalogId] = useState(null);
  const [loadingCatalogModels, setLoadingCatalogModels] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadCategories();
      loadCatalogBrands();
      if (vehicleToEdit) {
        setCatalogId(vehicleToEdit.catalogId?._id || vehicleToEdit.catalogId || null);
        reset({
          categoryId: vehicleToEdit.categoryId?._id || vehicleToEdit.categoryId || '',
          brand: vehicleToEdit.brand || '',
          model: vehicleToEdit.model || '',
          registrationNumber: vehicleToEdit.registrationNumber || '',
          year: vehicleToEdit.year || 2023,
          fuelType: vehicleToEdit.fuelType || 'petrol',
          transmission: vehicleToEdit.transmission || 'manual',
          seatingCapacity: vehicleToEdit.seatingCapacity || 2,
          engineCapacity: vehicleToEdit.engineCapacity || '',
          fuelEconomy: vehicleToEdit.fuelEconomy || '',
          fuelEconomyUnit: vehicleToEdit.fuelEconomyUnit || 'km/l',
          city: vehicleToEdit.location?.city || 'Indore',
          address: vehicleToEdit.location?.address || '',
          hourlyRate: vehicleToEdit.pricing?.hourlyRate || 80,
          rate12Hour: vehicleToEdit.pricing?.rate12Hour || 500,
          rate24Hour: vehicleToEdit.pricing?.rate24Hour || 850,
          minRentalHours: vehicleToEdit.pricing?.minRentalHours || 1,
          securityDeposit: vehicleToEdit.pricing?.securityDeposit || 1000
        });
        if (vehicleToEdit.features) {
          setSelectedFeatures(vehicleToEdit.features);
        }
      } else {
        setCatalogId(null);
        setSelectedCatalogModel(null);
        setSelectedBrand('');
        setCatalogModels([]);
      }
    }
  }, [isOpen, vehicleToEdit]);

  const loadCategories = async () => {
    try {
      const res = await categoryApi.getAllCategories();
      setCategories(res.data.categories || []);
      if (res.data.categories?.length > 0 && !vehicleToEdit) {
        setValue('categoryId', res.data.categories[0]._id);
      }
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  const loadCatalogBrands = async () => {
    try {
      const res = await catalogApi.getDistinctBrands();
      setCatalogBrands(res.data || []);
    } catch (err) {
      console.error('Failed to load catalog brands', err);
    }
  };

  const handleBrandSelect = async (brand) => {
    setSelectedBrand(brand);
    setSelectedCatalogModel(null);
    setCatalogId(null);
    if (!brand) {
      setCatalogModels([]);
      return;
    }
    setLoadingCatalogModels(true);
    try {
      const res = await catalogApi.getModelsByBrand(brand);
      setCatalogModels(res.data || []);
    } catch (err) {
      console.error('Failed to load models for brand', brand, err);
    } finally {
      setLoadingCatalogModels(false);
    }
  };

  const handleCatalogModelSelect = (modelId) => {
    const model = catalogModels.find((m) => m._id === modelId);
    if (!model) return;

    setSelectedCatalogModel(model);
    setCatalogId(model._id);

    setValue('brand', model.brand);
    setValue('model', `${model.model} ${model.variant}`);
    setValue('fuelType', model.fuelType);
    setValue('transmission', model.transmission);
    setValue('seatingCapacity', model.seatingCapacity);
    setValue(
      'engineCapacity',
      model.engineCapacity ||
        (model.fuelType === 'electric' ? model.specifications?.batteryCapacityKwh : '') ||
        ''
    );
    setValue('fuelEconomy', model.fuelEconomy?.value || '');
    setValue(
      'fuelEconomyUnit',
      model.fuelEconomy?.unit || (model.fuelType === 'electric' ? 'km/charge' : 'km/l')
    );

    if (model.suggestedPricing) {
      setValue('hourlyRate', model.suggestedPricing.hourlyRate || 80);
      setValue('rate12Hour', model.suggestedPricing.rate12Hour || 500);
      setValue('rate24Hour', model.suggestedPricing.rate24Hour || 850);
    }

    // Match category
    const catId = model.categoryId?._id || model.categoryId;
    if (catId) {
      setValue('categoryId', catId);
    }

    // Merge features
    if (model.features && model.features.length > 0) {
      setSelectedFeatures((prev) => Array.from(new Set([...prev, ...model.features])));
    }

    // Pre-populate model image previews if vendor hasn't uploaded local files
    if (model.images && model.images.length > 0 && selectedFiles.length === 0) {
      setPreviewUrls(model.images.map((img) => img.url));
    }
  };

  const handleClearCatalogSelection = () => {
    setSelectedBrand('');
    setCatalogModels([]);
    setSelectedCatalogModel(null);
    setCatalogId(null);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + selectedFiles.length > 5) {
      setErrorMessage('You can upload a maximum of 5 images');
      return;
    }

    const newFiles = [...selectedFiles, ...files];
    setSelectedFiles(newFiles);

    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(newPreviews);
    setErrorMessage('');
  };

  const removeFile = (index) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    const updatedPreviews = previewUrls.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    setPreviewUrls(updatedPreviews);
  };

  const toggleFeature = (feature) => {
    if (selectedFeatures.includes(feature)) {
      setSelectedFeatures(selectedFeatures.filter((f) => f !== feature));
    } else {
      setSelectedFeatures([...selectedFeatures, feature]);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      if (vehicleToEdit) {
        const payload = {
          ...data,
          features: selectedFeatures,
          catalogId: catalogId || undefined
        };
        const response = await vehicleApi.updateVehicle(vehicleToEdit._id, payload);
        onVehicleAdded(response.data.vehicle);
      } else {
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
          if (data[key] !== undefined && data[key] !== null) {
            formData.append(key, data[key]);
          }
        });

        if (catalogId) {
          formData.append('catalogId', catalogId);
        }

        formData.append('features', JSON.stringify(selectedFeatures));

        selectedFiles.forEach((file) => {
          formData.append('images', file);
        });

        const response = await vehicleApi.createVehicle(formData);
        onVehicleAdded(response.data.vehicle);
      }

      onClose();
      reset();
      setSelectedFiles([]);
      setPreviewUrls([]);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to save vehicle listing. Please check inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-6 p-6 sm:p-8 relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-100 dark:bg-accent-950/80 text-accent-600 flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white">
                {vehicleToEdit ? 'Edit Vehicle Fleet Listing' : 'Add Vehicle to Fleet'}
              </h2>
              <p className="text-xs text-slate-500">
                {vehicleToEdit ? 'Update vehicle specifications, fuel economy, rates, and pickup location.' : 'Set vehicle specifications, rates for all rental plans, and photos.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" /> {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Master Catalog Quick-Fill Picker */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-50/60 via-slate-50 to-accent-50/60 dark:from-brand-950/20 dark:via-slate-900 dark:to-accent-950/20 border border-brand-200/60 dark:border-brand-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-brand-500 text-white flex items-center justify-center shadow-sm">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    Quick-Fill from Master Catalog
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300">
                      300+ Verified Models
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Select a verified Indian vehicle model to auto-fill ARAI specs, certified fuel economy, and suggested rates in 1-click.
                  </p>
                </div>
              </div>
              {selectedCatalogModel && (
                <button
                  type="button"
                  onClick={handleClearCatalogSelection}
                  className="text-[11px] font-medium text-slate-500 hover:text-red-500 transition-colors"
                >
                  Clear & Manual Input
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Brand Selector */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  1. Choose Brand
                </label>
                <select
                  value={selectedBrand}
                  onChange={(e) => handleBrandSelect(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  <option value="">-- Choose Brand ({catalogBrands.length} Available) --</option>
                  {catalogBrands.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              {/* Model & Variant Selector */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  2. Choose Model & Variant
                </label>
                <select
                  disabled={!selectedBrand || loadingCatalogModels}
                  value={selectedCatalogModel?._id || ''}
                  onChange={(e) => handleCatalogModelSelect(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none disabled:opacity-50"
                >
                  <option value="">
                    {loadingCatalogModels
                      ? 'Loading models...'
                      : selectedBrand
                      ? `-- Select ${selectedBrand} Model (${catalogModels.length}) --`
                      : 'First select a brand above'}
                  </option>
                  {catalogModels.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.model} - {m.variant} ({m.fuelEconomy?.value} {m.fuelEconomy?.unit})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Selected Model Confirmation Banner */}
            {selectedCatalogModel && (
              <div className="mt-2 p-2.5 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-brand-200 dark:border-brand-900/60 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>
                    <strong className="text-brand-600 dark:text-brand-400">
                      {selectedCatalogModel.brand} {selectedCatalogModel.model}
                    </strong>{' '}
                    ({selectedCatalogModel.variant}) — Verified ARAI Economy:{' '}
                    <strong>
                      {selectedCatalogModel.fuelEconomy?.value} {selectedCatalogModel.fuelEconomy?.unit}
                    </strong>
                  </span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold flex-shrink-0">
                  Auto-Filled
                </span>
              </div>
            )}
          </div>

          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-brand-500" /> Vehicle Identification & Specs
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Category *
                </label>
                <select
                  {...register('categoryId', { required: true })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name} ({cat.type === 'two_wheeler' ? '2-Wheeler' : '4-Wheeler'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Brand *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Royal Enfield, Hyundai"
                  {...register('brand', { required: true })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Model *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Hunter 350, i20 Asta"
                  {...register('model', { required: true })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Reg. Number *
                </label>
                <input
                  type="text"
                  placeholder="KA04HR1001"
                  {...register('registrationNumber', { required: true })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium uppercase focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Year *
                </label>
                <input
                  type="number"
                  {...register('year', { required: true })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Fuel Type *
                </label>
                <select
                  {...register('fuelType')}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium capitalize focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  <option value="petrol">Petrol</option>
                  <option value="electric">Electric</option>
                  <option value="diesel">Diesel</option>
                  <option value="cng">CNG</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Transmission *
                </label>
                <select
                  {...register('transmission')}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium capitalize focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  <option value="manual">Manual</option>
                  <option value="automatic">Automatic</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Seating Capacity *
                </label>
                <input
                  type="number"
                  {...register('seatingCapacity', { required: true })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Engine (cc / kWh)
                </label>
                <input
                  type="number"
                  placeholder="350"
                  {...register('engineCapacity')}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <CityAutocomplete
                  label="Location City"
                  placeholder="Select city (Indore, Bhopal, Gwalior)"
                  value={watch('city')}
                  onChange={(cityName) => setValue('city', cityName, { shouldValidate: true })}
                  error={errors.city?.message}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Pickup Hub Address
                </label>
                <input
                  type="text"
                  placeholder="Indiranagar Hub"
                  {...register('address')}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Feature A: Fuel Economy / Certified Mileage */}
            <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Fuel Economy / Certified Mileage
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.1"
                      placeholder={watch('fuelType') === 'electric' ? 'e.g. 85' : 'e.g. 45'}
                      {...register('fuelEconomy')}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                    <select
                      {...register('fuelEconomyUnit')}
                      className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    >
                      <option value="km/l">km/l</option>
                      <option value="km/kg">km/kg</option>
                      <option value="km/charge">km/charge</option>
                    </select>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Adaptive unit ({watch('fuelType') === 'electric' ? 'km/charge for EV' : watch('fuelType') === 'cng' ? 'km/kg for CNG' : 'km/l for petrol/diesel'}).
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Rental Pricing Plans */}
          <div className="p-4 rounded-2xl bg-brand-50/60 dark:bg-slate-800/60 border border-brand-200/80 dark:border-slate-700 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-800 dark:text-brand-300 flex items-center gap-1.5">
              <IndianRupee className="w-3.5 h-3.5" /> Multi-Plan Pricing Matrix
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Hourly Rate (₹) *
                </label>
                <input
                  type="number"
                  placeholder="80"
                  {...register('hourlyRate', { required: true })}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  12-Hour Plan (₹) *
                </label>
                <input
                  type="number"
                  placeholder="500"
                  {...register('rate12Hour', { required: true })}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  24-Hour Plan (₹) *
                </label>
                <input
                  type="number"
                  placeholder="850"
                  {...register('rate24Hour', { required: true })}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Security Deposit (₹)
                </label>
                <input
                  type="number"
                  placeholder="1000"
                  {...register('securityDeposit')}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Feature Badges */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Vehicle Features & Inclusions
            </label>
            <div className="flex flex-wrap gap-2">
              {availableFeatureList.map((feature) => {
                const isSelected = selectedFeatures.includes(feature);
                return (
                  <button
                    key={feature}
                    type="button"
                    onClick={() => toggleFeature(feature)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    {feature}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Image Upload */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Vehicle Photos (Max 5)
            </label>
            
            <div className="flex flex-wrap items-center gap-3">
              {previewUrls.map((url, idx) => (
                <div key={idx} className="relative w-24 h-20 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 group">
                  <img src={url} alt="preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {previewUrls.length < 5 && (
                <label className="w-24 h-20 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-brand-500 flex flex-col items-center justify-center cursor-pointer text-slate-400 hover:text-brand-500 transition-colors">
                  <Upload className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-semibold">Upload</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-accent-600 hover:bg-accent-700 text-white text-xs font-bold shadow-md hover:shadow-accent-500/25 transition-all flex items-center gap-2 disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{vehicleToEdit ? 'Saving...' : 'Listing Vehicle...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{vehicleToEdit ? 'Save Changes' : 'Publish Vehicle'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
