import React from 'react';
import { Navbar } from './components/organisms/Navbar';
import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="h-[calc(100vh-7rem)] flex justify-center items-center bg-gradient-to-r from-gray-700 to-gray-300">
        <div className="text-center max-w-2xl px-4">
          <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Bienvenido al Sistema de Horarios de la sede Yamboró
          </h1>
          <p className="text-white text-lg sm:text-xl mb-8 leading-relaxed">
            Solución en la asignación de Ambientes de Formación
          </p>
          <Link href="/auth/login">
            <button className="bg-gray-800 text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:bg-gray-700 transition duration-300">
              Iniciar sesión
            </button>
          </Link>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-gray-800 py-8">
        <div className="container mx-auto text-center text-white px-4">
          <p className="text-sm md:text-base">&copy; {new Date().getFullYear()} ADSO - 2644590</p>
        </div>
      </footer>
    </>
  );
}
