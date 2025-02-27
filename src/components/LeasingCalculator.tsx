import React from 'react';
import { useTranslations } from '../hooks/useTranslations';

export const LeasingCalculator: React.FC = () => {
  const { t } = useTranslations();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <h2 className="text-xl font-semibold text-gray-800">{t.leasingCalculator}</h2>
      </div>
      <div className="text-center text-gray-600">
        Coming soon...
      </div>
    </div>
  );
}; 