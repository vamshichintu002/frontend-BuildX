import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface NavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onSubmit,
}) => {
  return (
    <div className="flex justify-between pt-6">
      {currentStep > 1 && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onPrevious}
          className="flex items-center px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all hover:scale-105"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Previous
        </motion.button>
      )}
      {currentStep < totalSteps ? (
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onNext}
          className="flex items-center ml-auto px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all hover:scale-105"
        >
          Next
          <ArrowRight className="h-5 w-5 ml-2" />
        </motion.button>
      ) : (
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onSubmit}
          className="flex items-center ml-auto px-6 py-3 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-all hover:scale-105"
        >
          Submit
          <ArrowRight className="h-5 w-5 ml-2" />
        </motion.button>
      )}
    </div>
  );
};