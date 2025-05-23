import React, { useState } from 'react';
import { Header } from '../../Header/Header';
import '../../../../Styles/SectbodyAdmin.css';

export const SectbodyAdmin = () => {
  // State for events
  const [events, setEvents] = useState([]);
  const [eventForm, setEventForm] = useState({ id: null, name: '', date: '', description: '' });
  const [isEditingEvent, setIsEditingEvent] = useState(false);

  // State for discotecas (placeholder)
  const [discotecas, setDiscotecas] = useState([]);
  const [discotecaForm, setDiscotecaForm] = useState({ id: null, name: '', location: '' });
  const [isEditingDiscoteca, setIsEditingDiscoteca] = useState(false);

  // State for users (placeholder)
  const [users, setUsers] = useState([]);
  const [userForm, setUserForm] = useState({ id: null, username: '', email: '' });
  const [isEditingUser, setIsEditingUser] = useState(false);

  // Generic input change handler for forms
  const handleInputChange = (e, formSetter, formState) => {
    const { name, value } = e.target;
    formSetter({ ...formState, [name]: value });
  };

  // Event handlers
  const handleAddEvent = () => {
    if (!eventForm.name || !eventForm.date) {
      alert('Please provide event name and date.');
      return;
    }
    const newEvent = { ...eventForm, id: Date.now() };
    setEvents([...events, newEvent]);
    setEventForm({ id: null, name: '', date: '', description: '' });
  };

  const handleEditEvent = (event) => {
    setEventForm(event);
    setIsEditingEvent(true);
  };

  const handleUpdateEvent = () => {
    if (!eventForm.name || !eventForm.date) {
      alert('Please provide event name and date.');
      return;
    }
    setEvents(events.map((ev) => (ev.id === eventForm.id ? eventForm : ev)));
    setEventForm({ id: null, name: '', date: '', description: '' });
    setIsEditingEvent(false);
  };

  const handleDeleteEvent = (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter((ev) => ev.id !== id));
    }
  };

  const handleCancelEventEdit = () => {
    setEventForm({ id: null, name: '', date: '', description: '' });
    setIsEditingEvent(false);
  };

  // Discoteca handlers (simplified)
  const handleAddDiscoteca = () => {
    if (!discotecaForm.name || !discotecaForm.location) {
      alert('Please provide discoteca name and location.');
      return;
    }
    const newDiscoteca = { ...discotecaForm, id: Date.now() };
    setDiscotecas([...discotecas, newDiscoteca]);
    setDiscotecaForm({ id: null, name: '', location: '' });
  };

  const handleEditDiscoteca = (discoteca) => {
    setDiscotecaForm(discoteca);
    setIsEditingDiscoteca(true);
  };

  const handleUpdateDiscoteca = () => {
    if (!discotecaForm.name || !discotecaForm.location) {
      alert('Please provide discoteca name and location.');
      return;
    }
    setDiscotecas(discotecas.map((d) => (d.id === discotecaForm.id ? discotecaForm : d)));
    setDiscotecaForm({ id: null, name: '', location: '' });
    setIsEditingDiscoteca(false);
  };

  const handleDeleteDiscoteca = (id) => {
    if (window.confirm('Are you sure you want to delete this discoteca?')) {
      setDiscotecas(discotecas.filter((d) => d.id !== id));
    }
  };

  const handleCancelDiscotecaEdit = () => {
    setDiscotecaForm({ id: null, name: '', location: '' });
    setIsEditingDiscoteca(false);
  };

  // User handlers (simplified)
  const handleAddUser = () => {
    if (!userForm.username || !userForm.email) {
      alert('Please provide username and email.');
      return;
    }
    const newUser = { ...userForm, id: Date.now() };
    setUsers([...users, newUser]);
    setUserForm({ id: null, username: '', email: '' });
  };

  const handleEditUser = (user) => {
    setUserForm(user);
    setIsEditingUser(true);
  };

  const handleUpdateUser = () => {
    if (!userForm.username || !userForm.email) {
      alert('Please provide username and email.');
      return;
    }
    setUsers(users.map((u) => (u.id === userForm.id ? userForm : u)));
    setUserForm({ id: null, username: '', email: '' });
    setIsEditingUser(false);
  };

  const handleDeleteUser = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  const handleCancelUserEdit = () => {
    setUserForm({ id: null, username: '', email: '' });
    setIsEditingUser(false);
  };

  return (
    <>
      <Header />
      <div className="sectbody-admin-container">
        <h1>Admin Dashboard</h1>

        {/* Discotecas Section */}
        <section className="admin-section">
          <h2>Manage Discotecas</h2>
          <div className="admin-form">
            <h3>{isEditingDiscoteca ? 'Edit Discoteca' : 'Add New Discoteca'}</h3>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={discotecaForm.name}
                onChange={(e) => handleInputChange(e, setDiscotecaForm, discotecaForm)}
                placeholder="Discoteca name"
              />
            </label>
            <label>
              Location:
              <input
                type="text"
                name="location"
                value={discotecaForm.location}
                onChange={(e) => handleInputChange(e, setDiscotecaForm, discotecaForm)}
                placeholder="Discoteca location"
              />
            </label>
            <div>
              {isEditingDiscoteca ? (
                <>
                  <button className="update-button" onClick={handleUpdateDiscoteca}>
                    Update Discoteca
                  </button>
                  <button className="cancel-button" onClick={handleCancelDiscotecaEdit}>
                    Cancel
                  </button>
                </>
              ) : (
                <button className="add-button" onClick={handleAddDiscoteca}>
                  Add Discoteca
                </button>
              )}
            </div>
          </div>
          <ul className="items-list">
            {discotecas.length === 0 ? (
              <p>No discotecas added yet.</p>
            ) : (
              discotecas.map((d) => (
                <li key={d.id} className="item">
                  <strong>{d.name}</strong> - {d.location}
                  <div>
                    <button className="edit-button" onClick={() => handleEditDiscoteca(d)}>
                      Edit
                    </button>
                    <button className="delete-button" onClick={() => handleDeleteDiscoteca(d.id)}>
                      Delete
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </section>

        {/* Events Section */}
        <section className="admin-section">
          <h2>Manage Events</h2>
          <div className="admin-form">
            <h3>{isEditingEvent ? 'Edit Event' : 'Add New Event'}</h3>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={eventForm.name}
                onChange={(e) => handleInputChange(e, setEventForm, eventForm)}
                placeholder="Event name"
              />
            </label>
            <label>
              Date:
              <input
                type="date"
                name="date"
                value={eventForm.date}
                onChange={(e) => handleInputChange(e, setEventForm, eventForm)}
              />
            </label>
            <label>
              Description:
              <textarea
                name="description"
                value={eventForm.description}
                onChange={(e) => handleInputChange(e, setEventForm, eventForm)}
                placeholder="Event description"
              />
            </label>
            <div>
              {isEditingEvent ? (
                <>
                  <button className="update-button" onClick={handleUpdateEvent}>
                    Update Event
                  </button>
                  <button className="cancel-button" onClick={handleCancelEventEdit}>
                    Cancel
                  </button>
                </>
              ) : (
                <button className="add-button" onClick={handleAddEvent}>
                  Add Event
                </button>
              )}
            </div>
          </div>
          <ul className="items-list">
            {events.length === 0 ? (
              <p>No events added yet.</p>
            ) : (
              events.map((event) => (
                <li key={event.id} className="item">
                  <strong>{event.name}</strong> - {event.date}
                  <p>{event.description}</p>
                  <div>
                    <button className="edit-button" onClick={() => handleEditEvent(event)}>
                      Edit
                    </button>
                    <button className="delete-button" onClick={() => handleDeleteEvent(event.id)}>
                      Delete
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </section>

        {/* Users Section */}
        <section className="admin-section">
          <h2>Manage Users</h2>
          <div className="admin-form">
            <h3>{isEditingUser ? 'Edit User' : 'Add New User'}</h3>
            <label>
              Username:
              <input
                type="text"
                name="username"
                value={userForm.username}
                onChange={(e) => handleInputChange(e, setUserForm, userForm)}
                placeholder="Username"
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={userForm.email}
                onChange={(e) => handleInputChange(e, setUserForm, userForm)}
                placeholder="Email"
              />
            </label>
            <div>
              {isEditingUser ? (
                <>
                  <button className="update-button" onClick={handleUpdateUser}>
                    Update User
                  </button>
                  <button className="cancel-button" onClick={handleCancelUserEdit}>
                    Cancel
                  </button>
                </>
              ) : (
                <button className="add-button" onClick={handleAddUser}>
                  Add User
                </button>
              )}
            </div>
          </div>
          <ul className="items-list">
            {users.length === 0 ? (
              <p>No users added yet.</p>
            ) : (
              users.map((user) => (
                <li key={user.id} className="item">
                  <strong>{user.username}</strong> - {user.email}
                  <div>
                    <button className="edit-button" onClick={() => handleEditUser(user)}>
                      Edit
                    </button>
                    <button className="delete-button" onClick={() => handleDeleteUser(user.id)}>
                      Delete
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>
    </>
  );
};
