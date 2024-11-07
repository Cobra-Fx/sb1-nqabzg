import React from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Transaction, CategorySummary, MonthlyAnalysis } from '../types';
import { format } from 'date-fns';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

interface Props {
  transactions: Transaction[];
}

export function Dashboard({ transactions }: Props) {
  const monthlyData = React.useMemo(() => {
    const months: { [key: string]: MonthlyAnalysis } = {};
    
    transactions.forEach(t => {
      const monthKey = format(t.date, 'MMM yyyy');
      if (!months[monthKey]) {
        months[monthKey] = { month: monthKey, income: 0, expenses: 0, savings: 0 };
      }
      
      if (t.type === 'income') {
        months[monthKey].income += t.amount;
      } else {
        months[monthKey].expenses += Math.abs(t.amount);
      }
      months[monthKey].savings = months[monthKey].income - months[monthKey].expenses;
    });

    return Object.values(months);
  }, [transactions]);

  const categoryAnalysis = React.useMemo(() => {
    const categories: { [key: string]: number } = {};
    const expenseTotal = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categories[t.category] = (categories[t.category] || 0) + Math.abs(t.amount);
      });

    return Object.entries(categories).map(([category, total]) => ({
      category,
      total,
      percentage: (total / expenseTotal) * 100
    }));
  }, [transactions]);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const netSavings = totalIncome - totalExpenses;

  return (
    <div className="w-full space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Income</p>
              <p className="text-2xl font-bold text-green-600">${totalIncome.toFixed(2)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600">${totalExpenses.toFixed(2)}</p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Savings</p>
              <p className="text-2xl font-bold text-blue-600">${netSavings.toFixed(2)}</p>
            </div>
            <Wallet className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Monthly Overview</h3>
          <Line
            data={{
              labels: monthlyData.map(d => d.month),
              datasets: [
                {
                  label: 'Income',
                  data: monthlyData.map(d => d.income),
                  borderColor: 'rgb(34, 197, 94)',
                  tension: 0.1
                },
                {
                  label: 'Expenses',
                  data: monthlyData.map(d => d.expenses),
                  borderColor: 'rgb(239, 68, 68)',
                  tension: 0.1
                },
                {
                  label: 'Savings',
                  data: monthlyData.map(d => d.savings),
                  borderColor: 'rgb(59, 130, 246)',
                  tension: 0.1
                }
              ]
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'bottom'
                }
              }
            }}
          />
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Expense Categories</h3>
          <Doughnut
            data={{
              labels: categoryAnalysis.map(c => c.category),
              datasets: [{
                data: categoryAnalysis.map(c => c.total),
                backgroundColor: [
                  '#60A5FA', '#34D399', '#F87171', '#FBBF24', '#A78BFA',
                  '#F472B6', '#2DD4BF', '#FB923C', '#4ADE80', '#E879F9'
                ]
              }]
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'bottom'
                }
              }
            }}
          />
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Category Breakdown</h3>
        <div className="space-y-4">
          {categoryAnalysis.map(category => (
            <div key={category.category} className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">{category.category}</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">${category.total.toFixed(2)}</p>
                <p className="text-xs text-gray-500">{category.percentage.toFixed(1)}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}