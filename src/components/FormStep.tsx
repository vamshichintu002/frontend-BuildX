import { motion } from 'framer-motion';
import React from 'react';

interface FormStepProps {
  children: React.ReactNode;
  isVisible: boolean;
}

export const FormStep: React.FC<FormStepProps> = ({ children, isVisible }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ 
        opacity: isVisible ? 1 : 0,
        x: isVisible ? 0 : 50,
        display: isVisible ? 'block' : 'none'
      }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {children}
    </motion.div>
  );
};