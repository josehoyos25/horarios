"use client";

import Sidebar from '../../organisms/Sidebar'; // Ajusta la ruta según la estructura de carpetas

export default function PageDashboard() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 h-[calc(100vh-7rem)] flex flex-col justify-center items-center p-6 bg-gray-50">
        <div className="max-w-4xl w-full">
          <h1 className="text-gray-800 text-5xl text-center font-bold mb-6 transition-colors">
            Bienvenido al Sistema de Gestión de Horarios de Yamboró
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            Este sistema te permitirá gestionar usuarios, roles y permisos de manera eficiente y sencilla. Desde este dashboard, podrás acceder a diferentes secciones para realizar un seguimiento y administración efectiva de las tareas.
          </p>
        </div>
      </main>
    </div>
  );
}
