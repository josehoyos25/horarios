import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from 'bcrypt'

// Función para convertir BigInt a string en un objeto
function serializeBigInt(obj) {
  return JSON.parse(
    JSON.stringify(obj, (key, value) => (typeof value === 'bigint' ? value.toString() : value))
  );
}

export async function GET() {
  try {
    const personas = await prisma.personas.findMany();
    const serializedPersonas = serializeBigInt(personas);
    return NextResponse.json({ data: serializedPersonas }, { status: 200 });
  } catch (error) {
    return new NextResponse(error.message, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
      
    // Búsqueda de usuario si ya está registrada la identificación
    const iduserFound = await prisma.personas.findUnique({
      where: {
        identificacion: data.identificacion,
      }
    });
    if (iduserFound) {
      return NextResponse.json(
        { message: "Identificación de usuario ya registrada" }, 
        { status: 400 }
      );
    }
    
    // Búsqueda si el usuario ya está registrado con el correo
    const emailuserFound = await prisma.personas.findFirst({
      where: {
        correo: data.correo,
      }
    });
    if (emailuserFound) {
      return NextResponse.json(
        { message: "Correo de usuario ya registrado" }, 
        { status: 400 }
      );
    }
    
    // Encriptación de la contraseña
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Condicional para que el campo municipio sea null si no se proporciona
    const municipioData = data.municipio ? Number(data.municipio) : null;

    // Crear la nueva persona
    const persona = await prisma.personas.create({
      data: {
        identificacion: data.identificacion,
        nombres: data.nombres,
        correo: data.correo,
        telefono: data.telefono,
        password: hashedPassword,
        rol: data.rol,
        cargo: data.cargo,
        // Solo asignar municipio si no es null
        ...(municipioData && {
          municipio: municipioData,
        }),
      },
    });

    // Serializar el BigInt si existe
    const serializedPersona = serializeBigInt(persona);
    return new NextResponse(JSON.stringify(serializedPersona), {
      headers: { "Content-Type": "application/json" },
      status: 201,
    });
    
  } catch (error) {
    console.error('Error creando la persona:', error);
    return new NextResponse(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}


