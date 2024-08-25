import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { fetchAmbientes } from "../../../../lib/fetch";
import { Button, Switch } from "@nextui-org/react";
import ActualizarAmbiente from '../../organisms/modals/ambientes/ActualizarAmbientes';
import Swal from 'sweetalert2';

const AmbientesTable = () => {
  const [data, setData] = useState([]);
  const [municipios, setMunicipios] = useState({});
  const [selectedAmbiente, setSelectedAmbiente] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const ambientesResponse = await fetchAmbientes();
        const municipiosResponse = await fetch("/api/municipios").then((res) => res.json());

        const municipiosMap = municipiosResponse.reduce((acc, municipio) => {
          acc[municipio.id_municipio] = municipio.nombre_mpio;
          return acc;
        }, {});

        const updatedData = ambientesResponse.map((ambiente) => ({
          id_ambiente: ambiente.id_ambiente,
          nombre_amb: ambiente.nombre_amb,
          municipio: municipiosMap[ambiente.municipio] || "Desconocido",
          sede: ambiente.sede,
          estado: ambiente.estado,
        }));

        setData(updatedData);
        setMunicipios(municipiosMap);
      } catch (error) {
        console.error("Error fetching ambientes:", error);
      }
    };

    getData();
  }, []);

  const handleUpdate = (updatedAmbiente) => {
    setData((prevData) =>
      prevData.map((ambiente) =>
        ambiente.id_ambiente === updatedAmbiente.id_ambiente ? updatedAmbiente : ambiente
      )
    );
  };

  const handleDelete = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4CAF50', // Verde similar al sidebar
      cancelButtonColor: '#f44336', // Rojo para el botón de cancelar
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
  
    if (!isConfirmed) return;
  
    try {
      const response = await fetch(`http://localhost:3000/api/ambientes/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Error al eliminar el ambiente');
      }
  
      setData((prevData) => prevData.filter((ambiente) => ambiente.id_ambiente !== id));
  
      await Swal.fire({
        icon: 'success',
        title: 'Eliminado',
        text: 'Ambiente eliminado correctamente',
        confirmButtonColor: '#4CAF50',
      });
    } catch (error) {
      console.error('Error al eliminar ambiente:', error);
  
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar el ambiente',
        confirmButtonColor: '#4CAF50',
      });
    }
  };

  const handleSwitchChange = async (id, isActive) => {
    const newState = isActive ? 'activo' : 'inactivo';
    
    try {
      const response = await fetch(`http://localhost:3000/api/ambientes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado: newState }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el estado');
      }

      setData((prevData) =>
        prevData.map((ambiente) =>
          ambiente.id_ambiente === id ? { ...ambiente, estado: newState } : ambiente
        )
      );

      await Swal.fire({
        icon: 'success',
        title: 'Actualizado',
        text: 'Estado actualizado correctamente',
        confirmButtonColor: '#4CAF50',
      });
    } catch (error) {
      console.error('Error al actualizar estado:', error);

      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar el estado',
        confirmButtonColor: '#4CAF50',
      });
    }
  };

  const columns = [
    { name: "id_ambiente", label: "ID Ambiente" },
    { name: "nombre_amb", label: "Nombre Ambiente" },
    { name: "municipio", label: "Municipio" },
    { name: "sede", label: "Sede" },
    { name: "estado", label: "Estado" },
    {
      name: "estadoSwitch",
      label: "Switch Estado",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const ambiente = data[tableMeta.rowIndex];
          const isActive = ambiente.estado === "activo";
          return (
            <Switch
              isSelected={isActive}
              onChange={() => handleSwitchChange(ambiente.id_ambiente, !isActive)}
              color="success" // Verde para que combine con el sidebar
            />
          );
        },
      },
    },
    {
      name: "actions",
      label: "Acciones",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const ambiente = data[tableMeta.rowIndex];
          return (
            <div>
              <Button
                className="bg-green-600 text-white mr-2 hover:bg-green-500 transition-colors" // Verde oscuro similar al sidebar
                onClick={() => {
                  setSelectedAmbiente(ambiente);
                  setIsModalOpen(true);
                }}
              >
                Editar
              </Button>
              <Button
                className="bg-red-600 text-white hover:bg-red-500 transition-colors" // Gris oscuro para el botón de eliminar
                onClick={() => handleDelete(ambiente.id_ambiente)}
              >
                Eliminar
              </Button>
            </div>
          );
        },
      },
    },
  ];

  const options = {
    filterType: "checkbox",
    scroll: "vertical",
    selectableRows: 'none', // Deshabilitar selección de filas si no es necesario
    responsive: "standard",
    textLabels: {
      body: {
        noMatch: "No se encontraron registros",
        toolTip: "Ordenar",
      },
      pagination: {
        next: "Siguiente Página",
        previous: "Página Anterior",
        rowsPerPage: "Filas por página:",
        displayRows: "de",
      },
      toolbar: {
        search: "Buscar",
        downloadCsv: "Descargar CSV",
        print: "Imprimir",
        viewColumns: "Ver Columnas",
        filterTable: "Filtrar Tabla",
      },
    },
    elevation: 0, // Quita la sombra del borde de la tabla
    customStyles: {
      MUIDataTableBodyCell: {
        root: {
          backgroundColor: "#1e293b", // Gris oscuro para las celdas
          color: "#fff", // Texto blanco para las celdas
        },
      },
      MUIDataTableHeadCell: {
        root: {
          backgroundColor: "#334155", // Gris aún más oscuro para las cabeceras
          color: "#a7f3d0", // Texto verde claro para las cabeceras
        },
      },
    },
  };

  return (
    <>
      <MUIDataTable
        title={"Ambientes"}
        data={data}
        columns={columns}
        options={options}
      />
      {selectedAmbiente && (
        <ActualizarAmbiente
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          ambiente={selectedAmbiente}
          onUpdate={handleUpdate}
        />
      )}
    </>
  );
};

export default AmbientesTable;
