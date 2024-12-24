import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { DataStore } from "@aws-amplify/datastore";
import { Imagenes } from "../models";
import { uploadData } from "@aws-amplify/storage";
import { FcUpload } from "react-icons/fc";
import Swal from "sweetalert2";

const AddPublication = () => {
  const fileInput = useRef(null);
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isExiting, setIsExiting] = useState(false);

  const navigate = useNavigate();

  const triggerFileInput = () => {
    fileInput.current.click();
  };

  const handleFileInput = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles);

    const urls = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const uploadImages = async () => {
    if (!files.length) {
      alert("Por favor, selecciona imágenes para subir.");
      return;
    }

    const savedUser = localStorage.getItem("savedUser");
    if (!savedUser) {
      alert("No hay un usuario activo. Por favor, inicia sesión o regístrate.");
      return;
    }
    const { id: usuarioID } = JSON.parse(savedUser);

    try {
      setLoading(true);

      const uploadedUrls = await Promise.all(
        files.map(async (file, index) => {
          const filename = `public/${Date.now()}-${index}-${file.name}`;

          const result = await uploadData({
            path: filename,
            data: file,
            options: {
              contentType: file.type,
              onProgress: ({ transferredBytes, totalBytes }) => {
                if (totalBytes) {
                  console.log(
                    `Subida de ${file.name}: ${Math.round(
                      (transferredBytes / totalBytes) * 100
                    )}%`
                  );
                }
              },
            },
          }).result;

          return `https://instaboda-storage-9f7968d5beb46-staging.s3.us-east-1.amazonaws.com/${result.path}`;
        })
      );

      await DataStore.save(
        new Imagenes({
          url: uploadedUrls,
          description,
          likes: 0,
          usuariosID: usuarioID,
        })
      );

    Swal.fire({
      icon: "success",
      title: "¡Imágenes subidas exitosamente!",
      text: "Gracias por compartirnos tu experiencia, y ser parte de nuestro evento.",
      confirmButtonText: "ver publicaciones",
      confirmButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        setIsExiting(true);
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      }
    });
  } catch (error) {
    console.error("Error al subir imágenes:", error);

    Swal.fire({
      icon: "error",
      title: "Error al subir las imágenes",
      text: "Hubo un problema. Por favor, inténtalo de nuevo.",
    });
  } finally {
    setLoading(false);
  }
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4"
      animate={isExiting ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <h1 className="text-2xl font-bold mb-3">Agregar Publicación</h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        className="text-gray-700 text-center px-6  mb-6 max-w-md">
        Ingresa las imagenes que quieres publicar y agregale una descripción.
      </motion.p>
      <div
        className="w-full max-w-lg p-4 border border-gray-300 rounded-2xl flex items-center justify-center cursor-pointer mb-4 hover:border-blue-500"
        onClick={triggerFileInput}
      >
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInput}
          onChange={handleFileInput}
          multiple
        />
        <div className="flex flex-col items-center">
          <FcUpload size={28} />
          <span className="text-gray-700">
            Agrega las imágenes{" "}
            {files.length > 0 && <span>({files.length} seleccionadas)</span>}
          </span>
        </div>
      </div>

      {previewUrls.length > 0 && (
        <div className="w-full max-w-lg grid grid-cols-3 gap-2 mb-6">
          {previewUrls.map((url, index) => (
            <img key={index} src={url} alt={`Preview ${index}`} className="w-full h-24 object-cover rounded-lg"/>
          ))}
        </div>
      )}

      <div className="w-full max-w-lg mb-6">
        <label htmlFor="description" className="block text-lg font-semibold mb-2">
          Descripción
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Agrega una descripción"
          className="w-full h-24 border border-gray-300 rounded-2xl p-2 focus:outline-none focus:border-blue-500"
        ></textarea>
      </div>

      <button
        className="w-full max-w-lg bg-blue-800 text-white py-3 rounded-2xl hover:bg-blue-900 disabled:bg-gray-400"
        onClick={uploadImages}
        disabled={loading}
      >
        {loading ? "Subiendo..." : "Agregar Fotografías"}
      </button>
    </motion.div>
  );
};

export default AddPublication;