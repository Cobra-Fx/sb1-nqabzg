import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';
import Papa from 'papaparse';
import { Transaction } from '../types';

interface Props {
  onDataLoaded: (data: Transaction[]) => void;
}

export function FileUpload({ onDataLoaded }: Props) {
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      complete: (results) => {
        const transactions: Transaction[] = results.data
          .slice(1) // Skip header row
          .map((row: any) => ({
            date: new Date(row[0]),
            description: row[1],
            amount: parseFloat(row[2]),
            category: row[3] || 'Uncategorized',
            type: parseFloat(row[2]) >= 0 ? 'income' : 'expense'
          }))
          .filter((t: Transaction) => !isNaN(t.amount));
        
        onDataLoaded(transactions);
      },
      header: false
    });
  }, [onDataLoaded]);

  return (
    <div className="w-full">
      <label className="flex flex-col items-center px-4 py-6 bg-white rounded-lg shadow-lg cursor-pointer hover:bg-gray-50 transition-colors">
        <Upload className="w-12 h-12 text-blue-500 mb-2" />
        <span className="text-lg font-medium text-gray-700">Upload Bank Statement</span>
        <span className="text-sm text-gray-500 mt-1">CSV format only</span>
        <input
          type="file"
          className="hidden"
          accept=".csv"
          onChange={handleFileUpload}
        />
      </label>
    </div>
  );
}