import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '../utils/supabase';
import { ClientAnalytics } from '../types/analytics';
import {
  PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from 'recharts';
import { Clock, Target, TrendingUp, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// Update the component definition to accept props
interface AnalyticsProps {
  clientId: string;
  onClose: () => void;
}

const StatCard = ({ title, value, icon: Icon, prefix = '', suffix = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-lg shadow-lg p-6"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold mt-2">
          {prefix}
          <CountUp end={value} separator="," duration={2} />
          {suffix}
        </h3>
      </div>
      <div className="p-3 bg-blue-100 rounded-full">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
    </div>
  </motion.div>
);

export const Analytics: React.FC<AnalyticsProps> = ({ clientId, onClose }) => {
  const { user } = useUser();
  const [analyticsData, setAnalyticsData] = useState<ClientAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [portfolioDetails, setPortfolioDetails] = useState<any>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user) {
        console.log('No user found');
        setError('No user authenticated');
        setLoading(false);
        return;
      }

      if (!clientId) {
        console.log('No clientId provided');
        setError('No client ID provided');
        setLoading(false);
        return;
      }

      try {
        console.log('Starting data fetch for:', {
          clientId,
          userId: user.id
        });

        const { data: formData, error: formError } = await supabase
          .from('client_forms')
          .select('*')
          .eq('client_id', clientId)
          .single();

        if (formError) {
          throw formError;
        }

        if (!formData) {
          throw new Error('No form data found');
        }

        // Calculate analytics data
        const totalIncome = (
          formData.monthly_salary +
          formData.monthly_side_income +
          formData.monthly_other_income
        ) / 100; // Convert from paise to rupees

        const totalExpenses = (
          formData.monthly_bills +
          formData.monthly_daily_life +
          formData.monthly_entertainment
        ) / 100;

        const monthlySavings = formData.monthly_savings / 100;
        const emergencyCash = formData.emergency_cash / 100;

        const expenseBreakdown = [
          { name: 'Bills', value: formData.monthly_bills / 100 },
          { name: 'Daily Life', value: formData.monthly_daily_life / 100 },
          { name: 'Entertainment', value: formData.monthly_entertainment / 100 }
        ];

        const incomeBreakdown = [
          { name: 'Salary', value: formData.monthly_salary / 100 },
          { name: 'Side Income', value: formData.monthly_side_income / 100 },
          { name: 'Other Income', value: formData.monthly_other_income / 100 }
        ];

        setAnalyticsData({
          totalIncome,
          totalExpenses,
          monthlySavings,
          emergencyCash,
          expenseBreakdown,
          incomeBreakdown,
          riskTolerance: formData.risk_tolerance,
          age: formData.age
        });

      } catch (err: any) {
        console.error('Error fetching analytics:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user, clientId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-full max-w-md">
          <div className="animate-pulse bg-gray-200 h-2 rounded-full mb-4"></div>
          <div className="animate-pulse bg-gray-200 h-2 rounded-full w-3/4"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-100 rounded-lg">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="p-4 text-gray-600">
        <p>No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Monthly Income"
          value={analyticsData.totalIncome}
          icon={DollarSign}
          prefix="₹"
        />
        <StatCard
          title="Total Monthly Expenses"
          value={analyticsData.totalExpenses}
          icon={Clock}
          prefix="₹"
        />
        <StatCard
          title="Monthly Savings"
          value={analyticsData.monthlySavings}
          icon={Target}
          prefix="₹"
        />
        <StatCard
          title="Emergency Fund"
          value={analyticsData.emergencyCash}
          icon={TrendingUp}
          prefix="₹"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Expense Breakdown</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analyticsData.expenseBreakdown}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {analyticsData.expenseBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Income Sources</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.incomeBreakdown}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `₹${value}`} />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Financial Profile</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Risk Tolerance</p>
            <p className="text-lg font-medium capitalize">{analyticsData.riskTolerance}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Age</p>
            <p className="text-lg font-medium">{analyticsData.age} years</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Savings Rate</p>
            <p className="text-lg font-medium">
              {((analyticsData.monthlySavings / analyticsData.totalIncome) * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
