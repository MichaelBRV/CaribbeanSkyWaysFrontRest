import { Link } from "react-router-dom";
import { Plane, Users, Ticket, Percent } from "lucide-react";

export default function AdminPanel() {
  const cards = [
    {
      title: "Gestionar Vuelos",
      icon: <Plane size={32} />,
      link: "/admin/flights",
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Gestionar Usuarios",
      icon: <Users size={32} />,
      link: "/admin/users",
      color: "bg-purple-100 text-purple-700",
    },
    {
      title: "Gestionar Reservas",
      icon: <Ticket size={32} />,
      link: "/admin/reservations",
      color: "bg-green-100 text-green-700",
    },
    {
      title: "Promociones",
      icon: <Percent size={32} />,
      link: "/admin/promotions",
      color: "bg-amber-100 text-amber-700",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">
        Panel de Administración
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((c) => (
          <Link
            key={c.title}
            to={c.link}
            className={`p-6 rounded-xl shadow-md border hover:shadow-lg transition ${c.color}`}
          >
            <div className="flex flex-col items-center text-center gap-3">
              {c.icon}
              <p className="font-semibold">{c.title}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
