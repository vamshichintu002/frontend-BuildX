export interface ClientAnalytics {
  client_profile: {
    financial_goals: string[];
    initial_investment: number;
    investment_timeline: string;
    risk_tolerance: string;
  };
  financial_situation: {
    initial_investment: number;
    investment_category: string;
    liquidity_needs: string;
  };
  investment_objectives: {
    primary_goals: string[];
    constraints: string[];
    target_return: string;
  };
  investment_strategy: {
    asset_allocation: {
      equity: string;
      debt: string;
      gold: string;
      real_estate: string;
    };
    investment_vehicles: {
      direct_stocks: string;
      fixed_income_instruments: string;
      mutual_funds: {
        equity_funds: string;
        debt_funds: string;
        hybrid_funds: string;
      };
      real_estate_investments: string;
    };
    tax_planning_strategy: string;
  };
  risk_profile: {
    investment_horizon: string;
    risk_capacity: string;
    tolerance_level: string;
  };
  portfolio_data: Record<string, number>;
  portfolio_recommendation: {
    portfolio: {
      Corporate_FDs: string;
      Gold_ETFs: string;
      Government_Bonds: string;
      Large_Cap_Stocks: string;
      Mid_Cap_Stocks: string;
      Mutual_Funds: string;
      Small_Cap_Stocks: string;
    };
    strategy: string;
    visualization_path: string;
  };
  mutual_funds_analysis: {
    equity_funds: Array<{
      fund_name: string;
      category: string;
      recommendation: string;
      '1yr_returns': string;
      '3yr_returns': string;
      risk_rating: string;
    }>;
    debt_funds: Array<{
      fund_name: string;
      category: string;
      recommendation: string;
      '1yr_returns': string;
      '3yr_returns': string;
      risk_rating: string;
    }>;
  };
  bonds_analysis: {
    government_bonds: Array<{
      bond_name: string;
      yield: string;
      maturity: string;
      recommendation: string;
      risk_rating: string;
    }>;
    corporate_bonds: Array<{
      bond_name: string;
      yield: string;
      maturity: string;
      recommendation: string;
      risk_rating: string;
    }>;
  };
  fixed_deposits_analysis: {
    Fixed_Deposits: Array<{
      bank_name: string;
      duration: string;
      interest_rate: string;
      recommendation: string;
      special_benefits: string;
    }>;
  };
}
