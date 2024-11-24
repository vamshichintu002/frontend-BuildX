export interface FormData {
  // Personal Information
  name: string;
  city: string;
  age: string;
  occupation: string;
  
  // Income
  salary: string;
  sideIncome: string;
  otherIncome: string;
  
  // Expenses
  bills: string;
  dailyLife: string;
  entertainment: string;

  // Financial Goals
  goals: {
    dreamHome: { selected: boolean; amount: string; years: string; };
    education: { selected: boolean; amount: string; years: string; };
    retirement: { selected: boolean; amount: string; years: string; };
    business: { selected: boolean; amount: string; years: string; };
    vacation: { selected: boolean; amount: string; years: string; };
    wedding: { selected: boolean; amount: string; years: string; };
    other: { selected: boolean; amount: string; years: string; description: string; };
  };

  // Investment Style
  riskTolerance: 'low' | 'medium' | 'high' | '';
  monthlySavings: string;
  emergencyCash: string;
}