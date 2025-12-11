//import Logo from '../assets/Logo_2.png';
import { motion } from "framer-motion";
import Logo from "../../assets/Logo_2.png";
const LogoAnimado = () => {
  return (
    <div className="text-center mt-8">
    <motion.img
      src={Logo}
      alt="Peliflix Logo"
      className="w-[600px] h-[500px] sm:w-[350px] sm:h-[175px] md:w-[450px] md:h-[225px] mx-auto" 
      initial={{ x: -300, opacity: 1 }} // empieza desde la izquierda
      animate={{ x: 0, opacity: 1 }} // se centra
      transition={{ 
        type: "spring", 
        stiffness: 50, 
        damping: 20,
        y: { 
          duration: 4,
          ease: "easeInOut",
          repeat: Infinity
        }
      }}
      // animación constante arriba y abajo una vez centrado
      whileInView={{ y: [0, -20, 0, 20, 0] }}
    />
    {/* Título debajo del logo */}
       <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mt-6 mb-10">
        Películas y series ilimitadas y mucho más
      </h1>
      </div>
  );
};

export default LogoAnimado;
