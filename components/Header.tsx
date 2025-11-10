
import React from 'react';
import { ClockIcon } from './icons/ClockIcon';

const Header: React.FC = () => {
  return (
    <header className="bg-surface shadow-md">
      <div className="container mx-auto p-4 flex items-center gap-3">
        <ClockIcon className="w-8 h-8 text-primary" />
        <h1 className="text-xl font-bold text-on-surface">Friendly Cron Manager</h1>
      </div>
    </header>
  );
};

export default Header;
