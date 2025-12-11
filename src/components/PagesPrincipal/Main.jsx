import { useState } from "react"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import tendencia1 from '../../assets/Merlina.jpg'
import tendencia2 from '../../assets/Happy.jpg'
import tendencia3 from '../../assets/Naruto.jpg'
import tendencia4 from '../../assets/Enelbarro.jpg'
import tendencia5 from '../../assets/Otra_vida.webp'
import Slider from "react-slick"
import LogoAnimado from "./LogoAnimado"
import { useNavigate } from "react-router-dom"

// Flecha siguiente
const NextArrow = ({ onClick, disabled }) => (
  <div 
    className={`absolute -right-5 top-1/2 -translate-y-1/2 z-10 cursor-pointer text-white 
      ${disabled ? "opacity-40 pointer-events-none" : ""}`}
    onClick={disabled ? undefined : onClick}
  >
    <span className="text-2xl sm:text-3xl absolute right-2  font-bold bg-black/0 rounded-full px-2 py-1 hover:bg-red-600 transition">
      ❯
    </span>
  </div>
);

// Flecha anterior
const PrevArrow = ({ onClick, disabled }) => (
  <div 
    className={`absolute -left-5 top-1/2 -translate-y-1/2 z-10 cursor-pointer text-white 
      ${disabled ? "opacity-40 pointer-events-none" : ""}`}
    onClick={disabled ? undefined : onClick}
  >
    <span className="text-2xl sm:text-3xl  absolute left-2 font-bold bg-black/90 rounded-full px-2 py-1 hover:bg-red-600 transition">
      ❮
    </span>
  </div>
);

const trendData = [
  { id: 1, src: tendencia1, alt: 'MERLINA', title: 'Merlina' },
  { id: 2, src: tendencia2, alt: 'Happy Gilmore 2', title: 'Happy Gilmore 2' },
  { id: 3, src: tendencia3, alt: 'Naruto', title: 'Naruto' },
  { id: 4, src: tendencia4, alt: 'En el Barro', title: 'En el Barro' },
  { id: 5, src: tendencia5, alt: 'Otra Vida', title: 'Otra Vida' }, 
];

