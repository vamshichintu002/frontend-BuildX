import React from 'react';
import { motion } from 'framer-motion';

interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  options,
  value,
  onChange,
}) => {
  return (
    <div className="space-y-3">
      {options.map((option, index) => (
        <motion.label
          key={option.value}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-start p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange(e.target.value)}
            className="mt-1 w-4 h-4 text-blue-600"
          />
          <div className="ml-3">
            <div className="font-medium">{option.label}</div>
            {option.description && (
              <div className="text-sm text-gray-500">{option.description}</div>
            )}
          </div>
        </motion.label>
      ))}
    </div>
  );
};