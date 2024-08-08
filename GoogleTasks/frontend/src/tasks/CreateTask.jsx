// src/tasks/CreateTask.jsx
import React, { useState } from 'react';
import { gapi } from 'gapi-script';
import NavBar from '../components/NavBar';

function CreateTask() {
  const [task, setTask] = useState({
    title: '',
    details: '',
    date: '',
    time: ''
  });

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
      alert('Tarea creada exitosamente');
    }).catch(error => {
      console.error('Error creating task:', error);
      alert('Error al crear tarea: ' + error.result.error.message);
    });
  };

  return (
    <div className="form-container">
      < NavBar />
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
                  style = {{resize: 'vertical'}}
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
