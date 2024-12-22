import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    setTimeout(() => {
      navigate('/nuevo-usuario');
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden font-normal"
      style={{
        background: 'linear-gradient(135deg, #000080 0%, #0A0A3F 100%)',
      }}
    >
      <div
        className="absolute w-[400px] h-[400px] rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(247,231,206,0.15) 0%, rgba(247,231,206,0.05) 100%)',
          pointerEvents: 'none',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)'
        }}
      />

      <div className="z-10 flex flex-col items-center px-4 text-center">
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ color: '#F7E7CE' }}
          className="text-4xl md:text-5xl font-bold mb-4"
        >
          ¡Gracias por acompañarnos en nuestro gran día!
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
          style={{ color: '#F7E7CE' }}
          className="text-lg md:text-xl max-w-xl mb-8 leading-relaxed"
        >
          Hemos creado esta página para que compartas tus fotos y experiencias de la boda.
          ¡Nos encantará revivir cada momento a través de tus imágenes!
        </motion.p>
        
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 0 10px rgba(247,231,206,0.4)" }}
          whileTap={{ scale: 0.98 }}
          onClick={handleClick}
          className="px-8 py-3 rounded-full font-semibold transition-transform duration-200"
          style={{
            backgroundColor: '#F7E7CE',
            color: '#000080'
          }}
        >
          Continuar
        </motion.button>
      </div>

      {/* Animación de carga elegante con puntos suspensivos */}
      <AnimatePresence>
        {isAnimating && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50"
            style={{ backgroundColor: '#F7E7CE' }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-center"
              style={{ color: '#000080' }}
            >
              <div className="text-xl font-medium">
                Cargando
                {/* Tres puntos animados sutilmente */}
                <motion.span
                  className="inline-block"
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0 }}
                >.</motion.span>
                <motion.span
                  className="inline-block"
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                >.</motion.span>
                <motion.span
                  className="inline-block"
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                >.</motion.span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Welcome;
