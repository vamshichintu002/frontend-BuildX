import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../utils/supabase';

export const FormPage = () => {
  const { token } = useParams<{ token: string }>();
  const [clientId, setClientId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    validateToken();
  }, [token]);

  const validateToken = async () => {
    if (!token) {
      setError('Invalid form link');
      setLoading(false);
      return;
    }

    try {
      await supabase.rpc('set_form_token', { token });

      const { data, error } = await supabase
        .from('clients')
        .select('id')
        .eq('form_token', token)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setClientId(data.id);
      } else {
        setError('Invalid form link');
      }
    } catch (err) {
      console.error('Error validating token:', err);
      setError('Error validating form link');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: any) => {
    if (!clientId) return;

    try {
      const { data, error } = await supabase
        .from('client_forms')
        .insert([
          {
            ...formData,
            client_id: clientId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;

      // Show success message and maybe redirect
      alert('Form submitted successfully!');
    } catch (err) {
      console.error('Error submitting form:', err);
      alert('Error submitting form. Please try again.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      {/* Your form UI here */}
      <form onSubmit={(e) => {
        e.preventDefault();
        // Get form data and call handleSubmit
      }}>
        {/* Form fields */}
      </form>
    </div>
  );
}; 