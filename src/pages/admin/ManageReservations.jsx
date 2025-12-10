// src/pages/admin/ManageReservations.jsx
import { useEffect, useState } from "react";
import { Pencil, Trash2, XCircle } from "lucide-react";
import {
  getReservations,
  updateReservation,
  cancelReservation,
  deleteReservation,
} from "../../services/reservationService";

// ============ MODAL GENÉRICO ============
function Modal({ open, onClose, children }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-xl shadow-xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

// Helper para estilo del estado
function getStatusClasses(status) {
  const base = "px-3 py-1 rounded-full text-xs font-semibold";

  if (!status) return base + " bg-slate-200 text-slate-700";

  const s = status.toLowerCase();

  if (s === "paid" || s === "confirmed")
    return base + " bg-green-100 text-green-700";

  if (s === "cancelled" || s === "canceled")
    return base + " bg-red-100 text-red-700";

  if (s === "pending")
    return base + " bg-amber-100 text-amber-800";

  return base + " bg-slate-200 text-slate-700";
}

export default function ManageReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");

  // ============================
  // 🔄 Cargar reservas
  // ============================
  async function loadReservations() {
    try {
      setLoading(true);
      const data = await getReservations();
      setReservations(data || []);
    } catch (err) {
      console.error("Error cargando reservas:", err);
      alert("Error cargando reservas");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReservations();
  }, []);

  // ============================
  // ✏️ Abrir modal de edición
  // ============================
  const openEdit = (res) => {
    setSelected(res);
    setStatus(res.Status || "");
    setNotes(res.Notes || "");
    setModalOpen(true);
  };

  // ============================
  // 💾 Guardar cambios de reserva
  // ============================
  const handleSave = async () => {
    if (!selected) return;

    try {
      await updateReservation(selected.ReservationId, {
        Status: status,
        Notes: notes,
      });

      setModalOpen(false);
      await loadReservations();
    } catch (err) {
      console.error("Error actualizando reserva:", err);
      alert("No se pudo actualizar la reserva");
    }
  };

  // ============================
  // ❌ Cancelar reserva completa
  // ============================
  const handleCancelReservation = async (res) => {
    if (
      !window.confirm(
        `¿Seguro deseas CANCELAR la reserva #${res.ReservationId}? Esto liberará los asientos y eliminará los tickets.`
      )
    )
      return;

    try {
      await cancelReservation(res.ReservationId);
      await loadReservations();
    } catch (err) {
      console.error("Error cancelando reserva:", err);
      alert("No se pudo cancelar la reserva");
    }
  };

  // ============================
  // 🗑 Eliminar reserva
  // ============================
  const handleDelete = async (res) => {
    if (
      !window.confirm(
        `¿Seguro deseas ELIMINAR la reserva #${res.ReservationId}?`
      )
    )
      return;

    try {
      await deleteReservation(res.ReservationId);
      await loadReservations();
    } catch (err) {
      console.error("Error eliminando reserva:", err);
      alert(
        "No se pudo eliminar la reserva (seguramente tiene tickets asociados)."
      );
    }
  };

  // ============================
  // 🖥 Render
  // ============================
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Gestionar Reservas</h1>
      </div>

      <div className="bg-white shadow-md rounded-xl overflow-x-auto border">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Usuario</th>
              <th className="p-3 text-left">Fecha</th>
              <th className="p-3 text-left">Estado</th>
              <th className="p-3 text-right">Total</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="6" className="p-6 text-center">
                  Cargando reservas...
                </td>
              </tr>
            )}

            {!loading && reservations.length === 0 && (
              <tr>
                <td colSpan="6" className="p-6 text-center">
                  No hay reservas registradas
                </td>
              </tr>
            )}

            {!loading &&
              reservations.map((r) => (
                <tr key={r.ReservationId} className="border-t">
                  <td className="p-3 font-mono text-xs">#{r.ReservationId}</td>

                  <td className="p-3">
                    {r.UserId ? `Usuario ${r.UserId}` : "—"}
                  </td>

                  <td className="p-3">
                    {r.ReservationDate
                      ? new Date(r.ReservationDate).toLocaleString()
                      : "—"}
                  </td>

                  <td className="p-3">
                    <span className={getStatusClasses(r.Status)}>
                      {r.Status || "—"}
                    </span>
                  </td>

                  <td className="p-3 text-right font-semibold text-blue-700">
                    ${Number(r.Total || 0).toFixed(2)}
                  </td>

                  <td className="p-3">
                    <div className="flex justify-center gap-2">
                      {/* Editar estado / notas */}
                      <button
                        onClick={() => openEdit(r)}
                        className="p-2 bg-amber-100 text-amber-700 rounded"
                        title="Editar estado / notas"
                      >
                        <Pencil size={16} />
                      </button>

                      {/* Cancelar reserva */}
                      {r.Status?.toLowerCase() !== "cancelled" &&
                        r.Status?.toLowerCase() !== "canceled" && (
                          <button
                            onClick={() => handleCancelReservation(r)}
                            className="p-2 bg-red-100 text-red-600 rounded"
                            title="Cancelar reserva"
                          >
                            <XCircle size={16} />
                          </button>
                        )}

                      {/* Eliminar (solo si está cancelada) */}
                      {(r.Status?.toLowerCase() === "cancelled" ||
                        r.Status?.toLowerCase() === "canceled") && (
                        <button
                          onClick={() => handleDelete(r)}
                          className="p-2 bg-red-100 text-red-700 rounded"
                          title="Eliminar reserva"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* MODAL EDICIÓN */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">
          Editar reserva #{selected?.ReservationId}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold block mb-1">
              Estado
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border rounded-lg p-2"
            >
              <option value="">(sin cambiar)</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Paid">Paid</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold block mb-1">
              Notas
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full border rounded-lg p-2"
              placeholder="Notas internas sobre la reserva..."
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => setModalOpen(false)}
            className="px-4 py-2 bg-slate-200 rounded-lg"
          >
            Cancelar
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Guardar cambios
          </button>
        </div>
      </Modal>
    </div>
  );
}
