import { X } from "lucide-react";
import { useState, useEffect } from "react";

export default function PromotionModal({ open, onClose, onSubmit, initial }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    discount: "",
    validUntil: "",
  });

  useEffect(() => {
    if (initial) setForm(initial);
  }, [initial]);

  if (!open) return null;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    if (!form.title || !form.discount || !form.validUntil) {
      alert("Completa todos los campos.");
      return;
    }
    onSubmit(form);
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-slate-500 hover:text-slate-700"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          {initial ? "Editar promoción" : "Nueva promoción"}
        </h2>

        <div className="space-y-3">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg"
            placeholder="Título"
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg"
            placeholder="Descripción"
          />

          <input
            name="discount"
            type="number"
            value={form.discount}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg"
            placeholder="Descuento (%)"
          />

          <input
            name="validUntil"
            type="date"
            value={form.validUntil}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg"
          />
        </div>

        <button
          onClick={handleSave}
          className="mt-5 w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700"
        >
          Guardar
        </button>
      </div>
    </div>
  );
}
