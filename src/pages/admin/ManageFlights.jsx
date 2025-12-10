import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { api } from "../../services/api.js";

// ============ MODAL =============
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

export default function ManageFlights() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({
    FlightId: 0,
    Airline: "",
    FlightNumber: "",
    OriginId: "",
    DestinationId: "",
    OriginName: "",
    DestinationName: "",
    DepartureTime: "",
    ArrivalTime: "",
    Duration: "",
    CabinClass: "",
    AircraftId: "",
    Price: "",
    SeatsAvailable: "",
    CancellationPolicy: "",
  });

  // ============================
  // 🔄 Cargar vuelos
  // ============================
  async function loadFlights() {
    try {
      setLoading(true);
      const data = await api.get("flights");
      setFlights(data);
    } catch (err) {
      console.error("Error cargando vuelos:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFlights();
  }, []);

  // ============================
  // ➕ Crear
  // ============================
  const openCreate = () => {
    setForm({
      FlightId: 0,
      Airline: "",
      FlightNumber: "",
      OriginId: "",
      DestinationId: "",
      OriginName: "",
      DestinationName: "",
      DepartureTime: "",
      ArrivalTime: "",
      Duration: "",
      CabinClass: "",
      AircraftId: "",
      Price: "",
      SeatsAvailable: "",
      CancellationPolicy: "",
    });
    setEditMode(false);
    setModalOpen(true);
  };

  // ============================
  // ✏️ Editar
  // ============================
  const openEdit = (flight) => {
    setForm(flight);
    setEditMode(true);
    setModalOpen(true);
  };

  // ============================
  // ✍ Cambios del formulario
  // ============================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ============================
  // 💾 Guardar (create + edit)
  // ============================
  const handleSave = async () => {
    try {
      if (editMode) {
        await api.put(`flights/${form.FlightId}`, form);
      } else {
        await api.post("flights", form);
      }

      setModalOpen(false);
      loadFlights();
    } catch (err) {
      console.error("Error guardando vuelo:", err);
      alert("Error al guardar el vuelo");
    }
  };

  // ============================
  // 🗑 Eliminar
  // ============================
  const handleDelete = async (id) => {
    if (!confirm("¿Seguro deseas eliminar este vuelo?")) return;

    try {
      await api.delete(`flights/${id}`);
      loadFlights();
    } catch (err) {
      console.error("Error eliminando vuelo:", err);
      alert("No se pudo eliminar");
    }
  };

  // ============================
  // 🖥 Render
  // ============================
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Gestionar Vuelos</h1>

        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          <Plus size={18} />
          Nuevo vuelo
        </button>
      </div>

      <div className="bg-white shadow-md rounded-xl overflow-x-auto border">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3 text-left">Origen</th>
              <th className="p-3 text-left">Destino</th>
              <th className="p-3 text-left">Salida</th>
              <th className="p-3 text-left">Precio</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="5" className="p-6 text-center">
                  Cargando vuelos...
                </td>
              </tr>
            )}

            {!loading && flights.length === 0 && (
              <tr>
                <td colSpan="5" className="p-6 text-center">
                  No hay vuelos registrados
                </td>
              </tr>
            )}

            {!loading &&
              flights.map((f) => (
                <tr key={f.FlightId} className="border-t">
                  <td className="p-3">{f.OriginName}</td>
                  <td className="p-3">{f.DestinationName}</td>
                  <td className="p-3">
                    {new Date(f.DepartureTime).toLocaleString()}
                  </td>
                  <td className="p-3 font-bold text-blue-700">${f.Price}</td>

                  <td className="p-3 flex justify-center gap-3">
                    <button
                      onClick={() => openEdit(f)}
                      className="p-2 bg-amber-100 text-amber-700 rounded"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      onClick={() => handleDelete(f.FlightId)}
                      className="p-2 bg-red-100 text-red-600 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">
          {editMode ? "Editar vuelo" : "Nuevo vuelo"}
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="OriginName"
            placeholder="Origen"
            value={form.OriginName}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            type="text"
            name="DestinationName"
            placeholder="Destino"
            value={form.DestinationName}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            type="datetime-local"
            name="DepartureTime"
            value={
              form.DepartureTime
                ? form.DepartureTime.split(":").slice(0, 2).join(":")
                : ""
            }
            onChange={handleChange}
            className="border p-2 rounded col-span-2"
          />

          <input
            type="number"
            name="Price"
            placeholder="Precio"
            value={form.Price}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            type="number"
            name="SeatsAvailable"
            placeholder="Asientos"
            value={form.SeatsAvailable}
            onChange={handleChange}
            className="border p-2 rounded"
          />
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
            Guardar
          </button>
        </div>
      </Modal>
    </div>
  );
}
