import { useState, useEffect } from "react";
import { ListAllSchedules } from "/src/services/ScheduleService";
import { Table } from "/src/components/Table";
import { Modal } from "/src/components/Modal";

function formatHora(valor) {
  if (!valor) return "";
  return valor.length > 5 ? valor.slice(11, 16) : valor;
}

export function Schedules() {
  const [horarios, setHorarios] = useState([]);
  const [modalDetalles, setModalDetalles] = useState(false);
  const [horario, setHorario] = useState(null);
  const [ordenColumna, setOrdenColumna] = useState("dia");
  const [ordenAsc, setOrdenAsc] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      const data = await ListAllSchedules();
      setHorarios(data.data);
    };
    cargar();
  }, []);

  function verDetalles(item) {
    setHorario(item);
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

  const horariosOrdenados = [...horarios].sort((a, b) => {
    let valorA, valorB;
    if (ordenColumna === "inicio") {
      valorA = a.horaInicio || "";
      valorB = b.horaInicio || "";
    } else if (ordenColumna === "estado") {
      valorA = a.activo ? 1 : 0;
      valorB = b.activo ? 1 : 0;
    } else {
      valorA = a.diaSemana?.numeroOrden ?? a.diaSemana?.nombre ?? "";
      valorB = b.diaSemana?.numeroOrden ?? b.diaSemana?.nombre ?? "";
    }
    if (valorA < valorB) return ordenAsc ? -1 : 1;
    if (valorA > valorB) return ordenAsc ? 1 : -1;
    return 0;
  });

  const columnas = [
    { key: "dia", label: "Día", sortable: true, render: (item) => item.diaSemana?.nombre },
    { key: "inicio", label: "Hora inicio", sortable: true, render: (item) => formatHora(item.horaInicio) },
    { key: "fin", label: "Hora fin", render: (item) => formatHora(item.horaFin) },
    { key: "estado", label: "Estado", sortable: true, render: (item) => (item.activo ? "Activo" : "Desactivado") },
  ];

  return (
    <div className="relative w-full min-h-screen bg-black text-gray-200 font-mono p-6 overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto space-y-6">
        <header className="border-b border-cyan-500/30 pb-4">
          <h1 className="text-3xl font-black italic uppercase tracking-tighter bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(34,211,238,0.5)]">
            Horarios de Atención
          </h1>
        </header>

        <Table
          columns={columnas}
          data={horariosOrdenados}
          onRowClick={verDetalles}
          sortColumn={ordenColumna}
          sortAsc={ordenAsc}
          onSort={ordenarPor}
          emptyMessage="Sin horarios registrados"
        />
      </div>

      {modalDetalles && horario && (
        <Modal onClose={() => setModalDetalles(false)}>
          <h3 className="text-xl font-bold uppercase text-cyan-300">{horario.diaSemana?.nombre}</h3>

          <p className="text-xs uppercase text-fuchsia-300 mt-4 mb-1">Horario</p>
          <p className="text-sm text-gray-300">
            {formatHora(horario.horaInicio)} - {formatHora(horario.horaFin)}
          </p>

          <p className="text-xs uppercase text-fuchsia-300 mt-4 mb-1">Estado</p>
          <p className="text-sm text-gray-300">{horario.activo ? "Activo" : "Desactivado"}</p>
        </Modal>
      )}
    </div>
  );
}
