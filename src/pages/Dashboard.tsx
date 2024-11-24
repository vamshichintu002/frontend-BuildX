import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, LogOut, Users, FileText, Settings, ChevronRight, X, Copy, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useClerk, useUser } from '@clerk/clerk-react';
import { createClient } from '@supabase/supabase-js';
import { toast } from 'react-hot-toast';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('Initializing Supabase with:', {
  url: supabaseUrl,
  keyPresent: !!supabaseAnonKey
});

// Test Supabase connection
const testConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    
    // Test 1: Basic connection
    const { data: tableData, error: tableError } = await supabase
      .from('clients')
      .select('*')
      .limit(0);

    if (tableError) {
      console.error('Table access error:', tableError);
    } else {
      console.log('Successfully connected to clients table');
    }

    // Test 2: Check RLS policies
    const { data: rlsData, error: rlsError } = await supabase.rpc('get_table_policies', { table_name: 'clients' });
    
    if (rlsError) {
      console.error('Error checking RLS policies:', rlsError);
    } else {
      console.log('RLS Policies:', rlsData);
    }

  } catch (err) {
    console.error('Connection test error:', err);
  }
};

testConnection();

interface Client {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  email: string;
  created_at: string;
  updated_at: string;
}

interface NewClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (clientData: { name: string; phone: string; email: string }) => void;
}

const NewClientModal: React.FC<NewClientModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formLink = `${window.location.origin}/new-client`; // Your form link

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit({ name, phone, email });
      setName('');
      setPhone('');
      setEmail('');
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyFormLink = async () => {
    try {
      await navigator.clipboard.writeText(formLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-lg p-6 w-full max-w-md"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add New Client</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mt-4 bg-gray-50 p-3 rounded-md">
            <label className="block text-sm font-medium text-gray-700 mb-2">Form Link</label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={formLink}
                readOnly
                className="block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm text-sm"
              />
              <button
                type="button"
                onClick={copyFormLink}
                className="inline-flex items-center p-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Adding...' : 'Add Client'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export const Dashboard = () => {
  const navigate = useNavigate();
  const { signOut } = useClerk();
  const { user } = useUser();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchClients();
    }
  }, [user?.id]);

  const fetchClients = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching clients:', error);
        return;
      }

      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewClient = () => {
    setIsModalOpen(true);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleAddClient = async (clientData: { name: string; phone: string; email: string }) => {
    if (!user?.id) {
      toast.error('Authentication error. Please try logging in again.');
      return;
    }

    try {
      // Create the client object
      const newClient = {
        name: clientData.name,
        phone: clientData.phone,
        email: clientData.email,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('Attempting to insert client:', newClient);

      // Insert the new client
      const { data, error } = await supabase
        .from('clients')
        .insert([newClient])
        .select()
        .single();

      if (error) {
        console.error('Insert error:', error);
        throw error;
      }

      if (data) {
        console.log('Successfully inserted client:', data);
        setClients(prevClients => [data, ...prevClients]);
        setIsModalOpen(false);
        toast.success('Client added successfully!');
      }

    } catch (error: any) {
      console.error('Error adding client:', error);
      let errorMessage = 'Failed to add client. ';
      
      if (error.code === '42501') {
        errorMessage += 'Permission denied. Please check database permissions.';
      } else if (error.code === '23505') {
        errorMessage += 'A client with this information already exists.';
      } else if (error.message) {
        errorMessage += error.message;
      }
      
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Brand Logo */}
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">Investo</h1>
            </div>

            {/* User Info & Sign Out */}
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <span className="text-gray-500">Welcome,</span>{' '}
                <span className="font-medium text-gray-900">{user?.firstName || 'User'}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center px-3 py-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <LogOut className="h-5 w-5 mr-1" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Clients</p>
                <p className="text-2xl font-semibold text-gray-900">{clients.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Plans</p>
                <p className="text-2xl font-semibold text-gray-900">{clients.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center">
              <Settings className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Settings</p>
                <button className="text-sm text-blue-600 hover:text-blue-700">
                  Manage Account
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Client List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Your Clients</h2>
              <button
                onClick={handleNewClient}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-5 w-5 mr-2" />
                New Client
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading clients...</div>
          ) : clients.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500 mb-4">No clients yet. Start by adding a new client!</p>
              <button
                onClick={handleNewClient}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Your First Client
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {clients.map((client) => (
                <motion.div
                  key={client.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-6 hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                  onClick={() => navigate(`/client/${client.id}`)}
                >
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{client.name}</h3>
                    <p className="text-sm text-gray-500">{client.email}</p>
                    <p className="text-sm text-gray-500">{client.phone}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <AnimatePresence>
        {isModalOpen && (
          <NewClientModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleAddClient}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
