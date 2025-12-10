// src/pages/admin/ManageReservations.jsx
import { useEffect, useState } from "react";
import { Eye, Trash2 } from "lucide-react";
import {
  getReservations,
  updateReservationStatus,
  cancelReservation,
} from "../../utils/reservationStorage";

import AdminReservationDetailModal from "./components/AdminReservationDetailModal";

export default function ManageReservations() {
  const [reservations, setReservations] = useState([]);
  const [filter, setFilter] = useState("all"); // all | Confirmado | Cancelado | Completado

  const [selectedReservation, setSelectedReservation] = useState(null); // 🔥 para el modal
  const [showModal, setShowModal] = useState(false);

  // Cargar reservas
  useEffect(() => {
    setReservations(getReservations());
  }, []);

  const filtered = reservations.filter((r) =>
    filter === "all" ? true : r.status === filter
  );

  const handleCancel = (pnr) => {
    if (!confirm("¿Seguro que deseas cancelar esta reserva?")) return;
    cancelReservation(pnr);
    setReservations(getReservations());
  };

  const changeStatus = (pnr, newStatus) => {
    updateReservationStatus(pnr, newStatus);
    setReservations(getReservations());
  };

  const openDetails = (reservation) => {
    setSelectedReservation(reservation);
    setShowModal(true);
  };

  const closeDetails = () => {
    setSelectedReservation(null);
    setShowModal(false);
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("es-EC", { timeZone: "UTC" });

  const formatTime = (d) =>
    new Date(d).toLocaleTimeString("es-EC", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    });

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Gestionar Reservas</h1>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        >
          <option value="all">Todas</option>
          <option value="Confirmado">Confirmadas</option>
          <option value="Cancelado">Canceladas</option>
          <option value="Completado">Completadas</option>
        </select>
      </div>

      {/* TABLA */}
      <div className="bg-white shadow-md rounded-xl border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="p-3 text-left">PNR</th>
              <th className="p-3 text-left">Ruta</th>
              <th className="p-3 text-left">Fecha</th>
              <th className="p-3 text-left">Pasajeros</th>
              <th className="p-3 text-left">Estado</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((r) => {
              const dep = new Date(r.flight.departure);

              return (
                <tr key={r.pnr} className="border-t">
                  <td className="p-3 font-bold text-blue-600">{r.pnr}</td>

                  <td className="p-3">
                    {r.flight.origin} → {r.flight.destination}
                  </td>

                  <td className="p-3">
                    {formatDate(dep)} — {formatTime(dep)}
                  </td>

                  <td className="p-3">{r.passengers.length}</td>

                  <td className="p-3 font-semibold">{r.status}</td>

                  <td className="p-3 flex justify-center gap-3">

                    {/* Cambiar estado */}
                    <select
                      value={r.status}
                      onChange={(e) => changeStatus(r.pnr, e.target.value)}
                      className="border px-2 py-1 rounded-lg"
                    >
                      <option value="Confirmado">Confirmado</option>
                      <option value="Cancelado">Cancelado</option>
                      <option value="Completado">Completado</option>
                    </select>

                    {/* Ver detalles */}
                    <button
                      onClick={() => openDetails(r)}
                      className="p-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      <Eye size={16} />
                    </button>

                    {/* Cancelar */}
                    <button
                      onClick={() => handleCancel(r.pnr)}
                      className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
                    >
                      <Trash2 size={16} />
                    </button>

                  </td>
                </tr>
              );
            })}

            {filtered.length === 0 && (
              <tr>
                <td colSpan="6" className="p-6 text-center text-slate-500">
                  No hay reservas en este estado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL DETALLES */}
      <AdminReservationDetailModal
        open={showModal}
        onClose={closeDetails}
        reservation={selectedReservation}
      />
    </div>
  );
}
