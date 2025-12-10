import SearchFlightForm from "./SearchFlightForm";
import Destinations from "./Destinations";
import heroImg from "../../assets/images/hero.jpg"; // ← tu imagen local

export default function Hero() {
  return (
    <section className="w-full bg-white pb-16">
      {/* HERO VISUAL */}
      <div className="relative h-[340px] sm:h-[420px] lg:h-[480px] w-full overflow-hidden rounded-b-3xl shadow-md">
        <img
          src={heroImg}
          alt="Caribbean Skyways"
          className="w-full h-full object-cover"
        />

        {/* Capa oscura */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Texto encima */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg">
            Vive la experiencia
            <span className="block text-blue-300">
              Caribbean Skyways
            </span>
          </h1>

          <p className="mt-3 text-sm sm:text-base text-gray-200 max-w-xl drop-shadow-md">
            Conecta con el Caribe, Estados Unidos y Ecuador con una experiencia
            moderna, segura y pensada para ti.
          </p>
        </div>
      
          <ul className="text-sm text-slate-600 space-y-1">
            <li>• Tarifas claras y sin costos ocultos.</li>
            <li>• Cambios flexibles en tus reservas.</li>
            <li>• Atención al cliente 24/7.</li>
          </ul>
       </div>

      {/* FORMULARIO flotante */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-14 relative z-10">
        <SearchFlightForm />
      </div>

      {/* DESTINOS */}
      <div className="mt-10">
        <Destinations />
      </div>
    </section>
  );
}