const Main = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slidesToShowDefault = 3;
  const navigate = useNavigate()

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: slidesToShowDefault,
    slidesToScroll: 1,
    initialSlide: 0,
    beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
    responsive: [
      {
        breakpoint: 1024, // pantallas medianas
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 640, // pantallas chicas
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  const totalSlides = trendData.length;
  const slidesToShow = 
    window.innerWidth < 640 ? 1 : 
    window.innerWidth < 1024 ? 2 : slidesToShowDefault

  const isPrevDisabled = currentSlide === 0;
  const isNextDisabled = currentSlide >= totalSlides - slidesToShow;

  return (
    <div className="pt-10 ">
      {/* Logo animado con motion */}
      <LogoAnimado />
       {/* Fin Logo animado con motion */}
      {/* Sección de Tendencias */}
      <section className="mb-16 relative">
        <div className="max-w-7xl mx-auto px-4">
          {/* Línea roja con degradado */}
          <div className="w-full h-10 mb-4 bg-transparent"
            style={{
              background: 'radial-gradient(ellipse at center, #E50914 0%, transparent 70%)',
            }}>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
            Tendencias
          </h2>

          <Slider 
            {...sliderSettings} 
            nextArrow={<NextArrow disabled={isNextDisabled} />} 
            prevArrow={<PrevArrow disabled={isPrevDisabled} />}
          >
            {trendData.map(trend => (
              <div key={trend.id} className="px-2">
                <div 
                onClick={()=>navigate('/iniciar-sesion')}
                className="relative rounded-md overflow-hidden h-[300px] sm:h-[350px] w-full max-w-[350px] mx-auto transition-transform hover:scale-105 border border-red-600 shadow-lg shadow-neutral-950">
                  <img 
                    src={trend.src} 
                    alt={trend.alt} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 w-full bg-black/60 text-white p-2">
                    <span className="font-bold text-lg">{trend.title}</span>
                  </div>
                </div>
              </div>
            ))}
          </Slider>

          {/* Separadores decorativos */}
          <div className="w-full h-12 mt-4 bg-transparent"></div>
          <div 
            className="w-full h-10 mb-10 bg-transparent"
            style={{
              background: 'radial-gradient(ellipse at center, #E50914 0%, transparent 70%)',
            }}
          ></div>
        </div>
      </section>

      {/* Sección de Preguntas Frecuentes (FAQ) */}
      <section className="py-10 bg-neutral-800">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Preguntas frecuentes
          </h2>

          <div className="space-y-2">
            {/* Pregunta 1 */}
            <details className="bg-neutral-900 rounded-lg overflow-hidden">
              <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-neutral-800 transition-colors duration-200">
                <span className="text-xl font-semibold text-white">¿Qué es Peliflix?</span>
                <span className="text-2xl text-white">+</span>
              </summary>
              <div className="px-6 py-4 text-lg text-neutral-300 border-t border-neutral-700">
                <p>Peliflix es un servicio de streaming que ofrece una gran variedad de películas, series y documentales premiados en casi cualquier pantalla conectada a internet.</p>
                <p className="mt-4">Todo lo que quieras ver, sin límites ni comerciales, a un costo muy accesible. Siempre hay algo nuevo por descubrir, ¡y todas las semanas se agregan más películas y series!</p>
              </div>
            </details>

            {/* Pregunta 2 */}
            <details className="bg-neutral-900 rounded-lg overflow-hidden">
              <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-neutral-800 transition-colors duration-200">
                <span className="text-xl font-semibold text-white">¿Cuánto cuesta Peliflix?</span>
                <span className="text-2xl text-white">+</span>
              </summary>
              <div className="px-6 py-4 text-lg text-neutral-300 border-t border-neutral-700">
                <p>Disfruta Peliflix en tu smartphone, tablet, smart TV, laptop o dispositivo de streaming, todo por una tarifa plana mensual. Planes desde $ 7.199 hasta $ 15.999 al mes (sin impuestos incluidos). Sin costos adicionales ni contratos.</p>
              </div>
            </details>

            {/* Pregunta 3 */}
            <details className="bg-neutral-900 rounded-lg overflow-hidden">
              <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-neutral-800 transition-colors duration-200">
                <span className="text-xl font-semibold text-white">¿Dónde puedo ver Peliflix?</span>
                <span className="text-2xl text-white">+</span>
              </summary>
              <div className="px-6 py-4 text-lg text-neutral-300 border-t border-neutral-700">
                <p>Disfruta donde quieras, cuando quieras. Inicia sesión en tu cuenta de Netflix para ver contenido al instante...</p>
              </div>
            </details>

            {/* Pregunta 4 */}
            <details className="bg-neutral-900 rounded-lg overflow-hidden">
              <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-neutral-800 transition-colors duration-200">
                <span className="text-xl font-semibold text-white">¿Cómo cancelo?</span>
                <span className="text-2xl text-white">+</span>
              </summary>
              <div className="px-6 py-4 text-lg text-neutral-300 border-t border-neutral-700">
                <p>Peliflix es flexible. Sin contratos molestos ni compromisos. Cancela la membresía online con solo dos clics. No hay cargos por cancelación. Empieza y termina cuando quieras.</p>
              </div>
            </details>

            {/* Pregunta 5 */}
            <details className="bg-neutral-900 rounded-lg overflow-hidden">
              <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-neutral-800 transition-colors duration-200">
                <span className="text-xl font-semibold text-white">¿Qué puedo ver en Peliflix?</span>
                <span className="text-2xl text-white">+</span>
              </summary>
              <div className="px-6 py-4 text-lg text-neutral-300 border-t border-neutral-700">
                <p>Peliflix tiene un amplio catálogo de películas, series, documentales, animes, originales premiados y más. Todo lo que quieras ver, cuando quieras.</p>
              </div>
            </details>

            {/* Pregunta 6 */}
            <details className="bg-neutral-900 rounded-lg overflow-hidden">
              <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-neutral-800 transition-colors duration-200">
                <span className="text-xl font-semibold text-white">¿Es bueno Peliflix para los niños?</span>
                <span className="text-2xl text-white">+</span>
              </summary>
              <div className="px-6 py-4 text-lg text-neutral-300 border-t border-neutral-700">
                <p>La experiencia de Peliflix para niños está incluida en la membresía...</p>
              </div>
            </details>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Main;
