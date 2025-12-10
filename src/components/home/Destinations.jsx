// src/components/home/Destinations.jsx
import sanJuanImg from "../../assets/images/san-juan.jpg";
import miamiImg from "../../assets/images/miami.jpg";
import quitoImg from "../../assets/images/quito.jpg";
import guayaquilImg from "../../assets/images/guayaquil.jpg";

const DESTINATIONS = [
  {
    name: "San Juan",
    code: "SJU",
    country: "Puerto Rico",
    description: "Playas cristalinas, casco antiguo colorido y vibrante vida nocturna.",
    image: sanJuanImg,
  },
  {
    name: "Miami",
    code: "MIA",
    country: "Estados Unidos",
    description: "Skyline icónico, shopping y conexión con todo el Caribe.",
    image: miamiImg,
  },
  {
    name: "Quito",
    code: "UIO",
    country: "Ecuador",
    description: "Centro histórico colonial y vistas espectaculares a los Andes.",
    image: quitoImg,
  },
  {
    name: "Guayaquil",
    code: "GYE",
    country: "Ecuador",
    description: "Malecón 2000, río Guayas y el puerto más importante del país.",
    image: guayaquilImg,
  },
];

export default function Destinations() {
  return (
    <section className="py-10 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Destinos destacados
            </h2>
            <p className="text-sm text-slate-600">
              Explora las rutas más populares de Caribbean Skyways.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {DESTINATIONS.map((dest) => (
            <article
              key={dest.code}
              className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition"
            >
              <div className="relative h-40 overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2 px-2 py-1 rounded-full bg-slate-900/70 text-white text-[10px] font-semibold uppercase tracking-wide">
                  {dest.code}
                </div>
              </div>
              <div className="p-3">
                <h3 className="text-sm font-semibold text-slate-900">
                  {dest.name}
                </h3>
                <p className="text-xs text-slate-500 mb-2">{dest.country}</p>
                <p className="text-xs text-slate-600 line-clamp-2">
                  {dest.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
