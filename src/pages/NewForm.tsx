import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';

const NewForm: React.FC = () => {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fields: [] as { name: string; type: string; required: boolean }[]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      toast.error('You must be logged in to create a form');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('forms')
        .insert([
          {
            title: formData.title,
            description: formData.description,
            fields: formData.fields,
            user_id: userId,
          }
        ])
        .select()
        .single();

      if (error) throw error;

      toast.success('Form created successfully!');
      navigate(`/dashboard`);
    } catch (error) {
      console.error('Error creating form:', error);
      toast.error('Failed to create form');
    }
  };

  const addField = () => {
    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, { name: '', type: 'text', required: false }]
    }));
  };

  const updateField = (index: number, field: Partial<typeof formData.fields[0]>) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map((f, i) => 
        i === index ? { ...f, ...field } : f
      )
    }));
  };

  const removeField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-6">Create New Form</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Form Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                rows={3}
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium">Form Fields</h2>
                <button
                  type="button"
                  onClick={addField}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Add Field
                </button>
              </div>

              {formData.fields.map((field, index) => (
                <div key={index} className="flex gap-4 items-start p-4 bg-gray-50 rounded-md">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Field Name"
                      value={field.name}
                      onChange={e => updateField(index, { name: e.target.value })}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="w-32">
                    <select
                      value={field.type}
                      onChange={e => updateField(index, { type: e.target.value })}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="text">Text</option>
                      <option value="number">Number</option>
                      <option value="email">Email</option>
                      <option value="tel">Phone</option>
                      <option value="date">Date</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={field.required}
                      onChange={e => updateField(index, { required: e.target.checked })}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-600">Required</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeField(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create Form
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewForm;
