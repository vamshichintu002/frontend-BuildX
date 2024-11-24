import React from 'react';
import { motion } from 'framer-motion';

interface CheckboxGroupProps {
  options: { label: string; value: string }[];
  selectedValues: string[];
  onChange: (value: string) => void;
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  options,
  selectedValues,
  onChange,
}) => {
  return (
    <div className="space-y-2">
      {options.map((option, index) => (
        <motion.label
          key={option.value}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
        >
          <input
            type="checkbox"
            checked={selectedValues.includes(option.value)}
            onChange={() => onChange(option.value)}
            className="w-4 h-4 text-blue-600"
          />
          <span>{option.label}</span>
        </motion.label>
      ))}
    </div>
  );
};