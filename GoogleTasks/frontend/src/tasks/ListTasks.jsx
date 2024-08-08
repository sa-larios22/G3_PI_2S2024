// src/tasks/ListTasks.jsx
import React, { useState, useEffect } from 'react';
import { gapi } from 'gapi-script';
import NavBar from '../components/NavBar';

function ListTasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = () => {
      gapi.client.tasks.tasks.list({
        tasklist: '@default'
      }).then(response => {
        setTasks(response.result.items || []);
      }).catch(error => {
        console.error('Error fetching tasks: ', error);
      });
    };

    fetchTasks();
  }, []);

  const handleComplete = (taskId) => {
    console.log("Attempting to complete task with ID: " + taskId); // Debugging line
    gapi.client.tasks.tasks.update({
      tasklist: '@default',
      task: taskId,
      resource: {
        id: taskId,
        status: 'completed',
        completed: new Date().toISOString()
      }
    }).then(response => {
      setTasks(prevTasks => prevTasks.map(task => 
        task.id === taskId ? { ...task, status: 'completed', completed: response.result.completed } : task
      ));
      console.log('Task marked as completed:', response.result);
      alert('Tarea marcada como completada');
    }).catch(error => {
      console.error('Error marking task as completed:', error);
      alert('Error al marcar tarea como completada: ' + error.result.error.message);
    });
  };

  return (
    <div className="task-list-container">
      <NavBar />
      <h2>Lista de Tareas</h2>
      {tasks.length === 0 ? (
        <p>No hay tareas.</p>
      ) : (
        <ul>
          {tasks.map(task => (
            <li key={task.id} className={task.status === 'completed' ? 'completed' : ''}>
              <h3>{task.title}</h3>
              <p>{task.notes}</p>
              <p>{task.due ? new Date(task.due).toLocaleString() : 'Sin fecha'}</p>
              <button
                className="btn btn-complete"
                onClick={() => {console.log("TASK ID: " + task.id); handleComplete(task.id)}}
                disabled={task.status === 'completed'}
              >
                {task.status === 'completed' ? 'Completada' : 'Marcar como completada'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ListTasks;
