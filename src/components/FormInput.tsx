import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  icon: LucideIcon;
  required?: boolean;
  min?: string | number;
  max?: string | number;
  pattern?: string;
  errorMessage?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  icon: Icon,
  required = false,
  min,
  max,
  pattern,
  errorMessage,
}) => {
  const [error, setError] = React.useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    
    // Validation for name (only letters and spaces)
    if (name === 'name' && input && !/^[A-Za-z\s]*$/.test(input)) {
      setError('Please enter only letters and spaces');
      return;
    }
    
    // Validation for age (1-100)
    if (name === 'age' && input) {
      const age = parseInt(input);
      if (isNaN(age) || age < 1 || age > 100) {
        setError('Age must be between 1 and 100');
        return;
      }
    }
    
    // Validation for monetary values
    if (['salary', 'sideIncome', 'otherIncome', 'bills', 'dailyLife', 'entertainment', 'monthlySavings', 'emergencyCash'].includes(name)) {
      const amount = parseFloat(input);
      if (input && (isNaN(amount) || amount < 0)) {
        setError('Please enter a valid amount');
        return;
      }
    }

    setError('');
    onChange(e);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative group">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 transition-colors group-hover:text-blue-500" />
        <input
          type={type}
          name={name}
          value={value}
          onChange={handleChange}
          required={required}
          min={min}
          max={max}
          pattern={pattern}
          className={`pl-10 w-full p-3 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-blue-300`}
          placeholder={placeholder}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </motion.div>
  );
};