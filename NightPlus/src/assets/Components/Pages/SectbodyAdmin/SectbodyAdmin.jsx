import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../../../../Styles/SectbodyAdmin.css";

export const SectbodyAdmin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("admins");

  const [admins, setAdmins] = useState([]);
  const [searchAdmins, setSearchAdmins] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  const [discotecas, setDiscotecas] = useState([]);
  const [loadingDisco, setLoadingDisco] = useState(false);
  const [errorDisco, setErrorDisco] = useState(null);

  const fetchAdmins = async () => {
    try {
      const res = await fetch("http://localhost:8080/admins");
      if (!res.ok) throw new Error("Error al obtener administradores");
      const data = await res.json();
      setAdmins(data);
    } catch (err) {
      console.error(err);
    }
  };

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
      title: 'Añadir Evento',
      html:
        '<input id="swal-input1" class="swal2-input" placeholder="NIT">' +
        '<input id="swal-input2" class="swal2-input" placeholder="Nombre">' +
        '<input id="swal-input3" class="swal2-input" placeholder="Ubicación">' +
        '<input id="swal-input4" class="swal2-input" type="number" placeholder="Capacidad">' +
        '<input id="swal-input5" class="swal2-input" placeholder="Horario">' +
        '<input id="swal-input6" type="file" accept="image/*" class="swal2-file">',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: async () => {
        const nit = document.getElementById('swal-input1').value.trim();
        const nombre = document.getElementById('swal-input2').value.trim();
        const ubicacion = document.getElementById('swal-input3').value.trim();
        const capacidad = document.getElementById('swal-input4').value.trim();
        const horario = document.getElementById('swal-input5').value.trim();
        const fileInput = document.getElementById('swal-input6');
        const imagenArchivo = fileInput.files[0];

        if (!nit || !nombre || !ubicacion || !capacidad || !horario) {
          Swal.showValidationMessage('Completa todos los campos');
          return;
        }

        let imagenBase64 = null;
        if (imagenArchivo) {
          imagenBase64 = await toBase64(imagenArchivo);
        }

        return { nit, nombre, ubicacion, capacidad: Number(capacidad), horario, imagen: imagenBase64 };
      }
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
        Swal.fire('¡Guardado!', 'Discoteca añadida correctamente', 'success');
      } catch (err) {
        Swal.fire('Error', err.message, 'error');
      }
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  useEffect(() => {
    if (activeTab === "eventos") {
      fetchDiscotecas();
    }
  }, [activeTab]);

  const filtradosAdmins = admins.filter(
    (a) =>
      a.nombre.toLowerCase().includes(searchAdmins.toLowerCase()) ||
      a.apellido.toLowerCase().includes(searchAdmins.toLowerCase())
  );

  const verAdmin = (admin) => setSelectedAdmin(admin);

  const eliminarAdmin = async (id) => {
    if (!window.confirm("¿Eliminar administrador?")) return;
    try {
      const res = await fetch(`http://localhost:8080/admins/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("No se pudo eliminar");
      setAdmins(admins.filter((a) => a.id !== id));
      if (selectedAdmin?.id === id) setSelectedAdmin(null);
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas cerrar sesión?',
      imageUrl: '/logitopensativo.webp',
      imageWidth: 130,
      imageHeight: 130,
      showCancelButton: true,
      confirmButtonColor: '#8b08a5',
      background: '#18122B',
      color: '#fff',
      cancelButtonColor: '#6a4ca5',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        Swal.fire({
          background: '#18122B',
          color: '#fff',
          title: 'Sesión cerrada',
          text: 'Has cerrado sesión correctamente.',
          imageUrl: '/logitonegro.png',
          imageWidth: 130,
          imageHeight: 130,
          timer: 1200,
          showConfirmButton: false
        });
        setTimeout(() => {
          navigate('/loginadmin');
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
          <li className={activeTab === "admins" ? "active" : ""} onClick={() => setActiveTab("admins")}>Administradores</li>
          <li className={activeTab === "perfil" ? "active" : ""} onClick={() => setActiveTab("perfil")}>Perfil</li>
          <li className={activeTab === "eventos" ? "active" : ""} onClick={() => setActiveTab("eventos")}>Eventos</li>
        </ul>
        <button className="logout-btn" onClick={handleLogout} title="Cerrar sesión">
          <span style={{ fontSize: '1.3em' }}>⎋</span> Cerrar sesión
        </button>
      </aside>

      <main className="main-content">
        {activeTab === "admins" && (
          <>
            <header className="topbar">
              <h1>Administradores</h1>
              <button className="btn-add">+ Añadir nuevo</button>
            </header>
            <div className="actions-bar">
              <input
                type="text"
                placeholder="Buscar por nombre o apellido..."
                value={searchAdmins}
                onChange={(e) => setSearchAdmins(e.target.value)}
              />
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Acción</th>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Correo</th>
                  <th>Actualizado</th>
                </tr>
              </thead>
              <tbody>
                {filtradosAdmins.length === 0 ? (
                  <tr><td colSpan="6" style={{ textAlign: "center" }}>No hay administradores que coincidan.</td></tr>
                ) : (
                  filtradosAdmins.map((admin) => (
                    <tr key={admin.id}>
                      <td>
                        <button className="btn view" onClick={() => verAdmin(admin)}>👁</button>
                        <button className="btn delete" onClick={() => eliminarAdmin(admin.id)}>❌</button>
                      </td>
                      <td>{admin.id}</td>
                      <td>{admin.nombre}</td>
                      <td>{admin.apellido}</td>
                      <td>{admin.correo}</td>
                      <td>{admin.actualizado}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </>
        )}

        {activeTab === "perfil" && (
          <div>
            <h2>Perfil del Administrador</h2>
            {!selectedAdmin ? (
              <p>Selecciona un administrador en la pestaña "Administradores" para ver su perfil.</p>
            ) : (
              <div>
                <p><b>ID:</b> {selectedAdmin.id}</p>
                <p><b>Nombre:</b> {selectedAdmin.nombre} {selectedAdmin.apellido}</p>
                <p><b>Correo:</b> {selectedAdmin.correo}</p>
                <p><b>Última actualización:</b> {selectedAdmin.actualizado}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "eventos" && (
          <div>
            <header className="topbar">
              <h2>Eventos (Discotecas)</h2>
              <button className="btn-add" onClick={addEvent}>+ Añadir evento</button>
            </header>
            {loadingDisco && <p>Cargando discotecas...</p>}
            {errorDisco && <p style={{ color: "red" }}>{errorDisco}</p>}
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
                  </tr>
                </thead>
                <tbody>
                  {discotecas.length === 0 ? (
                    <tr><td colSpan="6" style={{ textAlign: "center" }}>No hay discotecas disponibles.</td></tr>
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
                                border: "2px solid #8b08a5"
                              }}
                            />
                          ) : "Sin imagen"}
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
