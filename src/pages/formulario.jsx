import React, { useRef, useState } from "react";
import { DataStore } from "@aws-amplify/datastore";
import { Imagenes } from "../models";
import { uploadData } from "@aws-amplify/storage";
import { FcCamera, FcUpload } from "react-icons/fc";

const AddPublication = () => {
  const fileInput = useRef(null);
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);

  // Abrir selector de archivos
  const triggerFileInput = () => {
    fileInput.current.click();
  };

  // Manejar selección de archivos
  const handleFileInput = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles);

    // Generar URLs para vista previa
    const urls = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  // Abrir cámara (próximamente)
  const openCamera = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("La cámara no está disponible en este dispositivo.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      alert("Cámara activada. Implementar captura en el futuro.");
      stream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      console.error("Error al abrir la cámara:", error);
      alert("No se pudo acceder a la cámara.");
    }
  };

  // Subir imágenes y guardar en DataStore
  const uploadImages = async () => {
    if (!files.length || !description) {
      alert("Por favor, selecciona imágenes y agrega una descripción.");
      return;
    }

    try {
      setLoading(true);

      const uploadedImages = await Promise.all(
        files.map(async (file, index) => {
          const blob = file;

          const filename = `imagen-${Date.now()}-${index}.jpg`;

          const result = await uploadData({
            key: filename,
            data: blob,
          }).result;

          // Generar URL pública
          return `https://stayfinder-storage-771fbe21d527c-dev.s3.us-east-1.amazonaws.com/public/${result.key}`;
        })
      );

      // Guardar URLs y descripción en DataStore
      for (const url of uploadedImages) {
        await DataStore.save(
          new Imagenes({
            url,
            description,
          })
        );
      }

      alert("Imágenes subidas exitosamente.");
      setFiles([]);
      setPreviewUrls([]);
      setDescription("");
    } catch (error) {
      console.error("Error al subir imágenes:", error);
      alert("Hubo un error al subir las imágenes. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-6">Agregar Publicación</h1>

      {/* Botón para subir imágenes */}
      <div className="w-full max-w-lg p-4 border border-gray-300 rounded-2xl flex items-center justify-center cursor-pointer mb-4 hover:border-blue-500"
        onClick={triggerFileInput}
      >
        <input type="file" accept="image/*"  className="hidden" ref={fileInput} onChange={handleFileInput} multiple/>
        <div className="flex flex-col items-center">
          <i className="fa-solid fa-upload text-xl text-gray-500"></i>
          <FcUpload  size={28}/>
          <span className="text-gray-700">
            Agrega las imágenes 
            {files.length > 0 && <span>({files.length} seleccionadas)</span>}
          </span>
        </div>
      </div>

      <div
        className="w-full max-w-lg p-4 border border-gray-300 rounded-2xl flex items-center justify-center cursor-pointer mb-4 hover:border-blue-500"
        onClick={openCamera}
      >
        <div className="flex flex-col items-center">
          <i className="fa-solid fa-camera text-xl text-gray-500"></i>
          <FcCamera size={28}/>
          <span className="text-gray-700">Tomar una foto</span>
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
        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Agrega una descripción"
          className="w-full h-24 border border-gray-300 rounded-2xl p-2 focus:outline-none focus:border-blue-500"
        ></textarea>
      </div>
      <button className="w-full max-w-lg bg-blue-800 text-white py-3 rounded-2xl hover:bg-blue-900" onClick={uploadImages} disabled={loading}>
        {loading ? "Subiendo..." : "Agregar Fotografías"}
      </button>
    </div>
  );
};

export default AddPublication;
