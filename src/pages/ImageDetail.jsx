import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DataStore } from "@aws-amplify/datastore";
import { Imagenes, Usuarios } from "../models";
import { motion, AnimatePresence } from "framer-motion";
import { AiFillHeart } from "react-icons/ai";

const ImageDetail = () => {
  const { imageId } = useParams();
  const navigate = useNavigate();

  const [currentImage, setCurrentImage] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [allImages, setAllImages] = useState([]);
  const [likedImageIds, setLikedImageIds] = useState(new Set());

  useEffect(() => {
    if (!imageId) return;

    const fetchData = async () => {
      try {
        const imageItem = await DataStore.query(Imagenes, imageId);
        if (imageItem) {
          setCurrentImage(imageItem);

          const userItem = await DataStore.query(Usuarios, imageItem.usuariosID);
          setCurrentUser(userItem);
        }

        const all = await DataStore.query(Imagenes);
        setAllImages(all);
      } catch (error) {
        console.error("Error al obtener detalles de la imagen:", error);
      }
    };

    fetchData();
  }, [imageId]);

  const handleLikeForImage = async (imgId) => {
    if (likedImageIds.has(imgId)) return;

    try {
      const original = await DataStore.query(Imagenes, imgId);
      if (!original) return;

      const updated = await DataStore.save(
        Imagenes.copyOf(original, (updatedItem) => {
          updatedItem.likes = (updatedItem.likes || 0) + 1;
        })
      );

      setLikedImageIds((prev) => new Set([...prev, imgId]));

      if (updated.id === currentImage?.id) {
        setCurrentImage(updated);
      }

      setAllImages((prevImages) =>
        prevImages.map((img) => (img.id === updated.id ? updated : img))
      );
    } catch (error) {
      console.error("Error al dar like:", error);
    }
  };

  if (!currentImage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando detalles de la imagen...</p>
      </div>
    );
  }

  const otherImages = allImages.filter((img) => img.id !== currentImage.id);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
        <motion.img
          src={currentImage.url[0]}
          alt={currentImage.description}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full md:w-1/2 max-h-[80vh] object-contain rounded-lg shadow-lg"
        />

        <div className="w-full md:w-1/2">
          <h1 className="text-xl font-bold mb-2">Descripción</h1>
          <p className="text-gray-700 mb-4">{currentImage.description}</p>

          <div className="mb-4">
            <h2 className="font-semibold">Autor:</h2>
            {currentUser ? (
              <div className="flex items-center gap-2 text-gray-700">
                {currentUser.imagenPerfil && (
                  <img
                    src={currentUser.imagenPerfil}
                    alt={`Perfil de ${currentUser.nombre}`}
                    className="w-10 h-10 object-cover rounded-full"
                  />
                )}
                <span>{currentUser.nombre}</span>
              </div>
            ) : (
              <p className="text-gray-700">Autor desconocido</p>
            )}
          </div>

          <div className="flex items-center gap-2 mb-4">
            <motion.button
              onClick={() => handleLikeForImage(currentImage.id)}
              whileTap={{ scale: 0.9 }} 
              disabled={likedImageIds.has(currentImage.id)}
              className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg
                transition-colors duration-300 focus:outline-none
                ${
                  likedImageIds.has(currentImage.id)
                    ? "bg-red-500 text-white cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                } 
                disabled:opacity-70 disabled:cursor-not-allowed
              `}
            >
              <motion.span
                animate={{
                  scale: likedImageIds.has(currentImage.id) ? [1, 1.2, 1] : 1,
                  color: likedImageIds.has(currentImage.id) ? "#fff" : "#52525b",
                }}
                transition={{ duration: 0.3 }}
              >
                <AiFillHeart size={20} />
              </motion.span>
            </motion.button>

            <span className="text-gray-700">
              {currentImage.likes || 0}{" "}
              {currentImage.likes === 1 ? "Like" : "Likes"}
            </span>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Otras publicaciones</h2>
      {otherImages.length > 0 ? (
        <div className="columns-2 sm:columns-3 md:columns-4 gap-4">
          <AnimatePresence>
            {otherImages.flatMap((img) =>
              img.url.map((singleUrl, idx) => (
                <motion.div
                  key={`${img.id}-${idx}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="mb-4 break-inside-avoid rounded-lg overflow-hidden shadow-md"
                >
                  <div
                    onClick={() => navigate(`/image/${img.id}`)}
                    className="cursor-pointer"
                  >
                    <img
                      src={singleUrl}
                      alt={img.description}
                      className="w-full h-auto"
                    />
                  </div>

                  <div className="p-2 bg-white flex items-center justify-between">
                    <p className="text-sm text-gray-500">{img.description}</p>

                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation(); 
                        handleLikeForImage(img.id);
                      }}
                      whileTap={{ scale: 0.9 }}
                      disabled={likedImageIds.has(img.id)}
                      className={`flex items-center justify-center rounded-full h-8 w-8 
                        transition-colors duration-300
                        ${
                          likedImageIds.has(img.id)
                            ? "bg-red-500 text-white cursor-not-allowed"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        } 
                        disabled:opacity-70 disabled:cursor-not-allowed
                      `}
                    >
                      <motion.span
                        animate={{
                          scale: likedImageIds.has(img.id) ? [1, 1.2, 1] : 1,
                          color: likedImageIds.has(img.id) ? "#fff" : "#52525b",
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <AiFillHeart size={16} />
                      </motion.span>
                    </motion.button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      ) : (
        <p className="text-gray-600">No hay más publicaciones.</p>
      )}
    </div>
  );
};

export default ImageDetail;