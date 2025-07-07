import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../../../../Styles/SectbodyAdmin.css"; // Asegúrate que esta ruta CSS sea correcta

export const SectbodyAdmin = () => {
  const navigate = useNavigate();
  // CAMBIO: activeTab inicializado en "discotecas"
  const [activeTab, setActiveTab] = useState("discotecas");
  const [currentAdmin, setCurrentAdmin] = useState(null);

  // ESTADO PARA CONTROLAR LA VISIBILIDAD DE LA SIDEBAR EN MÓVILES
  const [isSidebarActive, setIsSidebarActive] = useState(false);

  // Define la URL base de tu backend desplegado en Railway
  const BASE_URL = 'https://backendnight-production.up.railway.app';

  // Discotecas
  const [discotecas, setDiscotecas] = useState([]);
  const [loadingDisco, setLoadingDisco] = useState(false);
  const [errorDisco, setErrorDisco] = useState(null);

  // Eventos
  const [eventos, setEventos] = useState([]);
  const [loadingEventos, setLoadingEventos] = useState(false);
  const [errorEventos, setErrorEventos] = useState(null);

  // Reservas
  const [reservas, setReservas] = useState([]);
  const [loadingReservas, setLoadingReservas] = useState(false);
  const [errorReservas, setErrorReservas] = useState(null);

  // Helper para obtener el token del admin logueado
  const getToken = () => {
    const storedUser = localStorage.getItem("currentAdmin");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      console.log("getToken: Parsed user from localStorage:", parsedUser); // Debug
      return parsedUser.token;
    }
    console.log("getToken: No user found in localStorage."); // Debug
    return null;
  };

  // Helper para obtener los encabezados de autorización
  const getAuthHeaders = () => {
    const token = getToken();
    if (token) {
      console.log("getAuthHeaders: Sending token:", token); // Debug
      return {
        Authorization: `Bearer ${token}`,
      };
    }
    console.log("getAuthHeaders: No token available, sending empty headers."); // Debug
    return {};
  };

  // Función para manejar el logout
  const handleLogout = () => {
    localStorage.removeItem("currentAdmin");
    setCurrentAdmin(null);
    navigate("/login"); // Redirige al login
  };

  // EFECTO PARA CARGAR DATOS AL CAMBIAR DE PESTAÑA O AL INICIAR
  useEffect(() => {
    // Cargar el admin actual desde localStorage
    const storedAdmin = localStorage.getItem("currentAdmin");
    if (storedAdmin) {
      setCurrentAdmin(JSON.parse(storedAdmin));
    } else {
      // Si no hay admin logueado, redirigir
      navigate("/login");
    }

    // Cargar datos según la pestaña activa
    // Se elimina la lógica para 'perfil'
    if (activeTab === "discotecas") {
      fetchDiscotecas();
    } else if (activeTab === "eventos") {
      fetchEventos();
    } else if (activeTab === "reservas") {
      fetchReservas();
    }
  }, [activeTab, navigate]); // Dependencias: activeTab y navigate

  // EFECTO PARA CERRAR LA SIDEBAR SI LA VENTANA SE AGRANDA
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isSidebarActive) {
        setIsSidebarActive(false); // Cierra la sidebar si es de escritorio
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarActive]);

  // Función para alternar la visibilidad de la sidebar
  const toggleSidebar = () => {
    setIsSidebarActive(!isSidebarActive);
  };

  // --- DISCOTECAS CRUD ---
  const fetchDiscotecas = async () => {
    setLoadingDisco(true);
    setErrorDisco(null);
    try {
      const response = await fetch(`${BASE_URL}/servicio/admin/discotecas`, {
        headers: getAuthHeaders(),
      });

      if (response.status === 401 || response.status === 403) {
        Swal.fire({
          imageUrl: '/logitotriste.png',
          imageWidth: 130,
          imageHeight: 130,
          background: '#000',
          color: '#fff',
          title: "Error",
          text: "No autorizado. Por favor, inicia sesión de nuevo.",
        });
        handleLogout();
        return;
      }
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al obtener discotecas: ${response.status} ${response.statusText} - ${errorText}`);
      }
      const data = await response.json();
      setDiscotecas(data);
    } catch (err) {
      console.error("Error fetching discotecas:", err);
      Swal.fire({
        imageUrl: '/logitotriste.png',
        imageWidth: 130,
        imageHeight: 130,
        background: '#000',
        color: '#fff',
        title: "Error",
        text: err.message || "Hubo un error al cargar las discotecas.",
      });
      setErrorDisco(err.message);
    } finally {
      setLoadingDisco(false);
    }
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const addDiscoteca = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Añadir Discoteca",
      html:
        '<input id="swal-input1" class="swal2-input" placeholder="NIT">' +
        '<input id="swal-input2" class="swal2-input" placeholder="Nombre">' +
        '<input id="swal-input3" class="swal2-input" placeholder="Ubicación">' +
        '<input id="swal-input4" class="swal2-input" type="number" placeholder="Capacidad">' +
        '<input id="swal-input5" class="swal2-input" type="time" placeholder="Horario">' +
        '<input id="swal-input6" type="file" accept="image/*" class="swal2-file">',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      preConfirm: async () => {
        const nit = document.getElementById("swal-input1").value.trim();
        const nombre = document.getElementById("swal-input2").value.trim();
        const ubicacion = document.getElementById("swal-input3").value.trim();
        const capacidad = document.getElementById("swal-input4").value.trim();
        const horario = document.getElementById("swal-input5").value.trim();
        const fileInput = document.getElementById("swal-input6");
        const imagenArchivo = fileInput.files[0];

        if (!nit || !nombre || !ubicacion || !capacidad || !horario) {
          Swal.showValidationMessage("Completa todos los campos");
          return;
        }
        let imagenBase64 = null;
        if (imagenArchivo) {
          imagenBase64 = await toBase64(imagenArchivo);
        }
        return {
          nit: Number(nit),
          nombre,
          ubicacion,
          capacidad: Number(capacidad),
          horario,
          imagen: imagenBase64,
        };
      },
    });

    if (formValues) {
      try {
        const response = await fetch(`${BASE_URL}/servicio/guardar`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify(formValues),
        });
        if (response.status === 401 || response.status === 403) {
          Swal.fire({
            imageUrl: '/logitotriste.png',
            imageWidth: 130,
            imageHeight: 130,
            background: '#000',
            color: '#fff',
            title: "Error",
            text: "No autorizado. Por favor, inicia sesión de nuevo.",
          });
          handleLogout();
          return;
        }
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`No se pudo añadir la discoteca: ${response.status} ${response.statusText} - ${errorText}`);
        }
        const nuevo = await response.json();
        setDiscotecas([...discotecas, nuevo]);
        Swal.fire({
          imageUrl: '/logitonegro.png',
          imageWidth: 130,
          imageHeight: 130,
          background: '#000',
          color: '#fff',
          title: "¡Guardado!",
          text: "Discoteca añadida correctamente",
        });
      } catch (err) {
        console.error("Error adding discoteca:", err);
        Swal.fire({
          imageUrl: '/logitotriste.png',
          imageWidth: 130,
          imageHeight: 130,
          background: '#000',
          color: '#fff',
          title: "Error",
          text: err.message || "Hubo un error al añadir la discoteca.",
        });
      }
    }
  };

  const deleteDiscoteca = async (nit) => {
    const result = await Swal.fire({
      title: "Confirmar eliminación",
      text: "¿Estás seguro de eliminar esta discoteca?",
      imageUrl: '/logitopensativo.webp',
      imageWidth: 130,
      imageHeight: 130,
      background: '#000',
      color: '#fff',
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `${BASE_URL}/servicio/eliminar/${nit}`,
          {
            method: "DELETE",
            headers: getAuthHeaders(),
          }
        );
        if (response.status === 401 || response.status === 403) {
          Swal.fire({
            imageUrl: '/logitotriste.png',
            imageWidth: 130,
            imageHeight: 130,
            background: '#000',
            color: '#fff',
            title: "Error",
            text: "No autorizado. Por favor, inicia sesión de nuevo.",
          });
          handleLogout();
          return;
        }

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`No se pudo eliminar la discoteca: ${response.status} ${response.statusText} - ${errorText}`);
        }
        setDiscotecas(discotecas.filter((d) => d.nit !== nit));
        Swal.fire({
          imageUrl: '/logitonegro.png',
          imageWidth: 130,
          imageHeight: 130,
          background: '#000',
          color: '#fff',
          title: "Eliminado",
          text: "La discoteca ha sido eliminada",
        });
      } catch (err) {
        console.error("Error deleting discoteca:", err);
        Swal.fire({
          imageUrl: '/logitotriste.png',
          imageWidth: 130,
          imageHeight: 130,
          background: '#000',
          color: '#fff',
          title: "Error",
          text: err.message || "Hubo un error al eliminar la discoteca.",
        });
      }
    }
  };

  const updateDiscoteca = async (discotecaData) => {
    const { value: formValues } = await Swal.fire({
      title: "Actualizar Discoteca",
      html: `
        <input id="swal-input1" class="swal2-input" placeholder="NIT" value="${discotecaData.nit}" disabled>
        <input id="swal-input2" class="swal2-input" placeholder="Nombre" value="${discotecaData.nombre}">
        <input id="swal-input3" class="swal2-input" placeholder="Ubicación" value="${discotecaData.ubicacion}">
        <input id="swal-input4" class="swal2-input" type="number" placeholder="Capacidad" value="${discotecaData.capacidad}">
        <input id="swal-input5" class="swal2-input" type= "time"placeholder="Horario" value="${discotecaData.horario}">
        <input id="swal-input6" type="file" accept="image/*" class="swal2-file">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Actualizar",
      cancelButtonText: "Cancelar",
      preConfirm: async () => {
        const nombre = document.getElementById("swal-input2").value.trim();
        const ubicacion = document.getElementById("swal-input3").value.trim();
        const capacidad = document.getElementById("swal-input4").value.trim();
        const horario = document.getElementById("swal-input5").value.trim();
        const fileInput = document.getElementById("swal-input6");
        const imagenArchivo = fileInput.files[0];

        if (!nombre || !ubicacion || !capacidad || !horario) {
          Swal.showValidationMessage("Completa todos los campos");
          return;
        }
        let imagenBase64 = null;
        if (imagenArchivo) {
          imagenBase64 = await toBase64(imagenArchivo);
        }
        return {
          nit: discotecaData.nit,
          nombre,
          ubicacion,
          capacidad: Number(capacidad),
          horario,
          imagen: imagenBase64,
        };
      },
    });

    if (formValues) {
      try {
        const response = await fetch(
          `${BASE_URL}/servicio/actualizar/${discotecaData.nit}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              ...getAuthHeaders(),
            },
            body: JSON.stringify(formValues),
          }
        );
        if (response.status === 401 || response.status === 403) {
          Swal.fire({
            imageUrl: '/logitotriste.png',
            imageWidth: 130,
            imageHeight: 130,
            background: '#000',
            color: '#fff',
            title: "Error",
            text: "No autorizado. Por favor, inicia sesión de nuevo.",
          });
          handleLogout();
          return;
        }
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`No se pudo actualizar la discoteca: ${response.status} ${response.statusText} - ${errorText}`);
        }
        const updated = await response.json();
        setDiscotecas(
          discotecas.map((d) => (d.nit === discotecaData.nit ? updated : d))
        );
        Swal.fire({
          imageUrl: '/logitonegro.png',
          imageWidth: 130,
          imageHeight: 130,
          background: '#000',
          color: '#fff',
          title: "Actualizado",
          text: "Discoteca actualizada correctamente",
        });
      } catch (err) {
        console.error("Error updating discoteca:", err);
        Swal.fire({
          imageUrl: '/logitotriste.png',
          imageWidth: 130,
          imageHeight: 130,
          background: '#000',
          color: '#fff',
          title: "Error",
          text: err.message || "Hubo un error al actualizar la discoteca.",
        });
      }
    }
  };

  // --- EVENTOS CRUD ---
  const addEvento = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Añadir Evento",
      html:
        '<input id="swal-input1" class="swal2-input" placeholder="NIT Discoteca">' +
        '<input id="swal-input2" class="swal2-input" placeholder="Nombre del evento">' +
        '<input id="swal-input3" class="swal2-input" type="date" placeholder="Fecha (YYYY-MM-DD)">' +
        '<input id="swal-input4" class="swal2-input" type="time" placeholder="Hora (HH:MM)">' +
        '<input id="swal-input5" class="swal2-input" placeholder="Descripción">' +
        '<input id="swal-input6" class="swal2-input" type="number" placeholder="Precio">' + // Nuevo campo de precio
        '<input id="swal-input7" type="file" accept="image/*" class="swal2-file">', // Nuevo campo de imagen
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      preConfirm: async () => { // Cambiado a async
        const nitDiscoteca = document.getElementById("swal-input1").value.trim();
        const nombreEvento = document.getElementById("swal-input2").value.trim();
        const fecha = document.getElementById("swal-input3").value.trim();
        const hora = document.getElementById("swal-input4").value.trim();
        const descripcion = document.getElementById("swal-input5").value.trim();
        const precio = document.getElementById("swal-input6").value.trim(); // Obtener precio
        const fileInput = document.getElementById("swal-input7"); // Obtener input de imagen
        const imagenArchivo = fileInput.files[0];

        if (!nitDiscoteca || !nombreEvento || !fecha || !hora || !descripcion || !precio) {
          Swal.showValidationMessage("Completa todos los campos");
          return;
        }

        let imagenBase64 = null;
        if (imagenArchivo) {
          imagenBase64 = await toBase64(imagenArchivo);
        }

        return {
          discoteca: { nit: Number(nitDiscoteca) },
          nombreEvento,
          fecha,
          hora,
          descripcion,
          precio: Number(precio), // Convertir a número
          imagen: imagenBase64 // Añadir imagen al retorno
        };
      },
    });

    if (formValues) {
      try {
        const response = await fetch(`${BASE_URL}/servicio/guardar-evento`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify(formValues),
        });
        if (response.status === 401 || response.status === 403) {
          Swal.fire({
            imageUrl: '/logitotriste.png',
            imageWidth: 130,
            imageHeight: 130,
            background: '#000',
            color: '#fff',
            title: "Error",
            text: "No autorizado. Por favor, inicia sesión de nuevo.",
          });
          handleLogout();
          return;
        }
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`No se pudo añadir el evento: ${response.status} ${response.statusText} - ${errorText}`);
        }
        const nuevo = await response.json();
        setEventos([...eventos, nuevo]);
        Swal.fire({
          imageUrl: '/logitonegro.png',
          imageWidth: 130,
          imageHeight: 130,
          background: '#000',
          color: '#fff',
          title: "¡Guardado!",
          text: "Evento añadido correctamente",
        });

        console.log("SectbodyAdmin: Despachando evento 'newEventAdded' con detalle:", { eventName: nuevo.nombreEvento });
        window.dispatchEvent(new CustomEvent('newEventAdded', {
          detail: { eventName: nuevo.nombreEvento }
        }));

      } catch (err) {
        console.error("Error adding evento:", err);
        Swal.fire({
          imageUrl: '/logitotriste.png',
          imageWidth: 130,
          imageHeight: 130,
          background: '#000',
          color: '#fff',
          title: "Error",
          text: err.message || "Hubo un error al añadir el evento.",
        });
      }
    }
  };

  const updateEvento = async (eventoData) => {
    const { value: formValues } = await Swal.fire({
      title: "Actualizar Evento",
      html: `
        <input id="swal-input1" class="swal2-input" placeholder="NIT Discoteca" value="${eventoData.discoteca?.nit || ""}">
        <input id="swal-input2" class="swal2-input" placeholder="Nombre del evento" value="${eventoData.nombreEvento}">
        <input id="swal-input3" class="swal2-input" type="date" placeholder="Fecha (YYYY-MM-DD)" value="${eventoData.fecha}">
        <input id="swal-input4" class="swal2-input" type="time" placeholder="Hora (HH:MM)" value="${eventoData.hora}">
        <input id="swal-input5" class="swal2-input" placeholder="Descripción" value="${eventoData.descripcion}">
        <input id="swal-input6" class="swal2-input" type="number" placeholder="Precio" value="${eventoData.precio || ''}">
        <input id="swal-input7" type="file" accept="image/*" class="swal2-file">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Actualizar",
      cancelButtonText: "Cancelar",
      preConfirm: async () => { // Cambiado a async
        const nitDiscoteca = document.getElementById("swal-input1").value.trim();
        const nombreEvento = document.getElementById("swal-input2").value.trim();
        const fecha = document.getElementById("swal-input3").value.trim();
        const hora = document.getElementById("swal-input4").value.trim();
        const descripcion = document.getElementById("swal-input5").value.trim();
        const precio = document.getElementById("swal-input6").value.trim();
        const fileInput = document.getElementById("swal-input7");
        const imagenArchivo = fileInput.files[0];

        if (!nitDiscoteca || !nombreEvento || !fecha || !hora || !descripcion || !precio) {
          Swal.showValidationMessage("Completa todos los campos");
          return;
        }

        let imagenBase64 = null;
        if (imagenArchivo) {
          imagenBase64 = await toBase64(imagenArchivo);
        }

        return {
          idEvento: eventoData.idEvento,
          discoteca: { nit: Number(nitDiscoteca) },
          nombreEvento,
          fecha,
          hora,
          descripcion,
          precio: Number(precio),
          imagen: imagenBase64 // Añadir imagen al retorno
        };
      },
    });

    if (formValues) {
      try {
        const response = await fetch(
          `${BASE_URL}/servicio/actualizar-evento`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              ...getAuthHeaders(),
            },
            body: JSON.stringify(formValues),
          }
        );
        if (response.status === 401 || response.status === 403) {
          Swal.fire({
            imageUrl: '/logitotriste.png',
            imageWidth: 130,
            imageHeight: 130,
            background: '#000',
            color: '#fff',
            title: "Error",
            text: "No autorizado. Por favor, inicia sesión de nuevo.",
          });
          handleLogout();
          return;
        }
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`No se pudo actualizar el evento: ${response.status} ${response.statusText} - ${errorText}`);
        }
        const updated = await response.json();
        setEventos(
          eventos.map((e) =>
            (e.idEvento || e.id) === (formValues.idEvento || formValues.id) ? updated : e
          )
        );
        Swal.fire({
          imageUrl: '/logitonegro.png',
          imageWidth: 130,
          imageHeight: 130,
          background: '#000',
          color: '#fff',
          title: "Actualizado",
          text: "Evento actualizado correctamente",
        });
      } catch (err) {
        console.error("Error updating evento:", err);
        Swal.fire({
          imageUrl: '/logitotriste.png',
          imageWidth: 130,
          imageHeight: 130,
          background: '#000',
          color: '#fff',
          title: "Error",
          text: err.message || "Hubo un error al actualizar el evento.",
        });
      }
    }
  };

  const deleteEvento = async (idEvento) => {
    const result = await Swal.fire({
      title: "Confirmar eliminación",
      text: "¿Estás seguro de eliminar este evento?",
      imageUrl: '/logitopensativo.webp',
      imageWidth: 130,
      imageHeight: 130,
      background: '#000',
      color: '#fff',
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `${BASE_URL}/servicio/eliminar-evento/${idEvento}`,
          {
            method: "DELETE",
            headers: getAuthHeaders(),
          }
        );
        if (response.status === 401 || response.status === 403) {
          Swal.fire({
            imageUrl: '/logitotriste.png',
            imageWidth: 130,
            imageHeight: 130,
            background: '#000',
            color: '#fff',
            title: "Error",
            text: "No autorizado. Por favor, inicia sesión de nuevo.",
          });
          handleLogout();
          return;
        }
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`No se pudo eliminar el evento: ${response.status} ${response.statusText} - ${errorText}`);
        }
        setEventos(eventos.filter((e) => (e.idEvento || e.id) !== idEvento));
        Swal.fire({
          imageUrl: '/logitonegro.png',
          imageWidth: 130,
          imageHeight: 130,
          background: '#000',
          color: '#fff',
          title: "Eliminado",
          text: "El evento ha sido eliminada",
        });
      } catch (err) {
        console.error("Error deleting evento:", err);
        Swal.fire({
          imageUrl: '/logitotriste.png',
          imageWidth: 130,
          imageHeight: 130,
          background: '#000',
          color: '#fff',
          title: "Error",
          text: err.message || "Hubo un error al eliminar el evento.",
        });
      }
    }
  };

  const fetchEventos = async () => {
    setLoadingEventos(true);
    setErrorEventos(null);
    try {
      const response = await fetch(`${BASE_URL}/servicio/admin/eventos`, {
        headers: getAuthHeaders(),
      });
      if (response.status === 401 || response.status === 403) {
        Swal.fire({
          imageUrl: '/logitotriste.png',
          imageWidth: 130,
          imageHeight: 130,
          background: '#000',
          color: '#fff',
          title: "Error",
          text: "No autorizado. Por favor, inicia sesión de nuevo.",
        });
        handleLogout();
        return;
      }
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al obtener eventos: ${response.status} ${response.statusText} - ${errorText}`);
      }
      const data = await response.json();
      setEventos(data);
    } catch (err) {
      console.error("Error fetching eventos:", err);
      Swal.fire({
        imageUrl: '/logitotriste.png',
        imageWidth: 130,
        imageHeight: 130,
        background: '#000',
        color: '#fff',
        title: "Error",
        text: err.message || "Hubo un error al cargar los eventos.",
      });
      setErrorEventos(err.message);
    } finally {
      setLoadingEventos(false);
    }
  };

  // --- RESERVAS CRUD (NUEVAS FUNCIONES CON MERCADO PAGO SIMULADO) ---
  const fetchReservas = async () => {
    setLoadingReservas(true);
    setErrorReservas(null);
    try {
      const response = await fetch(`${BASE_URL}/servicio/admin/reservas`, {
        headers: getAuthHeaders(),
      });
      if (response.status === 401 || response.status === 403) {
        Swal.fire({
          imageUrl: '/logitotriste.png',
          imageWidth: 130,
          imageHeight: 130,
          background: '#000',
          color: '#fff',
          title: "Error",
          text: "No autorizado. Por favor, inicia sesión de nuevo.",
        });
        handleLogout();
        return;
      }
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al obtener reservas: ${response.status} ${response.statusText} - ${errorText}`);
      }
      const data = await response.json();
      setReservas(data);
    } catch (err) {
      console.error("Error fetching reservas:", err);
      Swal.fire({
        imageUrl: '/logitotriste.png',
        imageWidth: 130,
        imageHeight: 130,
        background: '#000',
        color: '#fff',
        title: "Error",
        text: err.message || "Hubo un error al cargar las reservas.",
      });
      setErrorReservas(err.message);
    } finally {
      setLoadingReservas(false);
    }
  };

  const addReserva = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Añadir Reserva",
      html:
        '<input id="swal-input1" class="swal2-input" placeholder="ID Evento">' +
        // CAMBIO CLAVE AQUÍ: Pide el usuario_cliente (username)
        '<input id="swal-input2" class="swal2-input" placeholder="Usuario Cliente (ej. juanperez)">' +
        '<input id="swal-input3" class="swal2-input" type="number" placeholder="Cantidad Tickets">' +
        '<input id="swal-input4" class="swal2-input" type="date" placeholder="Fecha Reserva (YYYY-MM-DD)">' +
        '<select id="swal-select5" class="swal2-input">' +
        '<option value="">Selecciona Estado de Pago</option>' +
        '<option value="PENDIENTE">PENDIENTE</option>' +
        '<option value="APROBADO">APROBADO</option>' +
        '<option value="RECHAZADO">RECHAZADO</option>' +
        '</select>',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const idEvento = document.getElementById("swal-input1").value.trim();
        // CAMBIO CLAVE AQUÍ: Obtiene el usuario_cliente como string
        const usuarioCliente = document.getElementById("swal-input2").value.trim();
        const cantidadTickets = document.getElementById("swal-input3").value.trim();
        const fechaReserva = document.getElementById("swal-input4").value.trim();
        const estadoPago = document.getElementById("swal-select5").value.trim();

        if (!idEvento || !usuarioCliente || !cantidadTickets || !fechaReserva || !estadoPago) {
          Swal.showValidationMessage("Completa todos los campos obligatorios (ID Evento, Usuario Cliente, Tickets, Fecha, Estado Pago)");
          return;
        }

        let finalIdTransaccion = "";
        if (estadoPago === "APROBADO") {
          finalIdTransaccion = `MP_ADM_${Date.now()}`;
        }

        return {
          evento: { idEvento: Number(idEvento) },
          // CAMBIO CLAVE AQUÍ: Envía el usuario_cliente en el objeto cliente
          cliente: { usuarioCliente: usuarioCliente },
          cantidadTickets: Number(cantidadTickets),
          fechaReserva,
          estadoPago,
          idTransaccion: finalIdTransaccion,
        };
      },
    });

    if (formValues) {
      try {
        const response = await fetch(`${BASE_URL}/servicio/guardar-reserva`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify(formValues),
        });
        if (response.status === 401 || response.status === 403) {
          Swal.fire({
            imageUrl: '/logitotriste.png',
            imageWidth: 130,
            imageHeight: 130,
            background: '#000',
            color: '#fff',
            title: "Error",
            text: "No autorizado. Por favor, inicia sesión de nuevo.",
          });
          handleLogout();
          return;
        }
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`No se pudo añadir la reserva: ${response.status} ${response.statusText} - ${errorText}`);
        }
        // CAMBIO: Recargar todas las reservas para asegurar la actualización de la lista
        fetchReservas();
        Swal.fire({
          imageUrl: '/logitonegro.png',
          imageWidth: 130,
          imageHeight: 130,
          background: '#000',
          color: '#fff',
          title: "¡Guardado!",
          text: "Reserva añadida correctamente",
        });
      } catch (err) {
        console.error("Error adding reserva:", err);
        Swal.fire({
          imageUrl: '/logitotriste.png',
          imageWidth: 130,
          imageHeight: 130,
          background: '#000',
          color: '#fff',
          title: "Error",
          text: err.message || "Hubo un error al añadir la reserva.",
        });
      }
    }
  };

  const updateReserva = async (reservaData) => {
    const { value: formValues } = await Swal.fire({
      title: "Actualizar Reserva",
      html: `
        <input id="swal-input1" class="swal2-input" placeholder="ID Evento" value="${reservaData.idEvento || reservaData.evento?.idEvento || ''}">
        <input id="swal-input2" class="swal2-input" placeholder="Usuario Cliente" value="${reservaData.usuarioCliente || reservaData.cliente?.usuarioCliente || ''}">
        <input id="swal-input3" class="swal2-input" type="number" placeholder="Cantidad Tickets" value="${reservaData.cantidadTickets}">
        <input id="swal-input4" class="swal2-input" type="date" placeholder="Fecha Reserva (YYYY-MM-DD)" value="${reservaData.fechaReserva}">
        <select id="swal-select5" class="swal2-input">
          <option value="PENDIENTE" ${reservaData.estadoPago === 'PENDIENTE' ? 'selected' : ''}>PENDIENTE</option>
          <option value="APROBADO" ${reservaData.estadoPago === 'APROBADO' ? 'selected' : ''}>APROBADO</option>
          <option value="RECHAZADO" ${reservaData.estadoPago === 'RECHAZADO' ? 'selected' : ''}>RECHAZADO</option>
        </select>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Actualizar",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const idEvento = document.getElementById("swal-input1").value.trim();
        // CAMBIO CLAVE AQUÍ: Obtiene el usuario_cliente como string
        const usuarioCliente = document.getElementById("swal-input2").value.trim();
        const cantidadTickets = document.getElementById("swal-input3").value.trim();
        const fechaReserva = document.getElementById("swal-input4").value.trim();
        const estadoPago = document.getElementById("swal-select5").value.trim();

        if (!idEvento || !usuarioCliente || !cantidadTickets || !fechaReserva || !estadoPago) {
          Swal.showValidationMessage("Completa todos los campos obligatorios (ID Evento, Usuario Cliente, Tickets, Fecha, Estado Pago)");
          return;
        }

        let finalIdTransaccion = "";
        if (estadoPago === "APROBADO") {
          finalIdTransaccion = `MP_ADM_UPD_${Date.now()}`;
        } else {
          finalIdTransaccion = "";
        }

        return {
          idReserva: reservaData.idReserva,
          evento: { idEvento: Number(idEvento) },
          // CAMBIO CLAVE AQUÍ: Envía el usuario_cliente en el objeto cliente
          cliente: { usuarioCliente: usuarioCliente },
          cantidadTickets: Number(cantidadTickets),
          fechaReserva,
          estadoPago,
          idTransaccion: finalIdTransaccion,
        };
      },
    });


    if (formValues) {
      try {
        const response = await fetch(
          `${BASE_URL}/servicio/actualizar-reserva`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              ...getAuthHeaders(),
            },
            body: JSON.stringify(formValues),
          }
        );
        if (response.status === 401 || response.status === 403) {
          Swal.fire({
            imageUrl: '/logitotriste.png',
            imageWidth: 130,
            imageHeight: 130,
            background: '#000',
            color: '#fff',
            title: "Error",
            text: "No autorizado. Por favor, inicia sesión de nuevo.",
          });
          handleLogout();
          return;
        }
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`No se pudo actualizar la reserva: ${response.status} ${response.statusText} - ${errorText}`);
        }
        // CAMBIO: Recargar todas las reservas para asegurar la actualización de la lista
        fetchReservas();
        Swal.fire({
          imageUrl: '/logitonegro.png',
          imageWidth: 130,
          imageHeight: 130,
          background: '#000',
          color: '#fff',
          title: "Actualizado",
          text: "Reserva actualizada correctamente",
        });
      } catch (err) {
        console.error("Error updating reserva:", err);
        Swal.fire({
          imageUrl: '/logitotriste.png',
          imageWidth: 130,
          imageHeight: 130,
          background: '#000',
          color: '#fff',
          title: "Error",
          text: err.message || "Hubo un error al actualizar la reserva.",
        });
      }
    }
  };

  const deleteReserva = async (idReserva) => {
    const result = await Swal.fire({
      title: "Confirmar eliminación",
      text: "¿Estás seguro de eliminar esta reserva?",
      imageUrl: '/logitopensativo.webp',
      imageWidth: 130,
      imageHeight: 130,
      background: '#000',
      color: '#fff',
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `${BASE_URL}/servicio/eliminar-reserva/${idReserva}`,
          {
            method: "DELETE",
            headers: getAuthHeaders(),
          }
        );
        if (response.status === 401 || response.status === 403) {
          Swal.fire({
            imageUrl: '/logitotriste.png',
            imageWidth: 130,
            imageHeight: 130,
            background: '#000',
            color: '#fff',
            title: "Error",
            text: "No autorizado. Por favor, inicia sesión de nuevo.",
          });
          handleLogout();
          return;
        }
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`No se pudo eliminar la reserva: ${response.status} ${response.statusText} - ${errorText}`);
        }
        setReservas(reservas.filter((r) => r.idReserva !== idReserva));
        Swal.fire({
          imageUrl: '/logitonegro.png',
          imageWidth: 130,
          imageHeight: 130,
          background: '#000',
          color: '#fff',
          title: "Eliminado",
          text: "La reserva ha sido eliminada",
        });
      } catch (err) {
        console.error("Error deleting reserva:", err);
        Swal.fire({
          imageUrl: '/logitotriste.png',
          imageWidth: 130,
          imageHeight: 130,
          background: '#000',
          color: '#fff',
          title: "Error",
          text: err.message || "Hubo un error al eliminar la reserva.",
        });
      }
    }
  };


  // Función para renderizar el contenido principal según la pestaña activa
  const renderMainContent = () => {
    switch (activeTab) {
      // CAMBIO: Se elimina el case "perfil"
      case "discotecas":
        return (
          <div className="events-container">
            <div className="topbar">
              <h1>Discotecas</h1>
              <button className="btn-add" onClick={addDiscoteca}>+ Añadir Discoteca</button>
            </div>
        
            {loadingDisco ? (
              <p>Cargando discotecas...</p>
            ) : errorDisco ? (
              <p>Error: {errorDisco}</p>
            ) : discotecas.length === 0 ? (
              <p>No hay discotecas registradas.</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>NIT</th>
                    <th>Nombre</th>
                    <th>Ubicación</th>
                    <th>Capacidad</th>
                    <th>Horario</th>
                    <th>Imagen</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {discotecas.map((discoteca) => (
                    <tr key={discoteca.nit}>
                      <td data-label="NIT">{discoteca.nit}</td>
                      <td data-label="Nombre">{discoteca.nombre}</td>
                      <td data-label="Ubicación">{discoteca.ubicacion}</td>
                      <td data-label="Capacidad">{discoteca.capacidad}</td>
                      <td data-label="Horario">{discoteca.horario}</td>
                      <td data-label="Imagen">
                        {discoteca.imagen ? (
                          <img
                            src={discoteca.imagen}
                            alt={discoteca.nombre}
                            style={{ width: "50px", height: "50px", borderRadius: "8px", objectFit: "cover" }}
                          />
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td data-label="Acciones" className="actions-cell">
                        <button className="btn view">Ver</button>
                        <button className="btn edit" onClick={() => updateDiscoteca(discoteca)}>Editar</button>
                        <button className="btn delete" onClick={() => deleteDiscoteca(discoteca.nit)}>Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );
      case "eventos":
        return (
          <div className="events-container">
            <div className="topbar">
              <h1>Eventos</h1>
              <button className="btn-add" onClick={addEvento}>+ Añadir Evento</button>
            </div>
          
            {loadingEventos ? (
              <p>Cargando eventos...</p>
            ) : errorEventos ? (
              <p>Error: {errorEventos}</p>
            ) : eventos.length === 0 ? (
              <p>No hay eventos registrados.</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID Evento</th>
                    <th>Discoteca (NIT)</th>
                    <th>Nombre Evento</th>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Descripción</th>
                    <th>Precio</th>
                    <th>Imagen</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {eventos.map((evento) => (
                    <tr key={evento.idEvento || evento.id}>
                      <td data-label="ID Evento">{evento.idEvento || evento.id}</td>
                      <td data-label="Discoteca (NIT)">{evento.discoteca?.nit || 'N/A'}</td>
                      <td data-label="Nombre Evento">{evento.nombreEvento}</td>
                      <td data-label="Fecha">{evento.fecha}</td>
                      <td data-label="Hora">{evento.hora}</td>
                      <td data-label="Descripción">{evento.descripcion}</td>
                      <td data-label="Precio">${evento.precio?.toFixed(2) || '0.00'}</td>
                      <td data-label="Imagen">
                        {evento.imagen ? (
                          <img
                            src={evento.imagen}
                            alt={evento.nombreEvento}
                            style={{ width: "50px", height: "50px", borderRadius: "8px", objectFit: "cover" }}
                          />
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td data-label="Acciones" className="actions-cell">
                        <button className="btn view">Ver</button>
                        <button className="btn edit" onClick={() => updateEvento(evento)}>Editar</button>
                        <button className="btn delete" onClick={() => deleteEvento(evento.idEvento || evento.id)}>Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );
      case "reservas":
        return (
          <div className="events-container">
            <div className="topbar">
              <h1>Reservas</h1>
              <button className="btn-add" onClick={addReserva}>+ Añadir Reserva</button>
            </div>
        
            {loadingReservas ? (
              <p>Cargando reservas...</p>
            ) : errorReservas ? (
              <p>Error: {errorReservas}</p>
            ) : reservas.length === 0 ? (
              <p>No hay reservas registradas.</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID Reserva</th>
                    <th>ID Evento</th>
                    <th>USUARIO</th> {/* El encabezado de la columna está bien */}
                    <th>Tickets</th>
                    <th>Fecha Reserva</th>
                    <th>Estado Pago</th>
                    {/* CAMBIO: Columna 'ID Transacción' eliminada del thead */}
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {reservas.map((reserva) => (
                    <tr key={reserva.idReserva || reserva.id}>
                      <td data-label="ID Reserva">{reserva.idReserva || reserva.id}</td>
                      <td data-label="ID Evento">{reserva.idEvento || reserva.evento?.idEvento || 'N/A'}</td>
                      {/* ¡CORRECCIÓN AQUÍ! Acceder a usuarioCliente o nombreCliente */}
                      <td data-label="Usuario">{reserva.usuarioCliente || reserva.cliente?.usuarioCliente || 'N/A'}</td>
                      <td data-label="Tickets">{reserva.cantidadTickets}</td>
                      <td data-label="Fecha Reserva">{reserva.fechaReserva}</td>
                      <td data-label="Estado Pago">{reserva.estadoPago}</td>
                      {/* CAMBIO: Columna 'ID Transacción' eliminada del tbody */}
                      <td data-label="Acciones" className="actions-cell">
                        <button className="btn view">Ver</button>
                        <button className="btn edit" onClick={() => updateReserva(reserva)}>Editar</button>
                        <button className="btn delete" onClick={() => deleteReserva(reserva.idReserva || reserva.id)}>Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="admin-panel-container">
      {/* Botón para abrir/cerrar sidebar en móviles */}
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        ☰ {/* O puedes usar un ícono de FontAwesome si lo tienes configurado */}
      </button>

      <aside className={`sidebar ${isSidebarActive ? 'active' : ''}`} id="sidebar">
        <div className="sidebar-content">
          <div className="logo-container">
            <img src="/logito.svg" alt="Logo Night" className="logo-img" />
          </div>
          <h2>Panel de Administrador</h2>
          <ul>
            {/* CAMBIO: Eliminada la opción "Perfil" */}
            <li className={activeTab === "discotecas" ? "active" : ""} onClick={() => setActiveTab("discotecas")}>Discotecas</li>
            <li className={activeTab === "eventos" ? "active" : ""} onClick={() => setActiveTab("eventos")}>Eventos</li>
            <li className={activeTab === "reservas" ? "active" : ""} onClick={() => setActiveTab("reservas")}>Reservas</li>
          </ul>
          <button className="logout-btn" onClick={handleLogout}>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      <main className="main-content" id="mainContent" onClick={(event) => {
        if (isSidebarActive && window.innerWidth <= 768 && !event.target.closest('.sidebar-toggle')) {
          setIsSidebarActive(false);
        }
      }}>
        {renderMainContent()}
      </main>
    </div>
  );
};