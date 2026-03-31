
import React, { useState } from 'react';
import { HairProfileData } from '../types';
import Input from './common/Input';
import Button from './common/Button';
import { ArrowRightIcon } from './Icons';

interface Step1StartProps {
  onNext: () => void;
  setHairProfileData: React.Dispatch<React.SetStateAction<Partial<HairProfileData>>>;
  hairProfileData: Partial<HairProfileData>;
  setUserId?: React.Dispatch<React.SetStateAction<string | null>>;
  setPastUserHistory?: React.Dispatch<React.SetStateAction<any[]>>;
}

const Step1Start: React.FC<Step1StartProps> = ({ onNext, setHairProfileData, hairProfileData, setUserId, setPastUserHistory }) => {
  const [formData, setFormData] = useState({
    name: hairProfileData.name || '',
    email: hairProfileData.email || '',
    phone: hairProfileData.phone || '',
    age: hairProfileData.age || '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (id: string, value: string): string => {
    switch (id) {
      case 'name':
        if (!value.trim()) return 'Name is required.';
        if (/\d/.test(value)) return 'Name should not contain numbers.';
        return '';
      case 'email':
        if (!value.trim()) return 'Email is required.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address.';
        return '';
      case 'phone':
        if (!value.trim()) return 'Phone number is required.';
        if (!/^\d{10}$/.test(value)) return 'Please enter a valid 10-digit phone number.';
        return '';
      case 'age': {
        if (!value.trim()) return 'Age is required.';
        const ageNum = Number(value);
        if (isNaN(ageNum) || !Number.isInteger(ageNum)) return 'Please enter a valid age.';
        if (ageNum < 1 || ageNum > 100) return 'Please enter an age between 1 and 100.';
        return '';
      }
      default:
        return '';
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const error = validateField(id, value);
    setErrors(prev => ({ ...prev, [id]: error }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (errors[id as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [id]: '' }));
    }
  };

  const handleNext = async () => {
    const nameError = validateField('name', formData.name);
    const emailError = validateField('email', formData.email);
    const phoneError = validateField('phone', formData.phone);
    const ageError = validateField('age', formData.age);

    const newErrors = {
      name: nameError,
      email: emailError,
      phone: phoneError,
      age: ageError,
    };

    setErrors(newErrors);

    if (Object.values(newErrors).every(e => e === '')) {
      setIsSubmitting(true);
      try {
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (data.success) {
          setHairProfileData(prev => ({ ...prev, ...formData }));
          if (setUserId) setUserId(data.id);
          if (setPastUserHistory && data.isReturning && data.history) {
            setPastUserHistory(data.history);
          }
          onNext();
        } else {
          setErrors(prev => ({ ...prev, email: data.error || 'Error saving data' }));
        }
      } catch (error) {
        console.error('Error saving user:', error);
        setErrors(prev => ({ ...prev, name: 'Failed to connect to server. Please try again.' }));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const isNextButtonDisabled = !formData.name || !formData.email || !formData.age || !formData.phone || isSubmitting;

  return (
    <div className="animate-fade-in-up flex flex-col w-full lg:h-full bg-white rounded-2xl border-2 border-slate-300">
      <div className="flex-grow overflow-y-auto p-6 sm:p-8 lg:p-10">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Let's Begin!</h2>
          <p className="text-base text-slate-600 mt-1">Let's start with a little about you!</p>
        </div>

        <div className="mt-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <Input
                id="name"
                label="What's your name?*"
                placeholder="e.g. Rohan Sharma"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                autoComplete="name"
                disabled={isSubmitting}
                className={errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : ''}
              />
              {errors.name && <p className="text-red-600 text-xs mt-1.5">{errors.name}</p>}
            </div>
            <div>
              <Input
                id="age"
                label="How old are you?*"
                type="number"
                placeholder="e.g. 28"
                value={formData.age}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                disabled={isSubmitting}
                min="1"
                max="100"
                className={errors.age ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : ''}
              />
              {errors.age && <p className="text-red-600 text-xs mt-1.5">{errors.age}</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <Input
                id="email"
                label="Email*"
                type="email"
                placeholder="e.g. rohan.sharma@example.com"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                disabled={isSubmitting}
                autoComplete="email"
                className={errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : ''}
              />
              {errors.email && <p className="text-red-600 text-xs mt-1.5">{errors.email}</p>}
            </div>
            <div>
              <Input
                id="phone"
                label="Phone*"
                type="tel"
                placeholder="e.g. 9876543210"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                autoComplete="tel"
                className={errors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : ''}
              />
              {errors.phone && <p className="text-red-600 text-xs mt-1.5">{errors.phone}</p>}
            </div>
          </div>
        </div>
      </div>
      <div className="flex-shrink-0 flex justify-between items-center p-6 border-t border-slate-200">
        <Button variant="ghost" size="md" className="gap-2" disabled>
          &larr; Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={isNextButtonDisabled}
          size="md"
          className="gap-2 bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
        >
          {isSubmitting ? 'Saving...' : 'Next'} <ArrowRightIcon className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default Step1Start;
