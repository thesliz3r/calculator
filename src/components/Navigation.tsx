import React from 'react';
import { Calculator, DollarSign, Clock, Car } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslations } from '../hooks/useTranslations';

export const Navigation: React.FC = () => {
  const { t } = useTranslations();
  const location = useLocation();

  const navItems = [
    {
      path: '/',
      icon: <Calculator className="w-5 h-5" />,
      label: t.vatCalculator,
    },
    {
      path: '/salary',
      icon: <DollarSign className="w-5 h-5" />,
      label: t.salaryCalculator,
    },
    {
      path: '/leasing',
      icon: <Car className="w-5 h-5" />,
      label: t.leasingCalculator,
    },
    {
      path: '/clock',
      icon: <Clock className="w-5 h-5" />,
      label: t.timeCalculator,
    },
  ];

  return (
    <nav className="bg-white shadow-lg rounded-xl mb-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between px-4">
          <div className="flex space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 hover:text-accent-primary
                  ${location.pathname === item.path 
                    ? 'border-accent-primary text-accent-primary' 
                    : 'border-transparent text-gray-600 hover:border-accent-secondary'
                  }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}; 