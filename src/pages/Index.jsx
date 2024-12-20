import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Usuarios } from '../models';
import { DataStore } from '@aws-amplify/datastore';
import { motion } from 'framer-motion';

const ProfileForm = () => {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('savedUser');
    if (savedUser) {
      navigate('/dashboard');
    }
  }, [navigate]);

  // Regenera el avatar cada vez que cambia el nombre
  useEffect(() => {
    if (userName.trim()) {
      setAvatarUrl(
        `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(userName)}`
      );
      setErrorMessage('');
    } else {
      setAvatarUrl(null);
    }
  }, [userName]);

  // Guardar el usuario
  const handleSaveUser = async () => {
    if (!userName.trim() || !avatarUrl) {
      setErrorMessage('Por favor, completa el nombre y genera un avatar.');
      return;
    }

    try {
      setLoading(true);

      const savedUser = await DataStore.save(
        new Usuarios({
          nombre: userName.trim(),
          imagenPerfil: avatarUrl,
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

      alert('Usuario guardado correctamente.');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error al guardar el usuario:', error);
      setErrorMessage('Hubo un error al guardar el usuario. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center animate-fadeIn">
      {/* Contenedor del avatar */}
      <div className="relative">
        <div
          className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center border-4 border-white shadow-md"
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Avatar generado"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-gray-500 text-xl">🎨</span>
          )}
        </div>
      </div>

      {/* Instrucciones sutiles y prácticas */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        className="text-gray-700 text-center mt-6 px-6 max-w-md"
      >
        Ingrese su nombre para generar un avatar y luego presione "Guardar" para continuar.
      </motion.p>

      {/* Formulario */}
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

        <button
          onClick={handleSaveUser}
          disabled={loading}
          className="inline-block bg-[#000080] text-white py-3 px-6 rounded-full hover:bg-[#41416c] mt-6 disabled:bg-gray-400 transition-transform duration-300"
        >
          {loading ? 'Guardando...' : 'Guardar'}
        </button>

        {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default ProfileForm;
