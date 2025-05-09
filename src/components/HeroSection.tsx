import { useEffect, useState } from "react";
import { Mail, Github, MapPin, Linkedin } from "lucide-react";
import { motion } from "framer-motion";
import { personalInfo } from "@/lib/data";
import MotionWrapper from "./MotionWrapper";

export default function HeroSection() {
  const [locationInfo, setLocationInfo] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    console.log("useEffect se ejecutó");

    const fetchLocation = async (lat, lon) => {
      try {
        // Obtener ciudad y país desde OpenStreetMap
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
        );
        const data = await res.json();
        const city = data.address.city || data.address.town || data.address.village || "Desconocido";
        const country = data.address.country || "Desconocido";

        const now = new Date().toLocaleTimeString("es-CO", {
          timeZone: "America/Bogota",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });

        setLocationInfo(`${city}, ${country}`);
        setTime(now);

        // Enviar ubicación a Supabase
        const response = await fetch("https://yzoexqjdkrlcpkbqkmai.supabase.co/rest/v1/ubicaciones", {
          method: "POST",
          headers: {
            "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6b2V4cWpka3JsY3BrYnFrbWFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2ODAwMTQsImV4cCI6MjA2MjI1NjAxNH0.dT6l9ODE9mS1E260ZfzZm37cXDW3nMfEzK6Fl4R003E",
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6b2V4cWpka3JsY3BrYnFrbWFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2ODAwMTQsImV4cCI6MjA2MjI1NjAxNH0.dT6l9ODE9mS1E260ZfzZm37cXDW3nMfEzK6Fl4R003E",
            "Content-Type": "application/json",
            "Prefer": "return=minimal"
          },
          body: JSON.stringify({ city, country, lat, lon, time: now }),
        });

        if (!response.ok) {
          const text = await response.text();
          console.error("Error al enviar ubicación:", response.status, text);
        } else {
          console.log("Ubicación enviada exitosamente");
        }
      } catch (err) {
        console.error("Error en fetchLocation:", err);
      }
    };

    // Obtener ubicación del navegador
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          console.log("Ubicación obtenida:", lat, lon);
          fetchLocation(lat, lon);
        },
        (error) => {
          console.error("Error con la geolocalización:", error);
          alert("No se pudo obtener la ubicación. Por lo tanto, no se monstrará la ciudad y la hora");
        }
      );
    } else {
      console.log("Geolocalización no soportada en este navegador.");
      alert("Tu navegador no soporta geolocalización.");
    }
  }, []);
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <>
      {/* SOLO SE MUESTRA SI locationInfo EXISTE */}
      {locationInfo && (
        <div className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 px-4 text-center shadow-md z-50">
          <p className="text-lg font-semibold flex items-center justify-center gap-2">
            <MapPin className="w-5 h-5" /> 📍 {locationInfo} — 🕒 {time}
          </p>
        </div>
      )}

      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="container max-w-4xl mx-auto px-6 md:px-4 relative z-10">
          <motion.div
            className="flex flex-col md:flex-row md:items-center justify-between mb-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="text-center md:text-left">
              <motion.h1 className="text-4xl font-bold mb-2" variants={childVariants}>
                {personalInfo.name} <span className="inline-block animate-pulse">✨</span>
              </motion.h1>

              <motion.p className="text-xl text-muted-foreground mb-6" variants={childVariants}>
                Software Engineer 👨‍💻
              </motion.p>

              <motion.div className="flex flex-col gap-2 items-center md:items-start" variants={containerVariants}>
                <motion.a
                  href={`mailto:${personalInfo.email}`}
                  className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                  variants={childVariants}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  ✉️ {personalInfo.email}
                </motion.a>

                <motion.a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                  variants={childVariants}
                >
                  <Github className="h-4 w-4 mr-2" />
                  🌟 GitHub
                </motion.a>

                <motion.a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                  variants={childVariants}
                >
                  <Linkedin className="h-4 w-4 mr-2" />
                  🔗 LinkedIn
                </motion.a>
              </motion.div>
            </div>

            <motion.div
              className="mt-6 md:mt-0 flex justify-center"
              variants={childVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <img
                  src="/"
                  alt="Foto"
                  className="w-48 md:w-60 rounded-full relative ring-2 ring-purple-500/50"
                  style={{ objectFit: "cover" }}
                />
              </div>
            </motion.div>
          </motion.div>

          <MotionWrapper>
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm backdrop-filter p-4 rounded-lg border border-purple-500/20 dark:border-purple-500/10 shadow-sm">
              <p className="text-muted-foreground pl-4 py-2 mb-4 relative">
                <span className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></span>
                🚀 Soy un desarrollador apasionado que combina creatividad y tecnología para crear soluciones efectivas e innovadoras. Siempre listo para aprender algo nuevo y aportar a grandes proyectos.
              </p>
            </div>
          </MotionWrapper>
        </div>
      </section>
    </>
  );
}
