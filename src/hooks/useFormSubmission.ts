import { useUser } from '@clerk/clerk-react';
import { supabase } from '../utils/supabase';
import { FormData } from '../types/form';
import { toast } from 'react-hot-toast';

export const useFormSubmission = () => {
  const { user } = useUser();

  const submitForm = async (formData: FormData) => {
    if (!user) {
      toast.error('You must be logged in to submit the form');
      return null;
    }

    try {
      // Helper function to convert string amounts to paise
      const toPaise = (amount: string) => Math.round(parseFloat(amount) * 100) || 0;

      // 1. First check if client exists
      console.log('Checking for existing client with user_id:', user.id);
      const { data: existingClients, error: fetchError } = await supabase
        .from('clients')
        .select('id, user_id')
        .eq('user_id', user.id);

      if (fetchError) {
        console.error('Error fetching clients:', fetchError);
        throw new Error('Failed to check for existing client');
      }

      let clientId;

      if (existingClients && existingClients.length > 0) {
        clientId = existingClients[0].id;
        console.log('Found existing client:', clientId);
      } else {
        console.log('Creating new client for user:', user.id);
        // 2. Create new client
        const { data: newClient, error: clientError } = await supabase
          .from('clients')
          .insert({
            user_id: user.id,
            name: formData.name || user.fullName || '',
            email: user.primaryEmailAddress?.emailAddress || '',
            phone: ''
          })
          .select()
          .single();

        if (clientError) {
          console.error('Failed to create client:', clientError);
          throw new Error(`Failed to create client: ${clientError.message}`);
        }

        if (!newClient) {
          throw new Error('Client creation succeeded but no data returned');
        }

        clientId = newClient.id;
        console.log('Created new client with ID:', clientId);
      }

      // 3. Create form submission
      console.log('Creating form submission for client:', clientId);
      const { data: submission, error: formError } = await supabase
        .from('client_forms')
        .insert({
          client_id: clientId,
          user_id: user.id,
          name: formData.name || user.fullName || '',
          city: formData.city,
          age: parseInt(formData.age) || 0,
          occupation: formData.occupation,
          monthly_salary: toPaise(formData.salary),
          monthly_side_income: toPaise(formData.sideIncome),
          monthly_other_income: toPaise(formData.otherIncome),
          monthly_bills: toPaise(formData.bills),
          monthly_daily_life: toPaise(formData.dailyLife),
          monthly_entertainment: toPaise(formData.entertainment),
          financial_goals: formData.goals || {},
          risk_tolerance: formData.riskTolerance || 'medium',
          monthly_savings: toPaise(formData.monthlySavings),
          emergency_cash: toPaise(formData.emergencyCash)
        })
        .select()
        .single();

      if (formError) {
        console.error('Failed to submit form:', formError);
        throw new Error(`Failed to submit form: ${formError.message}`);
      }

      if (!submission) {
        throw new Error('Form submission succeeded but no data returned');
      }

      console.log('Form submitted successfully:', submission);
      toast.success('Form submitted successfully!');
      return submission;
    } catch (error: any) {
      console.error('Error in form submission:', error);
      toast.error(error.message || 'Failed to submit form');
      return null;
    }
  };

  return { submitForm };
};
