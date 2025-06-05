import React, { useState, useEffect } from "react";
import "../../../../Styles/SectbodyAdmin.css";

export const SectbodyAdmin = () => {
  // Estado para pestañas
  const [activeTab, setActiveTab] = useState("admins");

  // Administradores
  const [admins, setAdmins] = useState([]);
  const [searchAdmins, setSearchAdmins] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  // Discotecas (Eventos)
  const [discotecas, setDiscotecas] = useState([]);
  const [loadingDisco, setLoadingDisco] = useState(false);
  const [errorDisco, setErrorDisco] = useState(null);

  // --- Fetch Administradores ---
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

  // --- Fetch Discotecas ---
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

  useEffect(() => {
    fetchAdmins();
  }, []);

  useEffect(() => {
    if (activeTab === "eventos") {
      fetchDiscotecas();
    }
  }, [activeTab]);

  // Filtrado admins
  const filtradosAdmins = admins.filter(
    (a) =>
      a.nombre.toLowerCase().includes(searchAdmins.toLowerCase()) ||
      a.apellido.toLowerCase().includes(searchAdmins.toLowerCase())
  );

  // Acciones admin
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

  return (
    <div className="admin-panel-container">
      <aside className="sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li
            className={activeTab === "admins" ? "active" : ""}
            onClick={() => setActiveTab("admins")}
          >
            Administradores
          </li>
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
                {filtradosAdmins.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center" }}>
                      No hay administradores que coincidan.
                    </td>
                  </tr>
                )}
                {filtradosAdmins.map((admin) => (
                  <tr key={admin.id}>
                    <td>
                      <button
                        className="btn view"
                        onClick={() => verAdmin(admin)}
                      >
                        👁
                      </button>
                      {/* Aquí agregar edición si quieres */}
                      <button
                        className="btn delete"
                        onClick={() => eliminarAdmin(admin.id)}
                      >
                        ❌
                      </button>
                    </td>
                    <td>{admin.id}</td>
                    <td>{admin.nombre}</td>
                    <td>{admin.apellido}</td>
                    <td>{admin.correo}</td>
                    <td>{admin.actualizado}</td>
                  </tr>
                ))}
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
                {/* Puedes agregar más campos o editar */}
              </div>
            )}
          </div>
        )}

        {activeTab === "eventos" && (
          <div>
            <h2>Eventos (Discotecas)</h2>
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
                  {discotecas.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center" }}>
                        No hay discotecas disponibles.
                      </td>
                    </tr>
                  )}
                  {discotecas.map((d) => (
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
                            style={{ width: "80px", height: "50px", objectFit: "cover" }}
                          />
                        ) : (
                          "Sin imagen"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
