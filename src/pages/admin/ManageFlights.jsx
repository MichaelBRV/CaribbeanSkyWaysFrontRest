import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  getAllFlights,
  createFlight,
  updateFlight,
  finalizeFlight,
} from "../../services/adminFlightsService";
import { api } from "../../services/api";

// ============ MODAL ============
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
  const [airports, setAirports] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({
    FlightId: 0,
    Airline: "",
    FlightNumber: "",
    OriginId: "",
    DestinationId: "",
    DepartureTime: "",
    ArrivalTime: "",
    Price: "",
    SeatsAvailable: "",
    CabinClass: "Economy",
    AircraftId: 1,
    CancellationPolicy: "Reembolsable",
    Status: "Scheduled",
  });

  // 🔹 Cargar aeropuertos
  async function loadAirports() {
    const data = await api.get("airports");
    setAirports(data || []);
  }

  // 🔹 Cargar vuelos
  async function loadFlights() {
    const data = await getAllFlights();
    setFlights(Array.isArray(data) ? data : []);
  }

  useEffect(() => {
    loadFlights();
    loadAirports();
  }, []);

  // Abrir modal para crear
  const openCreate = () => {
    setForm({
      FlightId: 0,
      Airline: "",
      FlightNumber: "",
      OriginId: "",
      DestinationId: "",
      DepartureTime: "",
      ArrivalTime: "",
      Price: "",
      SeatsAvailable: "",
      CabinClass: "Economy",
      AircraftId: 1,
      CancellationPolicy: "Reembolsable",
      Status: "Scheduled",
    });
    setEditMode(false);
    setModalOpen(true);
  };

  // Abrir modal para editar
  const openEdit = (f) => {
    setForm({
      FlightId: f.FlightId,
      Airline: f.Airline,
      FlightNumber: f.FlightNumber,
      OriginId: f.OriginId,
      DestinationId: f.DestinationId,
      DepartureTime: f.DepartureTime.substring(0, 16),
      ArrivalTime: f.ArrivalTime.substring(0, 16),
      Price: f.Price,
      SeatsAvailable: f.SeatsAvailable,
      CabinClass: f.CabinClass,
      AircraftId: f.AircraftId,
      CancellationPolicy: f.CancellationPolicy,
      Status: f.Status,
    });
    setEditMode(true);
    setModalOpen(true);
  };

  // Manejo de inputs
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // VALIDACIONES FINALES
  const validateForm = () => {
    const now = new Date();
    const dep = new Date(form.DepartureTime);
    const arr = new Date(form.ArrivalTime);

    if (!form.Airline || !form.FlightNumber) {
      alert("Aerolínea y número de vuelo son obligatorios.");
      return false;
    }
    if (!form.OriginId || !form.DestinationId) {
      alert("Debe seleccionar origen y destino.");
      return false;
    }
    if (form.OriginId === form.DestinationId) {
      alert("El origen y destino no pueden ser iguales.");
      return false;
    }
    if (!form.DepartureTime || !form.ArrivalTime) {
      alert("Debe ingresar hora de salida y llegada.");
      return false;
    }
    if (dep < now) {
      alert("La fecha de salida no puede ser anterior a hoy.");
      return false;
    }
    if (arr <= dep) {
      alert("La hora de llegada debe ser después de la salida.");
      return false;
    }
    if (form.Price <= 0) {
      alert("El precio debe ser mayor a 0.");
      return false;
    }
    if (form.SeatsAvailable <= 0) {
      alert("Los asientos deben ser mayores a 0.");
      return false;
    }
    return true;
  };

  // GUARDAR (crear / editar)
  const handleSave = async () => {
    if (!validateForm()) return;

    const payload = {
      ...form,
      Price: Number(form.Price),
      SeatsAvailable: Number(form.SeatsAvailable),
      OriginId: Number(form.OriginId),
      DestinationId: Number(form.DestinationId),
      AircraftId: Number(form.AircraftId),
    };

    try {
      if (editMode) {
        await updateFlight(form.FlightId, payload);
      } else {
        await createFlight(payload);
      }

      setModalOpen(false);
      loadFlights();
    } catch (err) {
      console.error(err);
      alert("❌ Error al guardar vuelo");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Finalizar este vuelo?")) return;

    try {
      await finalizeFlight(id);
      loadFlights();
    } catch (err) {
      console.error(err);
      alert("❌ Error al finalizar vuelo");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Gestión de Vuelos</h1>

        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          <Plus size={18} /> Nuevo vuelo
        </button>
      </div>

      <div className="bg-white shadow-md rounded-xl overflow-x-auto border">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3">Origen</th>
              <th className="p-3">Destino</th>
              <th className="p-3">Salida</th>
              <th className="p-3">Precio</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {flights.map((f) => (
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
          {editMode ? "Editar Vuelo" : "Nuevo Vuelo"}
        </h2>

        <div className="grid grid-cols-2 gap-4">
          
          {/* AEROLINEA */}
          <input
            type="text"
            name="Airline"
            placeholder="Aerolínea"
            value={form.Airline}
            onChange={handleChange}
            className="border p-2 rounded col-span-2"
          />

          {/* NUMERO DE VUELO */}
          <input
            type="text"
            name="FlightNumber"
            placeholder="Número de vuelo"
            value={form.FlightNumber}
            onChange={handleChange}
            className="border p-2 rounded col-span-2"
          />

          {/* ORIGEN */}
          <select
            name="OriginId"
            value={form.OriginId}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">Seleccionar origen</option>
            {airports.map((a) => (
              <option key={a.AirportId} value={a.AirportId}>
                {a.City} ({a.IATA})
              </option>
            ))}
          </select>

          {/* DESTINO */}
          <select
            name="DestinationId"
            value={form.DestinationId}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">Seleccionar destino</option>
            {airports.map((a) => (
              <option key={a.AirportId} value={a.AirportId}>
                {a.City} ({a.IATA})
              </option>
            ))}
          </select>

          {/* SALIDA */}
          <input
            type="datetime-local"
            name="DepartureTime"
            value={form.DepartureTime}
            onChange={handleChange}
            className="border p-2 rounded col-span-2"
          />

          {/* LLEGADA */}
          <input
            type="datetime-local"
            name="ArrivalTime"
            value={form.ArrivalTime}
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
