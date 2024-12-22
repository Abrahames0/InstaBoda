import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Usuarios } from '../models';
import { DataStore } from '@aws-amplify/datastore';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

const ProfileForm = () => {
  const [userName, setUserName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(null); 
  const [avatars, setAvatars] = useState([]); 
  const [currentPage, setCurrentPage] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const AVATARS_PER_PAGE = 2;

  useEffect(() => {
    const savedUser = localStorage.getItem('savedUser');
    if (savedUser) {
      navigate('/dashboard');
    }
  }, [navigate]);

  useEffect(() => {
    if (userName.trim()) {
      generateAvatars();
      setSelectedAvatar(null);
      setCurrentPage(0);
      setErrorMessage('');
    } else {
      setAvatars([]);
      setSelectedAvatar(null);
    }
  }, [userName]);

  const generateAvatars = () => {
    const totalAvatars = 25;
    const newAvatars = [];

    for (let i = 0; i < totalAvatars; i++) {
      const randomSeed = Math.random().toString(36).substring(7);
      const avatarUrl = `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(
        `${userName}-${randomSeed}`
      )}`;
      newAvatars.push(avatarUrl);
    }
    setAvatars(newAvatars);
  };

  const handleSaveUser = async () => {
    if (!userName.trim() || !selectedAvatar) {
      setErrorMessage('Por favor, completa el nombre y selecciona un avatar.');
      return;
    }

    try {
      setLoading(true);

      const savedUser = await DataStore.save(
        new Usuarios({
          nombre: userName.trim(),
          imagenPerfil: selectedAvatar,
        })
      );

      localStorage.setItem(
        'savedUser',
        JSON.stringify({
          id: savedUser.id,
          nombre: savedUser.nombre,
          imagenPerfil: savedUser.imagenPerfil,
        })
      );

      Swal.fire({
        icon: 'success',
        title: '¡Usuario guardado correctamente!',
        text: 'Ahora podrás acceder a tu perfil.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Continuar',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/dashboard');
        }
      });
    } catch (error) {
      console.error('Error al guardar el usuario:', error);
      setErrorMessage('Hubo un error al guardar el usuario. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(avatars.length / AVATARS_PER_PAGE);

  const handleNext = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev));
  };

  const handlePrev = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const startIndex = currentPage * AVATARS_PER_PAGE;
  const endIndex = startIndex + AVATARS_PER_PAGE;
  const avatarsToShow = avatars.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center animate-fadeIn">
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        className="text-gray-700 text-center text-xl mb-4"
      >
        ¡Crea tu perfil!
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        className="text-gray-700 text-center px-6 max-w-md"
      >
        Ingresa tu nombre para generar varias opciones de avatar. Selecciona tu favorito y presiona "Guardar".
      </motion.p>

      <div className="max-w-2xl w-full text-center mt-8 px-6">
        <input
          type="text"
          value={userName}
          onChange={(e) => {
            setUserName(e.target.value);
          }}
          placeholder="Nombre"
          className="w-full border border-gray-300 rounded-full py-2 px-3 focus:outline-none focus:border-[#000080] transition-all duration-300"
        />
      </div>

      {avatars.length > 0 && (
        <div className="max-w-xl w-full mt-6 px-6">
          <div className="flex justify-center items-center mb-2">
            <button
              onClick={handlePrev}
              disabled={currentPage === 0}
              className="bg-white text-gray-700 border border-gray-300 rounded-full py-1 px-3 text-sm shadow-md hover:bg-gray-100 disabled:opacity-50 mr-4"
            >
              Anterior
            </button>
            <span className="text-gray-700 font-semibold">
              Avatares {currentPage + 1} de {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages - 1}
              className="bg-white text-gray-700 border border-gray-300 rounded-full py-1 px-3 text-sm shadow-md hover:bg-gray-100 disabled:opacity-50 ml-4"
            >
              Más opciones
            </button>
          </div>

          <div className="flex justify-center gap-4 overflow-x-auto">
            {avatarsToShow.map((avatar, index) => (
              <div
                key={avatar}
                className={`relative w-32 h-32 min-w-[8rem] bg-gray-300 rounded-full border-4 hover:border-blue-500 cursor-pointer flex-shrink-0 ${
                  selectedAvatar === avatar ? 'border-blue-500' : 'border-white'
                }`}
                onClick={() => setSelectedAvatar(avatar)}
              >
                <img
                  src={avatar}
                  alt={`Avatar-${index}`}
                  className="w-full h-full rounded-full object-cover"
                />
                {selectedAvatar === avatar && (
                  <div className="absolute inset-0 flex items-center justify-center bg-blue-500 bg-opacity-20 rounded-full">
                    <span className="text-white font-bold">✓</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-2xl w-full text-center mt-6 px-6">
        <button
          onClick={handleSaveUser}
          disabled={loading}
          className="inline-block bg-[#000080] text-white py-3 px-6 rounded-full hover:bg-[#41416c] disabled:bg-gray-400 transition-transform duration-300"
        >
          {loading ? 'Guardando...' : 'Guardar perfil'}
        </button>

        {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default ProfileForm;