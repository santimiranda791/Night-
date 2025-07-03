import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../../../../Styles/SectbodyAdmin.css"; // Asegúrate que esta ruta CSS sea correcta

export const SectbodyAdmin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("perfil");
  const [currentAdmin, setCurrentAdmin] = useState(null);

  // Discotecas
  const [discotecas, setDiscotecas] = useState([]);
  const [loadingDisco, setLoadingDisco] = useState(false);
  const [errorDisco, setErrorDisco] = useState(null);

  // Eventos
  const [eventos, setEventos] = useState([]);
  const [loadingEventos, setLoadingEventos] = useState(false);
  const [errorEventos, setErrorEventos] = useState(null);

  // Reservas (NUEVO ESTADO Y CAMPOS MERCADO PAGO SIMULADOS)
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

  // --- DISCOTECAS CRUD ---
  const fetchDiscotecas = async () => {
    setLoadingDisco(true);
    setErrorDisco(null);
    try {
      const response = await fetch("http://localhost:8080/servicio/admin/discotecas", {
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
        const response = await fetch("http://localhost:8080/servicio/guardar", {
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
          `http://localhost:8080/servicio/eliminar/${nit}`,
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
          `http://localhost:8080/servicio/actualizar/${discotecaData.nit}`,
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
        const response = await fetch("http://localhost:8080/servicio/guardar-evento", {
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
          "http://localhost:8080/servicio/actualizar-evento",
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
          `http://localhost:8080/servicio/eliminar-evento/${idEvento}`,
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
      const response = await fetch("http://localhost:8080/servicio/admin/eventos", {
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
      const response = await fetch("http://localhost:8080/servicio/admin/reservas", {
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
        '<input id="swal-input2" class="swal2-input" placeholder="Nombre Usuario">' +
        '<input id="swal-input3" class="swal2-input" type="number" placeholder="Cantidad Tickets">' +
        '<input id="swal-input4" class="swal2-input" type="date" placeholder="Fecha Reserva (YYYY-MM-DD)">' +
        '<select id="swal-select5" class="swal2-input">' + // Nuevo campo: Estado de Pago
          '<option value="">Selecciona Estado de Pago</option>' +
          '<option value="Pendiente">Pendiente</option>' +
          '<option value="Pagado">Pagado</option>' +
          '<option value="Fallido">Fallido</option>' +
        '</select>' +
        '<input id="swal-input6" class="swal2-input" placeholder="ID Transacción (Mercado Pago simulado)">', // Nuevo campo: ID Transacción
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const idEvento = document.getElementById("swal-input1").value.trim();
        const nombreUsuario = document.getElementById("swal-input2").value.trim();
        const cantidadTickets = document.getElementById("swal-input3").value.trim();
        const fechaReserva = document.getElementById("swal-input4").value.trim();
        const estadoPago = document.getElementById("swal-select5").value.trim(); // Obtener estado de pago
        const idTransaccion = document.getElementById("swal-input6").value.trim(); // Obtener ID Transacción


        if (!idEvento || !nombreUsuario || !cantidadTickets || !fechaReserva || !estadoPago) {
          Swal.showValidationMessage("Completa todos los campos obligatorios (Evento, Usuario, Tickets, Fecha, Estado Pago)");
          return;
        }

        // Simular un ID de transacción si el estado es "Pagado" y no se ingresó uno
        let finalIdTransaccion = idTransaccion;
        if (estadoPago === "Pagado" && !idTransaccion) {
            finalIdTransaccion = `MP_FAKE_${Date.now()}`;
        } else if (estadoPago !== "Pagado") {
            finalIdTransaccion = ""; // Limpiar el ID de transacción si no está pagado
        }


        return {
          evento: { idEvento: Number(idEvento) }, // Asume que el backend espera un objeto evento con idEvento
          nombreUsuario,
          cantidadTickets: Number(cantidadTickets),
          fechaReserva,
          estadoPago,       // Añadir estado de pago
          idTransaccion: finalIdTransaccion, // Añadir ID de transacción
        };
      },
    });

    if (formValues) {
      try {
        const response = await fetch("http://localhost:8080/servicio/guardar-reserva", {
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
        const nuevo = await response.json();
        setReservas([...reservas, nuevo]);
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
        <input id="swal-input1" class="swal2-input" placeholder="ID Evento" value="${reservaData.evento?.idEvento || ''}">
        <input id="swal-input2" class="swal2-input" placeholder="Nombre Usuario" value="${reservaData.nombreUsuario}">
        <input id="swal-input3" class="swal2-input" type="number" placeholder="Cantidad Tickets" value="${reservaData.cantidadTickets}">
        <input id="swal-input4" class="swal2-input" type="date" placeholder="Fecha Reserva (YYYY-MM-DD)" value="${reservaData.fechaReserva}">
        <select id="swal-select5" class="swal2-input">
          <option value="Pendiente" ${reservaData.estadoPago === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
          <option value="Pagado" ${reservaData.estadoPago === 'Pagado' ? 'selected' : ''}>Pagado</option>
          <option value="Fallido" ${reservaData.estadoPago === 'Fallido' ? 'selected' : ''}>Fallido</option>
        </select>
        <input id="swal-input6" class="swal2-input" placeholder="ID Transacción (Mercado Pago simulado)" value="${reservaData.idTransaccion || ''}">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Actualizar",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const idEvento = document.getElementById("swal-input1").value.trim();
        const nombreUsuario = document.getElementById("swal-input2").value.trim();
        const cantidadTickets = document.getElementById("swal-input3").value.trim();
        const fechaReserva = document.getElementById("swal-input4").value.trim();
        const estadoPago = document.getElementById("swal-select5").value.trim();
        const idTransaccion = document.getElementById("swal-input6").value.trim();

        if (!idEvento || !nombreUsuario || !cantidadTickets || !fechaReserva || !estadoPago) {
          Swal.showValidationMessage("Completa todos los campos obligatorios (Evento, Usuario, Tickets, Fecha, Estado Pago)");
          return;
        }

        let finalIdTransaccion = idTransaccion;
        if (estadoPago === "Pagado" && !idTransaccion) {
            finalIdTransaccion = `MP_FAKE_${Date.now()}`;
        } else if (estadoPago !== "Pagado") {
            finalIdTransaccion = "";
        }

        return {
          idReserva: reservaData.idReserva, // Asegúrate de enviar el ID de la reserva para la actualización
          evento: { idEvento: Number(idEvento) },
          nombreUsuario,
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
          "http://localhost:8080/servicio/actualizar-reserva", // Endpoint para actualizar reserva
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
        const updated = await response.json();
        setReservas(
          reservas.map((r) =>
            (r.idReserva || r.id) === (formValues.idReserva || formValues.id) ? updated : r
          )
        );
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
          `http://localhost:8080/servicio/eliminar-reserva/${idReserva}`, // Endpoint para eliminar reserva
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
        setReservas(reservas.filter((r) => (r.idReserva || r.id) !== idReserva));
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

  // --- PERFIL ---
  const updateProfile = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Actualizar Información",
      html: `
        <input id="swal-input1" class="swal2-input" placeholder="Nombre" value="${currentAdmin?.nombre || ''}">
        <input id="swal-input2" class="swal2-input" placeholder="Apellido" value="${currentAdmin?.apellido || ''}">
        <input id="swal-input3" class="swal2-input" placeholder="Correo" value="${currentAdmin?.correo || ''}">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Actualizar",
      preConfirm: () => {
        const nombre = document.getElementById("swal-input1").value.trim();
        const apellido = document.getElementById("swal-input2").value.trim();
        const correo = document.getElementById("swal-input3").value.trim();
        if (!nombre || !correo) {
          Swal.showValidationMessage("Nombre y Correo son requeridos");
          return;
        }
        return { nombre, apellido, correo };
      },
    });
    if (formValues) {
      const updatedAdmin = {
        ...currentAdmin,
        ...formValues,
        actualizado: new Date().toLocaleString(),
      };
      setCurrentAdmin(updatedAdmin);
      localStorage.setItem("currentAdmin", JSON.stringify(updatedAdmin));
      Swal.fire({
        imageUrl: '/logitonegro.png',
        imageWidth: 130,
        imageHeight: 130,
        background: '#000',
        color: '#fff',
        title: "Actualizado",
        text: "Información actualizada correctamente",
      });
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("currentAdmin");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.usuario && !parsedUser.usuario_admin) {
        parsedUser.usuario_admin = parsedUser.usuario;
      }
      setCurrentAdmin(parsedUser);
      console.log("useEffect: currentAdmin loaded:", parsedUser);
    } else {
      console.log("useEffect: No currentAdmin found in localStorage.");
    }
  }, []);

  useEffect(() => {
    if (currentAdmin && currentAdmin.token) {
      if (activeTab === "discotecas") {
        fetchDiscotecas();
      }
      if (activeTab === "eventos") {
        fetchEventos();
      }
      if (activeTab === "reservas") { // Cargar reservas
        fetchReservas();
      }
    } else if (activeTab === "discotecas" || activeTab === "eventos" || activeTab === "reservas") {
      console.warn("No token available to fetch data for:", activeTab);
      Swal.fire({
        imageUrl: '/logitotriste.png',
        imageWidth: 130,
        imageHeight: 130,
        background: '#000',
        color: '#fff',
        title: "Error",
        text: "No hay sesión de administrador activa para cargar datos.",
      });
      setErrorDisco("No hay sesión de administrador activa para cargar discotecas.");
      setErrorEventos("No hay sesión de administrador activa para cargar eventos.");
      setErrorReservas("No hay sesión de administrador activa para cargar reservas.");
    }
  }, [activeTab, currentAdmin]);

  const handleLogout = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Deseas cerrar sesión?",
      imageUrl: "/logitopensativo.webp",
      imageWidth: 130,
      imageHeight: 130,
      showCancelButton: true,
      confirmButtonColor: "#8b08a5",
      background: "#18122B",
      color: "#fff",
      cancelButtonColor: "#6a4ca5",
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        setCurrentAdmin(null);
        Swal.fire({
          background: "#18122B",
          color: "#fff",
          title: "Sesión cerrada",
          text: "Has cerrado sesión correctamente.",
          imageUrl: "/logitonegro.png",
          imageWidth: 130,
          imageHeight: 130,
          timer: 1200,
          showConfirmButton: false,
        });
        setTimeout(() => {
          navigate("/loginadmin");
        }, 1200);
      }
    });
  };

  return (
    <div className="admin-panel-container">
      <aside className="sidebar glass">
        <div className="logo-container">
          <img src="/logito.svg" alt="Logo Night+" className="logo-img" />
        </div>
        <h2>Panel de Administrador</h2>
        <ul>
          <li
            className={activeTab === "perfil" ? "active" : ""}
            onClick={() => setActiveTab("perfil")}
          >
            Perfil
          </li>
          <li
            className={activeTab === "discotecas" ? "active" : ""}
            onClick={() => setActiveTab("discotecas")}
          >
            Discotecas
          </li>
          <li
            className={activeTab === "eventos" ? "active" : ""}
            onClick={() => setActiveTab("eventos")}
          >
            Eventos
          </li>
          <li
            className={activeTab === "reservas" ? "active" : ""}
            onClick={() => setActiveTab("reservas")}
          >
            Reservas
          </li>
        </ul>
        <button className="logout-btn" onClick={handleLogout} title="Cerrar sesión">
          <span style={{ fontSize: "1.3em" }}>&#x2388;</span> Cerrar sesión
        </button>
      </aside>

      <main className="main-content">
        {activeTab === "perfil" && (
          <div className="profile-container">
            <h2>Perfil del Administrador</h2>
            {currentAdmin ? (
              <div className="profile-card">
                <p><b>Usuario:</b> {currentAdmin.usuario_admin || 'No disponible'}</p>
                <p><b>ID:</b> {currentAdmin.idAdmin || 'No disponible'}</p>
                <p><b>Nombre:</b> {currentAdmin.nombre}</p>
                <p><b>Correo:</b> {currentAdmin.correo}</p>
                <p><b>Última actualización:</b> {currentAdmin.actualizado || "N/A"}</p>
                <button className="btn-update" onClick={updateProfile}>
                  Actualizar información
                </button>
              </div>
            ) : (
              <p className="no-info">No se encontró información del usuario logueado.</p>
            )}
          </div>
        )}

        {activeTab === "discotecas" && (
          <div className="events-container">
            <header className="topbar">
              <h2>Discotecas</h2>
              <button className="btn-add" onClick={addDiscoteca}>
                + Añadir discoteca
              </button>
            </header>
            {loadingDisco && <p>Cargando discotecas...</p>}
            {errorDisco && <p className="error-text">{errorDisco}</p>}
            {!loadingDisco && !errorDisco && (
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
                <tbody>{discotecas.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center" }}>
                      No hay discotecas disponibles.
                    </td>
                  </tr>
                ) : (
                  discotecas.map((d) => (
                    <tr key={d.nit}>
                      <td>{d.nit}</td>
                      <td>{d.nombre}</td>
                      <td>{d.ubicacion}</td>
                      <td>{d.capacidad}</td>
                      <td>{d.horario}</td>
                      <td>
                        {d.imagen ? (
                          <img
                            src={d.imagen}
                            alt={d.nombre}
                            style={{
                              width: "80px",
                              height: "50px",
                              objectFit: "cover",
                              borderRadius: "8px",
                              border: "2px solid #8b08a5",
                            }}
                          />
                        ) : (
                          "Sin imagen"
                        )}
                      </td>
                      <td>
                        <button className="btn edit" onClick={() => updateDiscoteca(d)}>
                          Actualizar
                        </button>
                        <button className="btn delete" onClick={() => deleteDiscoteca(d.nit)}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                )}</tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === "eventos" && (
          <div className="events-container">
            <header className="topbar">
              <h2>Eventos</h2>
              <button className="btn-add" onClick={addEvento}>
                + Añadir evento
              </button>
            </header>
            {loadingEventos && <p>Cargando eventos...</p>}
            {errorEventos && <p className="error-text">{errorEventos}</p>}
            {!loadingEventos && !errorEventos && (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID Evento</th>
                    <th>NIT Discoteca</th>
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
                  {eventos.length === 0 ? (
                    <tr>
                      <td colSpan="9" style={{ textAlign: "center" }}>
                        No hay eventos disponibles.
                      </td>
                    </tr>
                  ) : (
                    eventos.map((e) => (
                      <tr key={e.idEvento || e.id}>
                        <td>{e.idEvento || e.id}</td>
                        <td>{e.discoteca?.nit || "N/A"}</td>
                        <td>{e.nombreEvento}</td>
                        <td>{e.fecha}</td>
                        <td>{e.hora}</td>
                        <td>{e.descripcion}</td>
                        <td>{e.precio}</td>
                        <td>
                          {e.imagen ? (
                            <img
                              src={e.imagen}
                              alt={e.nombreEvento}
                              style={{
                                width: "80px",
                                height: "50px",
                                objectFit: "cover",
                                borderRadius: "8px",
                                border: "2px solid #8b08a5",
                              }}
                            />
                          ) : (
                            "Sin imagen"
                          )}
                        </td>
                        <td>
                          <button className="btn edit" onClick={() => updateEvento(e)}>
                            Actualizar
                          </button>
                          <button className="btn delete" onClick={() => deleteEvento(e.idEvento || e.id)}>
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}


        {/* SECCIÓN: RESERVAS CON MERCADO PAGO SIMULADO */}
        {activeTab === "reservas" && (
          <div className="events-container">
            <header className="topbar">
              <h2>Reservas</h2>
              <button className="btn-add" onClick={addReserva}>
                + Añadir reserva
              </button>
            </header>
            {loadingReservas && <p>Cargando reservas...</p>}
            {errorReservas && <p className="error-text">{errorReservas}</p>}
            {!loadingReservas && !errorReservas && (
 <table className="admin-table">
  <thead>
    <tr>
      <th>ID Reserva</th>
      <th>ID Evento</th>
      <th>Nombre Usuario</th>
      <th>Cantidad Tickets</th>
      <th>Fecha Reserva</th>
      <th>Estado Pago</th>
      <th>ID Transacción</th>
      <th>Acciones</th>
    </tr>
  </thead>
  <tbody>
    {reservas.length === 0 ? (
      <tr>
        <td colSpan="8" style={{ textAlign: "center" }}>
          No hay reservas disponibles.
        </td>
      </tr>
    ) : (
    // ... (código anterior)

          reservas.map((r) => (
        <tr key={r.idReserva || r.id}>
          <td>{r.idReserva || r.id}</td>
          <td>{r.idEvento || "N/A"}</td>          {/* CAMBIO: Accede directamente a idEvento */}
          <td>{r.nombreCliente || "N/A"}</td>     {/* CAMBIO: Accede directamente a nombreCliente */}
                                              {/* Si tu DTO usa 'nombreUsuarioCliente', cambia a {r.nombreUsuarioCliente || "N/A"} */}
          <td>{r.cantidadTickets}</td>
          <td>{r.fechaReserva}</td>
          <td>
            <span
              className={`status-badge status-${(
                r.estadoPago || "N/A"
              ).toLowerCase()}`}
            >
              {r.estadoPago || "N/A"}
            </span>
          </td>
          <td>{r.idTransaccion || "N/A"}</td>
          <td>
            <button className="btn edit" onClick={() => updateReserva(r)}>
              Actualizar
            </button>
            <button
              className="btn delete"
              onClick={() => deleteReserva(r.idReserva || r.id)}
            >
              Eliminar
            </button>
          </td>
        </tr>
      ))
    )}
  </tbody>
</table>
            )}
          </div>
        )}
      </main>
    </div>
  );
};