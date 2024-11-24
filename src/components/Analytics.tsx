import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '../utils/supabase';
import { ClientAnalytics } from '../types/analytics';
import {
  PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from 'recharts';
import { Card, CardContent, Typography, Grid, Box, LinearProgress } from '@mui/material';
import { Clock, Target, TrendingUp, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const MotionCard = motion(Card);

// Update the component definition to accept props
interface AnalyticsProps {
  clientId: string;
  onClose: () => void;
}

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

        const { data, error } = await supabase
          .from('unified_table')
          .select('*')
          .eq('client_id', clientId)
          .limit(1);

        console.log('Supabase response:', { data, error });

        if (error) {
          console.error('Supabase error:', error);
          setError(error.message);
          setLoading(false);
          return;
        }

        if (!data || data.length === 0) {
          console.log('No data found for client:', clientId);
          setError('No data found for this client');
          setLoading(false);
          return;
        }

        const rowData = data[0];
        console.log('Row data:', rowData);

        try {
          const parsedData: ClientAnalytics = {
            client_profile: JSON.parse(rowData.client_profile || '{}'),
            financial_situation: JSON.parse(rowData.financial_situation || '{}'),
            investment_objectives: JSON.parse(rowData.investment_objectives || '{}'),
            investment_strategy: JSON.parse(rowData.investment_strategy || '{}'),
            risk_profile: JSON.parse(rowData.risk_profile || '{}'),
            portfolio_data: JSON.parse(rowData.portfolio_data || '{}'),
            portfolio_recommendation: JSON.parse(rowData.portfolio_recommendation || '{}'),
            mutual_funds_analysis: JSON.parse(rowData.mutual_funds_analysis || '{}'),
            bonds_analysis: JSON.parse(rowData.bonds_analysis || '{}'),
            fixed_deposits_analysis: JSON.parse(rowData.fixed_deposits_analysis || '{}'),
          };

          console.log('Successfully parsed data:', parsedData);
          setAnalyticsData(parsedData);
          setError(null);
        } catch (parseError) {
          console.error('Error parsing JSON data:', parseError);
          setError('Error parsing data from database');
        }
      } catch (error: any) {
        console.error('Error in fetchAnalytics:', error);
        setError(error.message || 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user, clientId]);

  const handlePortfolioClick = async () => {
    if (!clientId) {
      console.log('No clientId provided');
      setError('No client ID provided');
      return;
    }

    console.log('Fetching portfolio details for client_id:', clientId);

    try {
      const { data, error } = await supabase
        .from('unified_table')
        .select('*')
        .eq('client_id', clientId);

      console.log('Supabase response for portfolio details:', { data, error });

      if (error) {
        console.error('Error fetching portfolio details:', error);
        setError(error.message);
        return;
      }

      if (data && data.length > 0) {
        console.log('Portfolio details:', data[0]);
        setPortfolioDetails(data[0]);
      } else {
        console.log('No portfolio details found for client:', clientId);
        setPortfolioDetails(null);
      }
    } catch (error: any) {
      console.error('Error in handlePortfolioClick:', error);
      setError(error.message || 'An unknown error occurred');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          ></motion.div>
          <p className="text-gray-600">Loading analytics data...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        className="flex items-center justify-center min-h-screen"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center text-red-600">
          <p className="text-xl mb-2">Error</p>
          <p>{error}</p>
        </div>
      </motion.div>
    );
  }

  if (!analyticsData) {
    return (
      <motion.div 
        className="flex items-center justify-center min-h-screen"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center text-gray-600">
          <p>No analytics data available for this client</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-gray-50 p-6 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.button
        className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        onClick={onClose}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg
          className="w-6 h-6 text-gray-600"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </motion.button>

      {/* Header Section */}
      <motion.div 
        className="mb-8"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Indian Investment Portfolio Analysis
        </h1>
        <p className="text-sm text-gray-600">
          Client Profile: Moderate Risk | {analyticsData?.investment_objectives?.investment_timeline} | 
          ₹{analyticsData?.financial_situation?.initial_investment?.toLocaleString()} Initial Investment
        </p>
      </motion.div>

      {/* Key Metrics Grid */}
      <Grid container spacing={3} className="mb-8">
        {[
          { icon: TrendingUp, title: 'Risk Profile', value: analyticsData?.risk_profile?.tolerance_level || 'Moderate', subtext: 'Balanced risk-return approach', color: 'blue' },
          { icon: Target, title: 'Target Return', value: analyticsData?.investment_objectives?.target_return || '8-10%', subtext: 'Annual expected return', color: 'green' },
          { icon: Clock, title: 'Timeline', value: analyticsData?.investment_objectives?.investment_timeline || '10 Years', subtext: 'Investment horizon', color: 'purple' },
          { icon: DollarSign, title: 'Initial Investment', value: `₹${analyticsData?.financial_situation?.initial_investment?.toLocaleString() || '10,00,000'}`, subtext: 'Starting capital', color: 'yellow' },
        ].map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <MotionCard 
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <CardContent className="p-4">
                <div className="flex items-center mb-2">
                  <item.icon className={`h-5 w-5 text-${item.color}-500 mr-2`} />
                  <Typography variant="subtitle2" color="textSecondary">
                    {item.title}
                  </Typography>
                </div>
                <Typography variant="h6" className="mb-1">
                  <CountUp end={parseFloat(item.value)} duration={2} separator="," decimals={item.title === 'Target Return' ? 1 : 0} suffix={item.title === 'Target Return' ? '%' : ''} />
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {item.subtext}
                </Typography>
              </CardContent>
            </MotionCard>
          </Grid>
        ))}
      </Grid>

      {/* Portfolio Allocation and Stock Recommendations */}
      <Grid container spacing={3} className="mb-8">
        <Grid item xs={12} md={6}>
          <MotionCard 
            className="bg-white rounded-lg shadow-sm h-full"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            onClick={handlePortfolioClick}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Portfolio Allocation
              </Typography>
              <div className="space-y-4">
                {Object.entries(analyticsData?.investment_strategy?.asset_allocation || {}).map(([name, value], index) => (
                  <motion.div 
                    key={name}
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <div className="flex justify-between mb-1">
                      <Typography variant="body2">{name}</Typography>
                      <Typography variant="body2">{value}</Typography>
                    </div>
                    <LinearProgress 
                      variant="determinate" 
                      value={parseInt(value as string)} 
                      className="h-2 rounded-full"
                      sx={{ 
                        backgroundColor: '#E5E7EB',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: COLORS[index % COLORS.length]
                        }
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </MotionCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <MotionCard 
            className="bg-white rounded-lg shadow-sm h-full"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Stock Recommendations
              </Typography>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="text-left text-sm font-medium text-gray-500">Stock</th>
                      <th className="text-left text-sm font-medium text-gray-500">Action</th>
                      <th className="text-left text-sm font-medium text-gray-500">Target</th>
                      <th className="text-left text-sm font-medium text-gray-500">Horizon</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {analyticsData?.portfolio_recommendation?.recommendations?.map((stock, index) => (
                      <motion.tr 
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <td className="py-2 text-sm">{stock.name}</td>
                        <td className="py-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            stock.action === 'BUY' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {stock.action}
                          </span>
                        </td>
                        <td className="py-2 text-sm">₹{stock.target}</td>
                        <td className="py-2 text-sm text-gray-500">{stock.horizon}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </MotionCard>
        </Grid>
      </Grid>

      {/* Risk Factors */}
      <MotionCard 
        className="bg-white rounded-lg shadow-sm mb-8"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <CardContent>
          <div className="flex items-center mb-4">
            <svg className="h-5 w-5 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <Typography variant="h6">Risk Factors</Typography>
          </div>
          <Grid container spacing={4}>
            {[
              { title: 'Market Risks', items: ['Rising inflation', 'Interest rate hikes', 'Market volatility'] },
              { title: 'Regulatory Risks', items: ['Changes in corporate tax rates', 'Sector-specific regulations', 'Policy changes'] },
              { title: 'Company Risks', items: ['Competition', 'Management changes', 'Operational challenges'] },
            ].map((riskCategory, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <Typography variant="subtitle1" className="mb-2 font-medium">{riskCategory.title}</Typography>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    {riskCategory.items.map((item, itemIndex) => (
                      <motion.li 
                        key={itemIndex}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (index * 0.2) + (itemIndex * 0.1) }}
                      >
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </MotionCard>

      {/* Display Portfolio Details if Available */}
      {portfolioDetails && (
        <MotionCard 
          className="bg-white rounded-lg shadow-sm mb-8"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Portfolio Details
            </Typography>
            <pre className="text-sm text-gray-600">
              {JSON.stringify(portfolioDetails, null, 2)}
            </pre>
          </CardContent>
        </MotionCard>
      )}
    </motion.div>
  );
};

export default Analytics;

