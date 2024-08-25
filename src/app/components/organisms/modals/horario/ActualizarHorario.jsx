import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import Swal from 'sweetalert2';

const ModalActualizarHorario = ({ isOpen, onClose, horario }) => {
  const [formData, setFormData] = useState({
    fechaInicio: '',
    fechaFin: '',
    horaInicio: '',
    horaFin: '',
    ambiente: '',
    ficha: '',
  });

  const [fichas, setFichas] = useState([]);
  const [ambientes, setAmbientes] = useState([]);
  const [horariosExistentes, setHorariosExistentes] = useState([]);

  useEffect(() => {
    if (horario) {
      console.log("Horario recibido:", horario); // Verifica que `horario` tenga la propiedad correcta
      setFormData({
        fechaInicio: horario.fechaInicio || '',
        fechaFin: horario.fechaFin || '',
        horaInicio: horario.horaInicio || '',
        horaFin: horario.horaFin || '',
        ambiente: horario.ambiente || '',
        ficha: horario.ficha || '',
      });
    }
  }, [horario]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fichaRes, ambienteRes, horariosRes] = await Promise.all([
          fetch("http://localhost:3000/api/fichas"),
          fetch("http://localhost:3000/api/ambientes"),
          fetch("http://localhost:3000/api/horarios"), // Cargar horarios existentes
        ]);
        const fichaData = await fichaRes.json();
        const ambienteData = await ambienteRes.json();
        const horariosData = await horariosRes.json();

        setFichas(fichaData.data);
        setAmbientes(ambienteData.data);
        setHorariosExistentes(horariosData.data); // Guardar horarios existentes
      } catch (error) {
        console.error("Error al cargar los datos", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = async () => {
    if (!horario || !horario.id) {
      console.error("No se ha proporcionado un ID de horario para actualizar.");
      return;
    }

    // Validar que todos los campos estén completos
    const { fechaInicio, fechaFin, horaInicio, horaFin, ambiente, ficha } = formData;
    if (!fechaInicio || !fechaFin || !horaInicio || !horaFin || !ambiente || !ficha) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor, complete todos los campos antes de guardar.',
        showConfirmButton: true
      });
      return;
    }

    // Verificar si ya existe un horario con el mismo ambiente o instructor
    const horarioDuplicado = horariosExistentes.find(h =>
      h.ambiente === parseInt(ambiente, 10) &&
      h.id !== horario.id // Excluir el horario actual
    );

    if (horarioDuplicado) {
      Swal.fire({
        icon: 'error',
        title: 'Horario duplicado',
        text: 'Ya existe un horario con este ambiente o instructor en el mismo rango de fechas.',
        showConfirmButton: true
      });
      return;
    }

    const updatedData = {
      fecha_inicio: new Date(fechaInicio).toISOString(),
      hora_inicio: horaInicio,
      fecha_fin: new Date(fechaFin).toISOString(),
      hora_fin: horaFin,
      ambiente: parseInt(ambiente, 10), // Convierte a entero
      ficha: parseInt(ficha, 10), // Convierte a entero
    };

    console.log("Datos a enviar:", updatedData);

    try {
      const response = await fetch(`http://localhost:3000/api/horarios/${horario.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      const responseText = await response.text();

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Horario actualizado con éxito',
          showConfirmButton: false,
          timer: 1500
        });
        onClose();
        window.location.reload(); // Refresca la página después de guardar
      } else {
        console.error("Error al actualizar el horario:", responseText);
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar el horario',
          text: responseText,
          showConfirmButton: true
        });
      }
    } catch (error) {
      console.error("Error al conectar con el servidor", error);
      Swal.fire({
        icon: 'error',
        title: 'Error al conectar con el servidor',
        text: error.message,
        showConfirmButton: true
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        <>
          <ModalHeader className="flex flex-col gap-1 bg-green-600">Editar Horario</ModalHeader>
          <ModalBody>
            <Input
              label="Fecha Inicio"
              name="fechaInicio"
              type="date"
              value={formData.fechaInicio}
              onChange={handleChange}
              fullWidth
            />
            <Input
              label="Fecha Fin"
              name="fechaFin"
              type="date"
              value={formData.fechaFin}
              onChange={handleChange}
              fullWidth
            />
            <Input
              label="Hora Inicio"
              name="horaInicio"
              type="time"
              value={formData.horaInicio}
              onChange={handleChange}
              fullWidth
            />
            <Input
              label="Hora Fin"
              name="horaFin"
              type="time"
              value={formData.horaFin}
              onChange={handleChange}
              fullWidth
            />
            <Select
              label="Ambiente"
              name="ambiente"
              value={formData.ambiente}
              onChange={handleChange}
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
            <Select
              label="Ficha"
              name="ficha"
              value={formData.ficha}
              onChange={handleChange}
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
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Cerrar
            </Button>
            <Button color="primary" onPress={handleSave}>
              Guardar
            </Button>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
};

export default ModalActualizarHorario;
