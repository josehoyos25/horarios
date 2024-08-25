import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import Swal from "sweetalert2";

export default function App() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { data: session } = useSession(); // Accede a la sesión
  const [fechaInicio, setFechaInicio] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [dia, setDia] = useState("");
  const [cantidadHoras, setCantidadHoras] = useState("");
  const [instructor, setInstructor] = useState("");
  const [ficha, setFicha] = useState("");
  const [ambiente, setAmbiente] = useState("");
  const [instructores, setInstructores] = useState([]);
  const [fichas, setFichas] = useState([]);
  const [ambientes, setAmbientes] = useState([]);
  const [horarios, setHorarios] = useState([]); // Lista de horarios existentes

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [instructorRes, fichaRes, ambienteRes, horarioRes] = await Promise.all([
          fetch("http://localhost:3000/api/vinculacion/vinculacionreghorario"),
          fetch("http://localhost:3000/api/fichas"),
          fetch("http://localhost:3000/api/ambientes"),
          fetch("http://localhost:3000/api/horarios"), // Cargar horarios existentes
        ]);
        const instructorData = await instructorRes.json();
        const fichaData = await fichaRes.json();
        const ambienteData = await ambienteRes.json();
        const horarioData = await horarioRes.json();

        // Utiliza los datos con nombres de instructores
        setInstructores(instructorData.data);
        setFichas(fichaData.data);
        setAmbientes(ambienteData.data);
        setHorarios(horarioData.data); // Guardar horarios existentes
      } catch (error) {
        console.error("Error al cargar los datos", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async () => {
    const rol = session?.user?.role; // Obtén el rol del usuario desde la sesión

    // Define la hora preestablecida
    const horaPredefinida = "09:00:00"; // Puedes cambiar esto a la hora que prefieras

    // Construye las fechas con la hora predefinida
    const fechaInicioISO = new Date(`${fechaInicio}T${horaPredefinida}`).toISOString();
    const fechaFinISO = new Date(`${fechaFin}T${horaPredefinida}`).toISOString();

    // Verificar si el ambiente ya está ocupado en el rango de fechas especificado
    const ambienteOcupado = horarios.find(
      (horario) =>
        horario.ambiente === parseInt(ambiente) &&
        new Date(horario.fecha_inicio) <= new Date(fechaFinISO) &&
        new Date(horario.fecha_fin) >= new Date(fechaInicioISO)
    );

    if (ambienteOcupado) {
      Swal.fire({
        title: "Ambiente ocupado",
        text: "El ambiente ya está en uso en el rango de fechas y horas especificado.",
        icon: "error",
      });
      return; // Salir sin registrar el nuevo horario
    }
    // Verificar si ya existe un horario con el mismo instructor y ambiente en las fechas
    const horarioExistente = horarios.find(
      (horario) =>
        horario.instructor === parseInt(instructor) &&
        horario.ambiente === parseInt(ambiente) &&
        new Date(horario.fecha_inicio) <= new Date(fechaFinISO) &&
        new Date(horario.fecha_fin) >= new Date(fechaInicioISO)
    );

    if (horarioExistente) {
      Swal.fire({
        title: "Horario duplicado",
        text: "Ya existe un horario con este instructor y ambiente en el rango de fechas especificado.",
        icon: "error",
      });
      return; // Salir sin registrar el nuevo horario
    }

    const data = {
      fecha_inicio: fechaInicioISO,
      hora_inicio: horaInicio,
      fecha_fin: fechaFinISO,
      hora_fin: horaFin,
      dia: dia,
      cantidad_horas: parseInt(cantidadHoras, 10),
      instructor: parseInt(instructor, 10), // Se usa id_vinculacion
      ficha: parseInt(ficha, 10),
      ambiente: parseInt(ambiente, 10),
      estado: rol === "Coordinador" ? "aprobado" : "solicitud", // Ajusta el estado según el rol
    };

    try {
      const response = await fetch("http://localhost:3000/api/horarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        Swal.fire({
          title: "Horario creado con éxito",
          icon: "success",
        });
        window.location.reload(); // Recargar la página
      } else {
        const errorData = await response.json(); // Lee la respuesta JSON de error
        console.log("Error al crear el horario:", errorData); // Log para depuración

        Swal.fire({
          title: "Error al crear el horario",
          text: errorData.message, // Muestra el mensaje de error si existe
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error de conexión o de otro tipo:", error);
      Swal.fire({
        title: "Error al conectar con el servidor",
        text: error.message, // Muestra el mensaje de error
        icon: "error",
      });
    }
  };

  return (
    <>
      <Button onPress={onOpen} className="bg-green-600 text-white">
        Nuevo Horario
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Nuevo Horario
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Fecha Inicio"
                  type="date" // Cambiado a "date" para solo ingresar la fecha
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                />
                <Input
                  label="Hora Inicio"
                  type="time"
                  value={horaInicio}
                  onChange={(e) => setHoraInicio(e.target.value)}
                />
                <Input
                  label="Fecha Fin"
                  type="date" // Cambiado a "date" para solo ingresar la fecha
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                />
                <Input
                  label="Hora Fin"
                  type="time"
                  value={horaFin}
                  onChange={(e) => setHoraFin(e.target.value)}
                />
                <Select
                  label="Día"
                  value={dia}
                  onChange={(e) => setDia(e.target.value)}
                >
                  <SelectItem key="lunes" value="lunes">
                    Lunes
                  </SelectItem>
                  <SelectItem key="martes" value="martes">
                    Martes
                  </SelectItem>
                  <SelectItem key="miercoles" value="miercoles">
                    Miércoles
                  </SelectItem>
                  <SelectItem key="jueves" value="jueves">
                    Jueves
                  </SelectItem>
                  <SelectItem key="viernes" value="viernes">
                    Viernes
                  </SelectItem>
                  <SelectItem key="sabado" value="sabado">
                    Sábado
                  </SelectItem>
                  <SelectItem key="domingo" value="domingo">
                    Domingo
                  </SelectItem>
                </Select>
                <Input
                  label="Cantidad de Horas"
                  type="number"
                  value={cantidadHoras}
                  onChange={(e) => setCantidadHoras(e.target.value)}
                />
                <Select
                  label="Instructor"
                  value={instructor}
                  onChange={(e) => setInstructor(e.target.value)}
                >
                  {instructores.map((inst) => (
                    <SelectItem
                      key={inst.id_vinculacion}
                      value={inst.id_vinculacion}
                      textValue={inst.nombre}
                    >
                      {inst.nombre}
                    </SelectItem>
                  ))}
                </Select>

                <Select
                  label="Ficha"
                  value={ficha}
                  onChange={(e) => setFicha(e.target.value)}
                >
                  {fichas.map((ficha) => (
                    <SelectItem
                      key={ficha.codigo}
                      value={ficha.codigo}
                      textValue={ficha.codigo}
                    >
                      {ficha.codigo}
                    </SelectItem>
                  ))}
                </Select>
                <Select
                  label="Ambiente"
                  value={ambiente}
                  onChange={(e) => setAmbiente(e.target.value)}
                >
                  {ambientes.map((ambiente) => (
                    <SelectItem
                      key={ambiente.id_ambiente}
                      value={ambiente.id_ambiente}
                      textValue={ambiente.nombre_amb}
                    >
                      {ambiente.nombre_amb}
                    </SelectItem>
                  ))}
                </Select>
              </ModalBody>
              <ModalFooter>
                <Button onPress={handleSubmit} className="bg-green-600 text-white">
                  Guardar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
