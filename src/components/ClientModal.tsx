import React, { useState } from 'react';
import { IndianRupee, User, MapPin, Briefcase, Calendar, Building, Coffee, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FormInput } from './FormInput';
import { GoalSelector } from './GoalSelector';
import { RadioGroup } from './RadioGroup';
import { RISK_TOLERANCE_OPTIONS } from '../constants';
import { FormData } from '../types/form';
import { initialFormData } from '../utils/initialState';
import { useFormSubmission } from '../hooks/useFormSubmission';
import { toast } from 'react-hot-toast';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ClientModal: React.FC<ClientModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const { submitForm } = useFormSubmission();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGoalToggle = (goalName: string) => {
    const currentSelectedCount = Object.values(formData.goals).filter(goal => goal.selected).length;
    const isCurrentlySelected = formData.goals[goalName as keyof typeof formData.goals].selected;

    if (!isCurrentlySelected && currentSelectedCount >= 3) {
      toast.error('You can only select up to 3 financial goals');
      return;
    }

    setFormData(prev => ({
      ...prev,
      goals: {
        ...prev.goals,
        [goalName]: {
          ...prev.goals[goalName as keyof typeof prev.goals],
          selected: !prev.goals[goalName as keyof typeof prev.goals].selected
        }
      }
    }));
  };

  const handleGoalAmountChange = (goalName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      goals: {
        ...prev.goals,
        [goalName]: {
          ...prev.goals[goalName as keyof typeof prev.goals],
          amount: value
        }
      }
    }));
  };

  const handleGoalYearsChange = (goalName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      goals: {
        ...prev.goals,
        [goalName]: {
          ...prev.goals[goalName as keyof typeof prev.goals],
          years: value
        }
      }
    }));
  };

  const validateForm = (): boolean => {
    // Basic validation
    if (!formData.name || !formData.city || !formData.age || !formData.occupation) {
      toast.error('Please fill in all personal information');
      return false;
    }

    if (!formData.salary) {
      toast.error('Please enter your salary');
      return false;
    }

    // Validate goals
    const selectedGoals = Object.values(formData.goals).filter(goal => goal.selected);
    if (selectedGoals.length !== 3) {
      toast.error('Please select exactly 3 financial goals');
      return false;
    }

    if (selectedGoals.some(goal => !goal.amount || !goal.years)) {
      toast.error('Please fill in amount and years for all selected goals');
      return false;
    }

    if (!formData.riskTolerance || !formData.monthlySavings) {
      toast.error('Please complete your investment preferences');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const result = await submitForm(formData);
    
    if (result) {
      toast.success('Client added successfully!');
      onSuccess?.();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Add New Client</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
              <FormInput
                label="What should we call you?"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your name"
                icon={User}
                required
              />
              
              <FormInput
                label="Which city do you call home?"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Your city"
                icon={MapPin}
                required
              />
              
              <FormInput
                label="What's your age?"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleInputChange}
                placeholder="Your age"
                icon={Calendar}
                required
              />
              
              <FormInput
                label="What do you do for a living?"
                name="occupation"
                value={formData.occupation}
                onChange={handleInputChange}
                placeholder="Your occupation"
                icon={Briefcase}
                required
              />
            </div>

            {/* Income */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Monthly Income</h3>
              <FormInput
                label="Your salary brings in"
                name="salary"
                type="number"
                value={formData.salary}
                onChange={handleInputChange}
                placeholder="Monthly salary"
                icon={IndianRupee}
                required
              />
              
              <FormInput
                label="Side hustles add"
                name="sideIncome"
                type="number"
                value={formData.sideIncome}
                onChange={handleInputChange}
                placeholder="Side income"
                icon={Sparkles}
              />
              
              <FormInput
                label="Any other income (rent/investments)"
                name="otherIncome"
                type="number"
                value={formData.otherIncome}
                onChange={handleInputChange}
                placeholder="Other income"
                icon={Building}
              />
            </div>

            {/* Expenses */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Monthly Expenses</h3>
              <FormInput
                label="Must-pay bills (rent, utilities, EMIs)"
                name="bills"
                type="number"
                value={formData.bills}
                onChange={handleInputChange}
                placeholder="Monthly bills"
                icon={Building}
                required
              />
              
              <FormInput
                label="Daily life (food, travel, etc.)"
                name="dailyLife"
                type="number"
                value={formData.dailyLife}
                onChange={handleInputChange}
                placeholder="Daily expenses"
                icon={Coffee}
                required
              />
              
              <FormInput
                label="Fun stuff (entertainment, shopping)"
                name="entertainment"
                type="number"
                value={formData.entertainment}
                onChange={handleInputChange}
                placeholder="Entertainment expenses"
                icon={Sparkles}
                required
              />
            </div>

            {/* Financial Goals */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Financial Goals (Select 3)</h3>
              <div className="space-y-4">
                <GoalSelector
                  label="A dream home"
                  name="dreamHome"
                  selected={formData.goals.dreamHome.selected}
                  amount={formData.goals.dreamHome.amount}
                  years={formData.goals.dreamHome.years}
                  onToggle={() => handleGoalToggle('dreamHome')}
                  onAmountChange={(value) => handleGoalAmountChange('dreamHome', value)}
                  onYearsChange={(value) => handleGoalYearsChange('dreamHome', value)}
                />

                <GoalSelector
                  label="Children's education"
                  name="education"
                  selected={formData.goals.education.selected}
                  amount={formData.goals.education.amount}
                  years={formData.goals.education.years}
                  onToggle={() => handleGoalToggle('education')}
                  onAmountChange={(value) => handleGoalAmountChange('education', value)}
                  onYearsChange={(value) => handleGoalYearsChange('education', value)}
                />

                <GoalSelector
                  label="A comfortable retirement"
                  name="retirement"
                  selected={formData.goals.retirement.selected}
                  amount={formData.goals.retirement.amount}
                  years={formData.goals.retirement.years}
                  onToggle={() => handleGoalToggle('retirement')}
                  onAmountChange={(value) => handleGoalAmountChange('retirement', value)}
                  onYearsChange={(value) => handleGoalYearsChange('retirement', value)}
                />

                <GoalSelector
                  label="Starting a business"
                  name="business"
                  selected={formData.goals.business.selected}
                  amount={formData.goals.business.amount}
                  years={formData.goals.business.years}
                  onToggle={() => handleGoalToggle('business')}
                  onAmountChange={(value) => handleGoalAmountChange('business', value)}
                  onYearsChange={(value) => handleGoalYearsChange('business', value)}
                />

                <GoalSelector
                  label="Dream vacation"
                  name="vacation"
                  selected={formData.goals.vacation.selected}
                  amount={formData.goals.vacation.amount}
                  years={formData.goals.vacation.years}
                  onToggle={() => handleGoalToggle('vacation')}
                  onAmountChange={(value) => handleGoalAmountChange('vacation', value)}
                  onYearsChange={(value) => handleGoalYearsChange('vacation', value)}
                />
              </div>
            </div>

            {/* Investment Style */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Investment Preferences</h3>
              <RadioGroup
                label="What's your risk tolerance?"
                name="riskTolerance"
                options={RISK_TOLERANCE_OPTIONS}
                value={formData.riskTolerance}
                onChange={(value) => setFormData(prev => ({ ...prev, riskTolerance: value }))}
              />

              <FormInput
                label="Monthly savings target"
                name="monthlySavings"
                type="number"
                value={formData.monthlySavings}
                onChange={handleInputChange}
                placeholder="Target amount"
                icon={IndianRupee}
                required
              />

              <FormInput
                label="Emergency fund goal"
                name="emergencyCash"
                type="number"
                value={formData.emergencyCash}
                onChange={handleInputChange}
                placeholder="Emergency fund amount"
                icon={IndianRupee}
                required
              />
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add Client
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
