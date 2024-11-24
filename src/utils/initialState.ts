import { FormData } from '../types/form';

export const initialFormData: FormData = {
  name: '',
  city: '',
  age: '',
  occupation: '',
  salary: '',
  sideIncome: '',
  otherIncome: '',
  bills: '',
  dailyLife: '',
  entertainment: '',
  goals: {
    dreamHome: { selected: false, amount: '', years: '' },
    education: { selected: false, amount: '', years: '' },
    retirement: { selected: false, amount: '', years: '' },
    business: { selected: false, amount: '', years: '' },
    vacation: { selected: false, amount: '', years: '' },
    wedding: { selected: false, amount: '', years: '' },
    other: { selected: false, amount: '', years: '', description: '' }
  },
  riskTolerance: '',
  monthlySavings: '',
  emergencyCash: ''
};