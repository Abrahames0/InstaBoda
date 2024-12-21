import React, { useState, useEffect } from "react";
import { DataStore } from "@aws-amplify/datastore";
import { Imagenes, Usuarios } from "../models";
import { MdAddAPhoto } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

const Dashboard = () => {
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const allImages = await DataStore.query(Imagenes);
      const allUsers = await DataStore.query(Usuarios);

      setImages(allImages);
      setFilteredImages(allImages);

      const usersWithImages = allUsers.filter((user) =>
        allImages.some((image) => image.usuariosID === user.id)
      );
      setUsers(usersWithImages);
    };

    fetchData();
  }, []);

  const handleFilter = (userId) => {
    if (userId === "all") {
      setFilteredImages(images);
      setSelectedUser(null);
    } else {
      const userImages = images.filter((image) => image.usuariosID === userId);
      setFilteredImages(userImages);
      setSelectedUser(userId);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4">
      {/* Barra Superior animada */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex items-center mb-6 overflow-x-auto space-x-4"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => (window.location.href = "/formulario")}
          className="flex-shrink-0 flex items-center justify-center w-16 h-16 bg-white text-[#000080] border border-[#4e4e91] rounded-full hover:bg-[#4e4e91] hover:text-white transition-colors duration-200 ease-in-out"
        >
          <MdAddAPhoto size={25} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleFilter("all")}
          className={`flex-shrink-0 w-16 h-16 rounded-full border-2 ${
            selectedUser === null
              ? "border-[#000080]"
              : "border-gray-300 hover:border-[#4e4e91]"
          } flex items-center justify-center text-sm font-semibold relative transition-colors`}
        >
          <span
            className={`${
              selectedUser === null ? "text-[#000080]" : "text-gray-700"
            }`}
          >
            Todos
          </span>
        </motion.button>

        {/* Íconos de usuarios con animación de hover */}
        {users.map((user) => (
          <motion.button
            key={user.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleFilter(user.id)}
            className={`flex-shrink-0 w-16 h-16 rounded-full border-2 ${
              selectedUser === user.id
                ? "border-[#000080] hover:border-[#000080]"
                : "border-gray-300 hover:border-[#4e4e91]"
            } flex items-center justify-center relative overflow-hidden transition-colors`}
          >
            {user.imagenPerfil ? (
              <img
                title={user.nombre}
                src={user.imagenPerfil}
                alt={user.nombre}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <span
                className={`${
                  selectedUser === user.id ? "text-[#000080]" : "text-gray-700"
                } font-semibold`}
              >
                {user.nombre.charAt(0).toUpperCase()}
              </span>
            )}
          </motion.button>
        ))}
      </motion.div>

      {/* Sección para mostrar imágenes */}
      {filteredImages.length > 0 ? (
        <div className="columns-2 sm:columns-3 md:columns-4 gap-4">
          <AnimatePresence>
            {filteredImages.flatMap((image) =>
              image.url.map((singleUrl, idx) => (
                <motion.div
                  key={`${image.id}-${idx}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="mb-4 break-inside-avoid items-center rounded-lg overflow-hidden shadow-md"
                >
                  <img
                    src={singleUrl}
                    alt={image.description}
                    className="w-full h-auto"
                  />
                  <div className="p-2 bg-white">
                    <p className="text-sm text-gray-500">{image.description}</p>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col items-center justify-center mt-20"
        >
          <p className="text-gray-600 mb-4">No hay publicaciones disponibles.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => (window.location.href = "/formulario")}
            className="px-4 py-2 bg-[#000080] text-white rounded-full hover:bg-[#4e4e91] transition-colors duration-200 ease-in-out"
          >
            Agregar una nueva publicación
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;