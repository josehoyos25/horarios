import React, { useState } from 'react';
import Link from 'next/link';
import { signOut, useSession } from "next-auth/react";
import { Button } from '../atoms/buttonCerrarSesion';
import { HiOutlineHome, HiOutlineUserAdd, HiOutlineOfficeBuilding, HiOutlineClock, HiOutlineDocumentText, HiOutlineLink, HiOutlineChevronLeft, HiOutlineChevronRight, HiOutlineUserCircle, HiOutlineSun, HiOutlineMoon } from 'react-icons/hi';
import { FiPower } from 'react-icons/fi';
import Swal from 'sweetalert2';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const { data: session } = useSession();

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const toggleTheme = () => setDarkMode(!darkMode);

  const role = session?.user?.role;
  const userName = session?.user?.name || "Usuario solicitado";

  const handleSignOut = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Tu sesión será cerrada.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        signOut();
      }
    });
  };

  return (
    <aside className={`h-screen flex flex-col ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} shadow-lg transition-all ${isCollapsed ? 'w-20' : 'w-72'}`}>
      {/* Botón de colapso/desplegado */}
      <div className="flex justify-end p-2">
        <button 
          onClick={toggleSidebar} 
          className={`flex items-center justify-center w-10 h-10 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} text-white transition-colors ${isCollapsed ? 'ml-auto' : 'mr-2'}`}
        >
          {isCollapsed ? <HiOutlineChevronRight /> : <HiOutlineChevronLeft />}
        </button>
      </div>

      {/* Contenedor para el logo con borde verde o blanco */}
      <div className={`p-2 transition-all flex items-center justify-center ${isCollapsed ? 'w-20 h-20' : 'w-72 h-48'}`}>
        <img 
          src="/logo2.png" 
          alt="Logo" 
          className={`logo transition-all ${isCollapsed ? 'w-16 h-auto' : 'w-3/4 h-auto'} ${darkMode ? 'dark-mode-logo' : ''}`} 
        />
      </div>

      {/* Mostrar el nombre del usuario con ícono */}
      {!isCollapsed && (
        <div className="text-center my-4 flex items-center justify-center">
          <HiOutlineUserCircle className="text-3xl text-gray-300 mr-2" />
          <div>
            <p className="text-lg font-semibold">{userName}</p>
            <p className="text-sm">{role ? role : "Usuario autorizado"}</p>
          </div>
        </div>
      )}

      <nav className='flex-1'>
        <ul className='flex flex-col'>
          {/* Enlace a Dashboard */}
          <li className="my-2">
            <Link href="/components/templates/dashboard" className={`block py-2 px-4 ${darkMode ? 'text-white hover:bg-green-600' : 'text-black hover:bg-green-200'} rounded-md transition-colors flex items-center mx-2 ${isCollapsed ? 'justify-center' : ''}`}>
              <HiOutlineHome className='mr-2 text-2xl' /> {!isCollapsed && 'Dashboard'}
            </Link>
          </li>

          {/* Enlaces específicos para Coordinador */}
          {(role === 'Coordinador') && (
            <>
              <li className="my-2">
                <Link href="/components/templates/personas" className={`block py-2 px-4 ${darkMode ? 'text-white hover:bg-green-600' : 'text-black hover:bg-green-200'} rounded-md transition-colors flex items-center mx-2 ${isCollapsed ? 'justify-center' : ''}`}>
                  <HiOutlineUserAdd className='mr-2 text-2xl' /> {!isCollapsed && 'Personas'}
                </Link>
              </li>
              <li className="my-2">
                <Link href="/components/templates/ambientes" className={`block py-2 px-4 ${darkMode ? 'text-white hover:bg-green-600' : 'text-black hover:bg-green-200'} rounded-md transition-colors flex items-center mx-2 ${isCollapsed ? 'justify-center' : ''}`}>
                  <HiOutlineOfficeBuilding className='mr-2 text-2xl' /> {!isCollapsed && 'Ambientes'}
                </Link>
              </li>
              <li className="my-2">
                <Link href="/components/templates/fichas" className={`block py-2 px-4 ${darkMode ? 'text-white hover:bg-green-600' : 'text-black hover:bg-green-200'} rounded-md transition-colors flex items-center mx-2 ${isCollapsed ? 'justify-center' : ''}`}>
                  <HiOutlineDocumentText className='mr-2 text-2xl' /> {!isCollapsed && 'Fichas'}
                </Link>
              </li>
              <li className="my-2">
                <Link href="/components/templates/vinculacion" className={`block py-2 px-4 ${darkMode ? 'text-white hover:bg-green-600' : 'text-black hover:bg-green-200'} rounded-md transition-colors flex items-center mx-2 ${isCollapsed ? 'justify-center' : ''}`}>
                  <HiOutlineLink className='mr-2 text-2xl' /> {!isCollapsed && 'Vinculacion'}
                </Link>
              </li>
              <li className="my-2">
                <Link href="/components/templates/horario" className={`block py-2 px-4 ${darkMode ? 'text-white hover:bg-green-600' : 'text-black hover:bg-green-200'} rounded-md transition-colors flex items-center mx-2 ${isCollapsed ? 'justify-center' : ''}`}>
                  <HiOutlineClock className='mr-2 text-2xl' /> {!isCollapsed && 'Horario'}
                </Link>
              </li>
            </>
          )}
          {/* Enlaces específicos para Líder */}
          {(role === 'Lider') && (
            <>
              <li className="my-2">
                <Link href="/components/templates/horario" className={`block py-2 px-4 ${darkMode ? 'text-white hover:bg-green-600' : 'text-black hover:bg-green-200'} rounded-md transition-colors flex items-center mx-2 ${isCollapsed ? 'justify-center' : ''}`}>
                  <HiOutlineClock className='mr-2 text-2xl' /> {!isCollapsed && 'Horario'}
                </Link>
              </li>
            </>
          )}

          {/* Enlaces específicos para Instructor */}
          {role === 'Instructor' && (
            <li className="my-2">
              <Link href="/components/templates/horario" className={`block py-2 px-4 ${darkMode ? 'text-white hover:bg-green-600' : 'text-black hover:bg-green-200'} rounded-md transition-colors flex items-center mx-2 ${isCollapsed ? 'justify-center' : ''}`}>
                <HiOutlineClock className='mr-2 text-2xl' /> {!isCollapsed && 'Horario'}
              </Link>
            </li>
          )}
        </ul>
      </nav>
      
      <div className="p-4 flex flex-col items-center">
        {/* Botón para alternar entre modo oscuro y claro */}
        <button 
          onClick={toggleTheme} 
          className={`flex items-center justify-center w-10 h-10 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors mb-4`}
        >
          {darkMode ? <HiOutlineSun className="w-6 h-6 text-yellow-400" /> : <HiOutlineMoon className="w-6 h-6 text-blue-500" />}
        </button>

        <Button 
          onClick={handleSignOut} 
          className={`w-full flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors ${isCollapsed ? 'justify-center' : 'justify-start'}`}
        >
          <FiPower className='w-6 h-6' />
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;