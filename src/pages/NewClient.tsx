// Move the contents of App.tsx here and rename the component to NewClient
import React, { useState } from 'react';
import { IndianRupee, User, MapPin, Briefcase, Calendar, Building, Coffee, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { FormStep } from '../components/FormStep';
import { FormInput } from '../components/FormInput';
import { ProgressBar } from '../components/ProgressBar';
import { NavigationButtons } from '../components/NavigationButtons';
import { GoalSelector } from '../components/GoalSelector';
import { RadioGroup } from '../components/RadioGroup';
import { STEP_TITLES, RISK_TOLERANCE_OPTIONS } from '../constants';
import { FormData } from '../types/form';
import { initialFormData } from '../utils/initialState';
import { useFormSubmission } from '../hooks/useFormSubmission';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export const NewClient = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const navigate = useNavigate();
  const { submitForm } = useFormSubmission();
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateStep = (currentStep: number): boolean => {
    switch (currentStep) {
      case 1:
        return Boolean(
          formData.name &&
          formData.city &&
          formData.age &&
          formData.occupation
        );
      case 2:
        return Boolean(
          formData.salary &&
          formData.sideIncome &&
          formData.otherIncome
        );
      case 3:
        return Boolean(
          formData.bills &&
          formData.dailyLife &&
          formData.entertainment
        );
      case 4:
        const selectedGoals = Object.values(formData.goals).filter(goal => goal.selected);
        if (selectedGoals.length !== 3) {
          alert('Please select exactly 3 financial goals.');
          return false;
        }
        return selectedGoals.every(goal => goal.amount && goal.years);
      case 5:
        return Boolean(
          formData.riskTolerance &&
          formData.monthlySavings &&
          formData.emergencyCash
        );
      default:
        return true;
    }
  };

  const handleGoalToggle = (goalName: string) => {
    const currentSelectedCount = Object.values(formData.goals).filter(goal => goal.selected).length;
    const isCurrentlySelected = formData.goals[goalName as keyof typeof formData.goals].selected;

    if (!isCurrentlySelected && currentSelectedCount >= 3) {
      alert('You can only select up to 3 financial goals. Please deselect one before adding another.');
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

  const nextStep = () => {
    if (!validateStep(step)) {
      alert('Please fill in all required fields before proceeding.');
      return;
    }
    setStep(prev => Math.min(prev + 1, STEP_TITLES.length));
  };

  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));
  
  const handleSubmit = async () => {
    if (!validateStep(5)) {
      toast.error('Please fill in all required fields before submitting.');
      return;
    }

    const result = await submitForm(formData);
    
    if (result) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
        >
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-gray-800 mb-2"
            >
              Let's Build Your Financial Future Together 🚀
            </motion.h1>
            
            <ProgressBar
              currentStep={step}
              totalSteps={STEP_TITLES.length}
              stepTitles={STEP_TITLES}
            />
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            {/* Step 1: Personal Information */}
            <FormStep isVisible={step === 1}>
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
            </FormStep>

            {/* Step 2: Income */}
            <FormStep isVisible={step === 2}>
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-lg font-semibold text-gray-800 mb-4"
              >
                How does money flow in your world each month?
              </motion.h3>
              
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
                required
              />
              
              <FormInput
                label="Any other income (rent/investments)"
                name="otherIncome"
                type="number"
                value={formData.otherIncome}
                onChange={handleInputChange}
                placeholder="Other income"
                icon={Building}
                required
              />
            </FormStep>

            {/* Step 3: Expenses */}
            <FormStep isVisible={step === 3}>
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-lg font-semibold text-gray-800 mb-4"
              >
                What takes up your monthly budget?
              </motion.h3>
              
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
            </FormStep>

            {/* Step 4: Financial Goals */}
            <FormStep isVisible={step === 4}>
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-lg font-semibold text-gray-800 mb-4"
              >
                Pick your top 3 financial goals
              </motion.h3>

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

                <GoalSelector
                  label="Your child's wedding"
                  name="wedding"
                  selected={formData.goals.wedding.selected}
                  amount={formData.goals.wedding.amount}
                  years={formData.goals.wedding.years}
                  onToggle={() => handleGoalToggle('wedding')}
                  onAmountChange={(value) => handleGoalAmountChange('wedding', value)}
                  onYearsChange={(value) => handleGoalYearsChange('wedding', value)}
                />

                <GoalSelector
                  label="Something else?"
                  name="other"
                  selected={formData.goals.other.selected}
                  amount={formData.goals.other.amount}
                  years={formData.goals.other.years}
                  onToggle={() => handleGoalToggle('other')}
                  onAmountChange={(value) => handleGoalAmountChange('other', value)}
                  onYearsChange={(value) => handleGoalYearsChange('other', value)}
                />
              </div>
            </FormStep>

            {/* Step 5: Investment Style */}
            <FormStep isVisible={step === 5}>
              <motion.div className="space-y-6">
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-lg font-semibold text-gray-800 mb-4"
                >
                  Understanding Your Investment Style
                </motion.h3>

                <div className="space-y-4">
                  <p className="text-gray-600">
                    Scenario: You invested ₹1,00,000 in the stock market. One month later, it's worth ₹80,000. What's your first thought?
                  </p>

                  <RadioGroup
                    name="riskTolerance"
                    options={RISK_TOLERANCE_OPTIONS}
                    value={formData.riskTolerance}
                    onChange={(value) => setFormData(prev => ({ ...prev, riskTolerance: value as typeof prev.riskTolerance }))}
                  />

                  <FormInput
                    label="How much can you save monthly?"
                    name="monthlySavings"
                    type="number"
                    value={formData.monthlySavings}
                    onChange={handleInputChange}
                    placeholder="Monthly savings possible"
                    icon={IndianRupee}
                    required
                  />

                  <FormInput
                    label="Emergency cash needed"
                    name="emergencyCash"
                    type="number"
                    value={formData.emergencyCash}
                    onChange={handleInputChange}
                    placeholder="Emergency fund target"
                    icon={IndianRupee}
                    required
                  />
                </div>
              </motion.div>
            </FormStep>

            <NavigationButtons
              currentStep={step}
              totalSteps={STEP_TITLES.length}
              onPrevious={prevStep}
              onNext={nextStep}
              onSubmit={handleSubmit}
            />
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default NewClient;
