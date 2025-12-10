import { useEffect, useState } from "react";
import { getPayments } from "../../utils/paymentStorage";
import { CreditCard, DollarSign } from "lucide-react";

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    setPayments(getPayments());
  }, []);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("es-EC", { timeZone: "UTC" });

  const formatTime = (d) =>
    new Date(d).toLocaleTimeString("es-EC", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    });

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Historial de pagos</h1>

      {payments.length === 0 && (
        <p className="text-slate-600">Todavía no realizaste ningún pago.</p>
      )}

      <div className="space-y-4">
        {payments.map((p) => (
          <div
            key={p.id}
            className="bg-white border rounded-xl shadow-sm p-5 flex justify-between items-center"
          >
            {/* Información izquierda */}
            <div className="space-y-2">
              {/* PNR */}
              <div>
                <p className="text-xs text-slate-500">Código PNR</p>
                <p className="font-bold text-blue-600 text-lg">
                  {p.pnr === "PENDIENTE" ? "—" : p.pnr}
                </p>
              </div>

              {/* Método */}
              <div>
                <p className="text-xs text-slate-500">Método</p>
                <p className="font-semibold flex items-center gap-1 capitalize">
                  <CreditCard size={16} className="text-slate-400" />
                  {p.method}
                </p>
              </div>

              {/* Fecha */}
              <div>
                <p className="text-xs text-slate-500">Fecha</p>
                <p className="font-medium">
                  {formatDate(p.date)} — {formatTime(p.date)}
                </p>
              </div>
            </div>

            {/* Monto */}
            <div className="text-right">
              <p className="text-xs text-slate-500">Monto</p>
              <p className="text-3xl font-bold text-slate-900 flex items-center justify-end gap-1">
                <DollarSign size={22} /> {p.amount}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
