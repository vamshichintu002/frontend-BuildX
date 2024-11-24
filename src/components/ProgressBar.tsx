import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps, stepTitles }) => {
  return (
    <div className="mb-8">
      <div className="flex justify-center gap-2 mb-4">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <motion.div
            key={index}
            className={`h-2 w-16 rounded-full ${
              index + 1 <= currentStep ? 'bg-blue-500' : 'bg-gray-200'
            }`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          />
        ))}
      </div>
      <motion.p
        key={currentStep}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-gray-600 text-center"
      >
        {stepTitles[currentStep - 1]}
      </motion.p>
    </div>
  );
};