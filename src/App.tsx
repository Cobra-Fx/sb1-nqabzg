import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { Dashboard } from './components/Dashboard';
import { Transaction } from './types';
import { BarChart3 } from 'lucide-react';

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Personal Finance Analyzer</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {transactions.length === 0 ? (
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Your Financial Dashboard</h2>
              <p className="text-gray-600">
                Upload your bank statement to get started with comprehensive financial analysis.
              </p>
            </div>
            <FileUpload onDataLoaded={setTransactions} />
          </div>
        ) : (
          <Dashboard transactions={transactions} />
        )}
      </main>
    </div>
  );
}

export default App;