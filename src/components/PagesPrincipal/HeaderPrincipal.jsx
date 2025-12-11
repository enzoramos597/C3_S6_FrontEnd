import { useState } from 'react';
//import logo from '../assets/Logo_2.png';
import logo from '../../assets/Logo_2.png';
import { useNavigate } from 'react-router-dom';

const HeaderPrincipal
 = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
        
    };

    return (
        // Asegura que el navbar tenga un z-index alto para estar siempre arriba
        <nav className="w-full bg-black/90 text-white relative z-50">
            {/* View Desktop */}
            <div className='flex justify-between items-center sm:px-12 sm:py-3 px-4 py-2'>
                {/**LOGO */}
                <div className='flex items-center gap-2 cursor-pointer' onClick={()=>navigate(`/`)}>
                    <img
                        src={logo}
                        alt="LogoJS"
                        className='w-[120px] p-0.5 '
                    />
                    <p className='text-white font-bold font-size-3xl'></p>
                </div>
                {/**FIN LOGO */}

                {/**BURGER BUTTON */}
                <button
                    //z-index para asegurar que el botón esté por encima de cualquier cosa que pudiera superponerse
                    className='md:hidden text-white p-2 cursor-pointer z-50'
                    onClick={toggleMenu}
                >
                    <svg
                        className='w-6 h-6'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                    >
                        {
                            isOpen ? (
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M6 18L18 6M6 6l12 12' //X Icon
                                />
                            )
                                : (
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth={2}
                                        d='M4 6h16M4 12h16M4 18h16' //burger Icon
                                    />
                                )
                        }
                    </svg>
                </button>
                {/* FIN BURGER BUTTON */}

                {/* NAVEGACIÓN LINKS DESKTOP */}
                <div className='hidden md:block'>
                    <ul className='flex space-x-4 px-4'>
                       
                    </ul>
                </div>
                {/* FIN NAVEGACIÓN LINKS DESKTOP */}

                {/* NAVEGACIÓN SOCIAL DESKTOP */}
                <div 
                    className='hidden md:block'
                    onClick={()=>navigate(`/iniciar-sesion`)}
                >
                    <div className="px-4 py-2 bg-red-700 hover:bg-red-300 text-white rounded font-bold">
                        Iniciar Sesión
                    </div>                    
                </div>
                {/* FIN NAVEGACIÓN LINKS DESKTOP */}
            </div>

            {/* ----------------VISTA MOBILE ----------- */}            
            <div
                className={`md:hidden absolute top-[70px] left-0 w-full bg-black/90 transition-all duration-300 ease-in-out z-40 ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
            >
                {/* VISTA MOBILE LINKS */}
                <ul className='flex flex-col px-4 '>
                    
                </ul>

                {/* VISTA MOBILE SOCIAL */}
                <ul className="flex space-x-4 px-4 py-2 border-t border-red-400 justify-center">
                   <button 
                   onClick={()=>navigate(`/iniciar-sesion`)}
                   className="px-4 py-2 bg-red-700 hover:bg-red-300 text-white rounded text-center font-bold">
                        Iniciar Sesión
                   </button>
                   
                </ul>
            </div>
            {/* FIN VISTA MOBILE */}
        </nav>
    );
};

export default HeaderPrincipal;