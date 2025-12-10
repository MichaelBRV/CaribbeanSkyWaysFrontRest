import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import PromotionModal from "./components/PromotionModal";
import {
  getPromotions,
  addPromotion,
  updatePromotion,
  deletePromotion,
} from "../../utils/promoStorage";

export default function ManagePromotions() {
  const [promotions, setPromotions] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editPromo, setEditPromo] = useState(null);

  useEffect(() => {
    setPromotions(getPromotions());
  }, []);

  const handleAdd = () => {
    setEditPromo(null);
    setModalOpen(true);
  };

  const handleEdit = (promo) => {
    setEditPromo(promo);
    setModalOpen(true);
  };

  const handleSave = (promo) => {
    if (editPromo) {
      updatePromotion(editPromo.id, promo);
    } else {
      addPromotion(promo);
    }
    setPromotions(getPromotions());
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    if (confirm("¿Seguro que deseas eliminar esta promoción?")) {
      deletePromotion(id);
      setPromotions(getPromotions());
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Gestión de Promociones
        </h1>

        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={18} /> Nueva promoción
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white shadow-md rounded-xl border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="p-3 text-left">Título</th>
              <th className="p-3 text-left">Descuento</th>
              <th className="p-3 text-left">Válido hasta</th>
              <th className="p-3 text-left">Descripción</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {promotions.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3 font-semibold">{p.title}</td>
                <td className="p-3">{p.discount}%</td>
                <td className="p-3">{p.validUntil}</td>
                <td className="p-3">{p.description}</td>

                <td className="p-3 flex justify-center gap-3">
                  <button
                    onClick={() => handleEdit(p)}
                    className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}

            {promotions.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-slate-500">
                  No hay promociones registradas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <PromotionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSave}
        initial={editPromo}
      />
    </div>
  );
}
