import React, { useState, useEffect } from "react";
import { DataStore } from "@aws-amplify/datastore";
import { Imagenes, Usuarios } from "../models";

const Dashboard = () => {
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  // Cargar usuarios e imágenes al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      const allImages = await DataStore.query(Imagenes);
      const allUsers = await DataStore.query(Usuarios);

      setImages(allImages);
      setFilteredImages(allImages);

      // Asegúrate de que solo se muestran usuarios que tienen imágenes relacionadas
      const usersWithImages = allUsers.filter((user) =>
        allImages.some((image) => image.usuariosID === user.id)
      );
      setUsers(usersWithImages);
    };

    fetchData();
  }, []);

  // Manejar filtro de imágenes por usuario
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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        {/* Botón de registro */}
        <button
          onClick={() => window.location.href = "/register"}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-800"
        >
          Ir al Registro
        </button>

        {/* Botones de usuarios */}
        <div className="flex gap-2">
          {/* Botón para mostrar todas las imágenes */}
          <button
            onClick={() => handleFilter("all")}
            className={`px-4 py-2 rounded-full ${
              selectedUser === null
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Todos
          </button>

          {/* Botones para cada usuario */}
          {users.map((user) => (
            <button
              key={user.id}
              onClick={() => handleFilter(user.id)}
              className={`w-10 h-10 rounded-full border-2 ${
                selectedUser === user.id
                  ? "border-blue-600"
                  : "border-gray-300 hover:border-blue-400"
              } flex items-center justify-center text-sm font-semibold relative`}
            >
              {/* Imagen de perfil */}
              {user.imagenPerfil ? (
                <img
                  title={user.nombre}
                  src={user.imagenPerfil}
                  alt={user.nombre}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                /* Inicial del nombre si no hay imagen de perfil */
                <span className="text-blue-600">
                  {user.nombre.charAt(0).toUpperCase()}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Galería de imágenes */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filteredImages.map((image) => (
          <div key={image.id} className="rounded-lg overflow-hidden shadow-md">
            <img
              src={image.url}
              alt={image.description}
              className="w-full h-48 object-cover"
            />
            <div className="p-2 bg-white">
              <p className="text-sm text-gray-600">{image.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
