import { useState, useEffect } from "react";
import { ListAllRestrictions } from "/src/services/RestrictionsService";
import { Table } from "/src/components/Table";
import { Modal } from "/src/components/Modal";
import { formatFecha } from "@/lib/utils";

export function Restrictions() {
  const [restricciones, setRestricciones] = useState([]);
  const [modalDetalles, setModalDetalles] = useState(false);
  const [restriccion, setRestriccion] = useState(null);
  const [ordenColumna, setOrdenColumna] = useState("fecha");
  const [ordenAsc, setOrdenAsc] = useState(false);

  useEffect(() => {
    const cargar = async () => {
      const data = await ListAllRestrictions();
      setRestricciones(data.data);
    };
    cargar();
  }, []);

  function verDetalles(item) {
    setRestriccion(item);
    setModalDetalles(true);
  }

  function ordenarPor(columna) {
    if (ordenColumna === columna) {
      setOrdenAsc(!ordenAsc);
    } else {
      setOrdenColumna(columna);
      setOrdenAsc(true);
    }
  }

  const restriccionesOrdenadas = [...restricciones].sort((a, b) => {
    let valorA, valorB;
    if (ordenColumna === "tipo") {
      valorA = a.tipoRestriccion?.nombre || "";
      valorB = b.tipoRestriccion?.nombre || "";
    } else if (ordenColumna === "aplicaA") {
      valorA = a.empleado ? `${a.empleado.usuario?.nombre}` : "Establecimiento";
      valorB = b.empleado ? `${b.empleado.usuario?.nombre}` : "Establecimiento";
    } else if (ordenColumna === "estado") {
      valorA = a.activo ? 1 : 0;
      valorB = b.activo ? 1 : 0;
    } else {
      valorA = a.fecha || "";
      valorB = b.fecha || "";
    }
    if (valorA < valorB) return ordenAsc ? -1 : 1;
    if (valorA > valorB) return ordenAsc ? 1 : -1;
    return 0;
  });

  const columnas = [
    { key: "tipo", label: "Tipo", sortable: true, render: (item) => item.tipoRestriccion?.nombre },
    {
      key: "aplicaA",
      label: "Aplica a",
      sortable: true,
      render: (item) =>
        item.empleado
          ? `${item.empleado.usuario?.nombre} ${item.empleado.usuario?.primerApellido}`
          : "Establecimiento",
    },
    { key: "fecha", label: "Fecha", sortable: true, render: (item) => formatFecha(item.fecha) },
    { key: "estado", label: "Estado", sortable: true, render: (item) => (item.activo ? "Activo" : "Desactivado") },
  ];

  return (
    <div className="relative w-full min-h-screen bg-black text-gray-200 font-mono p-6 overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto space-y-6">
        <header className="border-b border-cyan-500/30 pb-4">
          <h1 className="text-3xl font-black italic uppercase tracking-tighter bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(34,211,238,0.5)]">
            Restricciones de Horario
          </h1>
        </header>

        <Table
          columns={columnas}
          data={restriccionesOrdenadas}
          onRowClick={verDetalles}
          sortColumn={ordenColumna}
          sortAsc={ordenAsc}
          onSort={ordenarPor}
          emptyMessage="Sin restricciones registradas"
        />
      </div>

      {modalDetalles && restriccion && (
        <Modal onClose={() => setModalDetalles(false)}>
          <h3 className="text-xl font-bold uppercase text-cyan-300">
            {restriccion.tipoRestriccion?.nombre}
          </h3>

          <p className="text-sm text-gray-400 mt-1">
            {restriccion.empleado
              ? `${restriccion.empleado.usuario?.nombre} ${restriccion.empleado.usuario?.primerApellido}`
              : "Aplica a todo el establecimiento"}
          </p>

          <p className="text-xs uppercase text-fuchsia-300 mt-4 mb-1">Fecha</p>
          <p className="text-sm text-gray-300">{formatFecha(restriccion.fecha)}</p>

          <p className="text-xs uppercase text-fuchsia-300 mt-4 mb-1">Horario restringido</p>
          <p className="text-sm text-gray-300">
            {restriccion.todoElDia
              ? "Todo el día"
              : `${restriccion.horaInicio} - ${restriccion.horaFin}`}
          </p>

          <p className="text-xs uppercase text-fuchsia-300 mt-4 mb-1">Motivo</p>
          <p className="text-sm text-gray-300">{restriccion.motivo}</p>

          <p className="text-xs uppercase text-fuchsia-300 mt-4 mb-1">Estado</p>
          <p className="text-sm text-gray-300">{restriccion.activo ? "Activo" : "Desactivado"}</p>
        </Modal>
      )}
    </div>
  );
}
