import React from 'react';

export const Navbar = () => {
  return (
    <nav className="flex items-center justify-between bg-gray-700 text-white p-4 shadow-md">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold tracking-wide text-gray-100">
          Sistema de Horarios
        </h1>
        <span className="text-sm text-gray-400">Versión 1.0.0</span>
      </div>
      <div>
      </div>
    </nav>
  );
};
