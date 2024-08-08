// src/tasks/ListTasks.jsx
import React, { useState, useEffect } from 'react';
import { gapi } from 'gapi-script';
import { useNavigate } from 'react-router-dom';

function ListTasks() {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = () => {
      gapi.client.tasks.tasks.list({
        tasklist: '@default'
      }).then(response => {
        setTasks(response.result.items || []);
      }).catch(error => {
        console.error('Error fetching tasks:', error);
      });
    };

    fetchTasks();
  }, []);

  const handleSignOut = () => {
    gapi.auth2.getAuthInstance().signOut().then(() => {
      navigate('/');
    });
  };

  return (
    <div className="task-list-container">
      <h2>Lista de Tareas</h2>
      {tasks.length === 0 ? (
        <p>No hay tareas.</p>
      ) : (
        <ul>
          {tasks.map(task => (
            <li key={task.id}>
              <h3>{task.title}</h3>
              <p>{task.notes}</p>
              <p>{task.due ? new Date(task.due).toLocaleString() : 'Sin fecha'}</p>
            </li>
          ))}
        </ul>
      )}

      
      <div>
        <button className="btn btn-signout" onClick={handleSignOut}>
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}

export default ListTasks;
