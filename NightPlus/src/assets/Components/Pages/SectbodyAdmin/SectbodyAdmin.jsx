import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../../../../Styles/SectbodyAdmin.css";

export const SectbodyAdmin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("perfil");
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [discotecas, setDiscotecas] = useState([]);
  const [loadingDisco, setLoadingDisco] = useState(false);
  const [errorDisco, setErrorDisco] = useState(null);

  const fetchDiscotecas = async () => {
    setLoadingDisco(true);
    setErrorDisco(null);
    try {
      const res = await fetch("http://localhost:8080/servicio/discotecas-list");
      if (!res.ok) throw new Error("Error al obtener discotecas");
      const data = await res.json();
      setDiscotecas(data);
    } catch (err) {
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

  const addEvent = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Añadir Evento",
      html:
        '<input id="swal-input1" class="swal2-input" placeholder="NIT">' +
        '<input id="swal-input2" class="swal2-input" placeholder="Nombre">' +
        '<input id="swal-input3" class="swal2-input" placeholder="Ubicación">' +
        '<input id="swal-input4" class="swal2-input" type="number" placeholder="Capacidad">' +
        '<input id="swal-input5" class="swal2-input" placeholder="Horario">' +
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
          nit,
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
        const res = await fetch("http://localhost:8080/servicio/guardar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formValues),
        });
        if (!res.ok) throw new Error("No se pudo añadir el evento");
        const nuevo = await res.json();
        setDiscotecas([...discotecas, nuevo]);
        Swal.fire("¡Guardado!", "Discoteca añadida correctamente", "success");
      } catch (err) {
        Swal.fire("Error", err.message, "error");
      }
    }
  };

  // Delete event function
  const deleteEvent = async (nit) => {
    const result = await Swal.fire({
      title: "Confirmar eliminación",
      text: "¿Estás seguro de eliminar este evento?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (result.isConfirmed) {
      try {
        const res = await fetch(
          `http://localhost:8080/servicio/eliminar/${nit}`,
          { method: "DELETE" }
        );
        if (!res.ok) throw new Error("No se pudo eliminar el evento");
        setDiscotecas(discotecas.filter((d) => d.nit !== nit));
        Swal.fire("Eliminado", "El evento ha sido eliminado", "success");
      } catch (err) {
        Swal.fire("Error", err.message, "error");
      }
    }
  };

  // Update event function
  const updateEvent = async (eventData) => {
    const { value: formValues } = await Swal.fire({
      title: "Actualizar Evento",
      html: `
        <input id="swal-input1" class="swal2-input" placeholder="NIT" value="${eventData.nit}" disabled>
        <input id="swal-input2" class="swal2-input" placeholder="Nombre" value="${eventData.nombre}">
        <input id="swal-input3" class="swal2-input" placeholder="Ubicación" value="${eventData.ubicacion}">
        <input id="swal-input4" class="swal2-input" type="number" placeholder="Capacidad" value="${eventData.capacidad}">
        <input id="swal-input5" class="swal2-input" placeholder="Horario" value="${eventData.horario}">
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
        const res = await fetch(
          `http://localhost:8080/servicio/actualizar/${eventData.nit}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formValues),
          }
        );
        if (!res.ok) throw new Error("No se pudo actualizar el evento");
        const updated = await res.json();
        setDiscotecas(
          discotecas.map((d) => (d.nit === eventData.nit ? updated : d))
        );
        Swal.fire("Actualizado", "Evento actualizado correctamente", "success");
      } catch (err) {
        Swal.fire("Error", err.message, "error");
      }
    }
  };

  const updateProfile = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Actualizar Información",
      html: `
        <input id="swal-input1" class="swal2-input" placeholder="Nombre" value="${currentAdmin.nombre}">
        <input id="swal-input2" class="swal2-input" placeholder="Apellido" value="${currentAdmin.apellido || ''}">
        <input id="swal-input3" class="swal2-input" placeholder="Correo" value="${currentAdmin.correo}">
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
        icon: "success",
        title: "Actualizado",
        text: "Información actualizada correctamente",
      });
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("currentAdmin");
    if (storedUser) {
      setCurrentAdmin(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (activeTab === "eventos") {
      fetchDiscotecas();
    }
  }, [activeTab]);

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
        <h2>Admin Panel</h2>
        <ul>
          <li
            className={activeTab === "perfil" ? "active" : ""}
            onClick={() => setActiveTab("perfil")}
          >
            Perfil
          </li>
          <li
            className={activeTab === "eventos" ? "active" : ""}
            onClick={() => setActiveTab("eventos")}
          >
            Eventos
          </li>
        </ul>
        <button className="logout-btn" onClick={handleLogout} title="Cerrar sesión">
          <span style={{ fontSize: "1.3em" }}>⎋</span> Cerrar sesión
        </button>
      </aside>

      <main className="main-content">
        {activeTab === "perfil" && (
          <div className="profile-container">
            <h2>Perfil del Administrador</h2>
            {currentAdmin ? (
              <div className="profile-card">
                <p><b>ID:</b> {currentAdmin.id}</p>
                <p><b>Nombre:</b> {currentAdmin.nombre} {currentAdmin.apellido}</p>
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

        {activeTab === "eventos" && (
          <div className="events-container">
            <header className="topbar">
              <h2>Eventos (Discotecas)</h2>
              <button className="btn-add" onClick={addEvent}>
                + Añadir evento
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
                <tbody>
                  {discotecas.length === 0 ? (
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
                          <button className="btn edit" onClick={() => updateEvent(d)}>
                            Actualizar
                          </button>
                          <button className="btn delete" onClick={() => deleteEvent(d.nit)}>
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