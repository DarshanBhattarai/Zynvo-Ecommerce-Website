import React from 'react';
import { Users, Crown, Shield, User, Activity } from 'lucide-react';

const StatWidgets = ({ stats }) => {
  const getStatIcon = (index) => {
    const icons = [
      <Users size={20} className="text-indigo-600" />,
      <Crown size={20} className="text-indigo-600" />,
      <Shield size={20} className="text-blue-500" />,
      <User size={20} className="text-gray-500" />,
    ];
    return icons[index] || <Activity size={20} className="text-gray-600" />;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                {stat.label}
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-gray-900">
                  {stat.value}
                </p>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${
                    stat.trend === "up"
                      ? "text-green-600 bg-green-100"
                      : "text-gray-600 bg-gray-100"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center">
              {getStatIcon(index)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatWidgets;