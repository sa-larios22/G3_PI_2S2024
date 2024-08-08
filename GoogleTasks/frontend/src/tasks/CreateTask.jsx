// src/tasks/CreateTask.jsx
import React, { useState } from 'react';
import { gapi } from 'gapi-script';
import { useNavigate } from 'react-router-dom';

function CreateTask() {
  const [task, setTask] = useState({
    title: '',
    details: '',
    date: '',
    time: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask(prevTask => ({
      ...prevTask,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { title, details, date, time } = task;
    const dueDate = new Date(`${date}T${time}:00Z`);

    gapi.client.tasks.tasks.insert({
      tasklist: '@default',
      resource: {
        title: title,
        notes: details,
        due: dueDate.toISOString(),
      }
    }).then(response => {
      console.log('Task created:', response.result);
      setTask({ title: '', details: '', date: '', time: '' });
    }).catch(error => {
      console.error('Error creating task:', error);
    });
  };

  const handleSignOut = () => {
    gapi.auth2.getAuthInstance().signOut().then(() => {
      navigate('/');
    });
  };

  return (
    <div className="form-container">
      <button className="btn btn-signout" onClick={handleSignOut}>
        Cerrar Sesión
      </button>
      <form onSubmit={handleSubmit}>
        <table className="form-table">
          <thead>
            <tr>
              <th colSpan="2">Crear Tarea</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><label>Título:</label></td>
              <td>
                <input
                  type="text"
                  name="title"
                  value={task.title}
                  onChange={handleChange}
                  required
                  className="form-control"
                />
              </td>
            </tr>
            <tr>
              <td><label>Detalles:</label></td>
              <td>
                <textarea
                  name="details"
                  value={task.details}
                  onChange={handleChange}
                  required
                  className="form-control"
                />
              </td>
            </tr>
            <tr>
              <td><label>Fecha:</label></td>
              <td>
                <input
                  type="date"
                  name="date"
                  value={task.date}
                  onChange={handleChange}
                  required
                  className="form-control"
                />
              </td>
            </tr>
            <tr>
              <td><label>Hora:</label></td>
              <td>
                <input
                  type="time"
                  name="time"
                  value={task.time}
                  onChange={handleChange}
                  required
                  className="form-control"
                />
              </td>
            </tr>
            <tr>
              <td colSpan="2">
                <button type="submit" className="btn btn-submit">Crear Tarea</button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
}

export default CreateTask;
