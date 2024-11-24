import React from 'react';
import { motion } from 'framer-motion';
import { IndianRupee, Clock } from 'lucide-react';

interface GoalSelectorProps {
  label: string;
  name: string;
  selected: boolean;
  amount: string;
  years: string;
  description?: string;
  onToggle: (name: string) => void;
  onAmountChange: (value: string) => void;
  onYearsChange: (value: string) => void;
  onDescriptionChange?: (value: string) => void;
}

export const GoalSelector: React.FC<GoalSelectorProps> = ({
  label,
  name,
  selected,
  amount,
  years,
  description,
  onToggle,
  onAmountChange,
  onYearsChange,
  onDescriptionChange,
}) => {
  const validateAmount = (value: string) => {
    const amount = parseFloat(value);
    if (isNaN(amount) || amount < 0) return;
    onAmountChange(value);
  };

  const validateYears = (value: string) => {
    const years = parseInt(value);
    if (isNaN(years) || years < 1 || years > 50) return;
    onYearsChange(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border rounded-lg p-4 space-y-3"
    >
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggle(name)}
          className="w-4 h-4 text-blue-600"
        />
        <span className="font-medium">{label}</span>
      </div>

      {selected && (
        <div className="space-y-3 pl-7">
          <div className="relative">
            <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="number"
              value={amount}
              onChange={(e) => validateAmount(e.target.value)}
              placeholder="Amount needed"
              min="0"
              className="pl-10 w-full p-2 border rounded-lg"
            />
          </div>

          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="number"
              value={years}
              onChange={(e) => validateYears(e.target.value)}
              placeholder="In how many years?"
              min="1"
              max="50"
              className="pl-10 w-full p-2 border rounded-lg"
            />
          </div>

          {onDescriptionChange && (
            <input
              type="text"
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="Describe your goal"
              maxLength={100}
              className="w-full p-2 border rounded-lg"
            />
          )}
        </div>
      )}
    </motion.div>
  );
};