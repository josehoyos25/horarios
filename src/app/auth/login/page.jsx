"use client"
import React from 'react';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const router = useRouter();
  const [error, setError] = useState(null);

  const onSubmit = handleSubmit(async data => {
    console.log(data);

    const res = await signIn('credentials', {
      email: data.correo,
      password: data.password,
      redirect: false
    });

    console.log(res);

    if (res.error) {
      setError(res.error);
    } else {
      router.push('/components/templates/dashboard'); // Cambia esta ruta a la correcta según tu estructura de rutas
    }
  });

  return (
    <div className='h-screen flex'>
      {/* Columna de Bienvenida */}
      <div className='flex-1 bg-gray-700 text-white flex justify-center items-center'>
        <div className='text-center p-12'>
          <h1 className='text-6xl font-extrabold mb-4 leading-tight'>Bienvenido</h1>
          <p className='text-xl font-medium'> Al Sistema de Gestión de Horarios</p>
        </div>
      </div>

      {/* Columna de Inicio de Sesión */}
      <div className='flex-1 flex justify-center items-center bg-gray-100'>
        <form onSubmit={onSubmit} className='w-full max-w-md p-8 bg-gradient-to-br from-gray-50 to-gray-200 shadow-lg rounded-lg'>
          {error && (
            <p className='bg-red-500 text-lg text-white p-3 rounded mb-4'>
              {error}
            </p>
          )}

          <h1 className='text-gray-900 font-bold text-3xl mb-6'>
            Inicio de Sesión
          </h1>
          
          <label htmlFor="correo" className='text-gray-700 mb-2 block text-sm'>
            Correo:
          </label>
          <input
            type="email"
            {...register("correo", {
              required: {
                value: true,
                message: 'Correo es requerido'
              }
            })}
            className='p-3 rounded border border-gray-300 bg-white text-gray-900 w-full mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500'
            placeholder='correo@gmail.com'
          />
          {errors.correo && (
            <span className='text-red-500 text-xs'>
              {errors.correo.message}
            </span>
          )}

          <label htmlFor="password" className='text-gray-700 mb-2 block text-sm'>
            Contraseña:
          </label>
          <input
            type="password"
            {...register("password", {
              required: {
                value: true,
                message: 'Contraseña requerida'
              }
            })}
            className='p-3 rounded border border-gray-300 bg-white text-gray-900 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500'
            placeholder='Ingrese su contraseña'
          />
          {errors.password && (
            <span className='text-red-500 text-xs'>
              {errors.password.message}
            </span>
          )}

          <button
            type="submit"
            className='w-full bg-gray-700 text-white p-3 rounded-lg font-semibold hover:bg-gray-600 transition duration-300 shadow-lg transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-300'
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}
