import React, { useState, useEffect } from 'react';
import { gapi } from 'gapi-script';
import NavBar from '../components/NavBar';

function TasksList() {
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

  const toggleComplete = (taskId, currentStatus) => {
    const task = tasks.find(t => t.id === taskId);
    const newStatus = currentStatus === 'completed' ? 'needsAction' : 'completed';
    const completedDate = newStatus === 'completed' ? new Date().toISOString() : null;

    gapi.client.tasks.tasks.update({
      tasklist: '@default',
      task: taskId,
      resource: {
        ...task,
        status: newStatus,
        completed: completedDate
      }
    }).then(response => {
      setTasks(prevTasks => prevTasks.map(t => 
        t.id === taskId ? { ...t, status: newStatus, completed: response.result.completed } : t
      ));
      console.log(`Task ${newStatus === 'completed' ? 'marked as completed' : 'marked as needs action'}:`, response.result);
      alert(`Tarea ${newStatus === 'completed' ? 'marcada como completada' : 'desmarcada como completada'}`);
    }).catch(error => {
      console.error(`Error ${newStatus === 'completed' ? 'marking' : 'unmarking'} task as completed:`, error);
      alert(`Error al ${newStatus === 'completed' ? 'marcar' : 'desmarcar'} tarea como completada: ${error.result.error.message}`);
    });
  };

  const deleteTask = (taskId) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar esta tarea?');

    if (confirmDelete) {
      gapi.client.tasks.tasks.delete({
        tasklist: '@default',
        task: taskId
      }).then(response => {
        setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
        alert('Tarea eliminada');
      }).catch(error => {
        console.error('Error deleting task: ', error);
        alert('Error al eliminar la tarea: ' + error.result.error.message);
      });
    }
  };

  return (
    <div className="task-list-container">
      <NavBar />
      <h2>Lista de Tareas</h2>
      {tasks.length === 0 ? (
        <p>No hay tareas.</p>
      ) : (
        <ul className="task-list">
          {tasks.map(task => (
            <li key={task.id} className={`task-item ${task.status === 'completed' ? 'completed' : ''}`}>
              <div className="task-header">
                <h3>{task.title}</h3>
                <input
                  type="checkbox"
                  class="task-checkbox"
                  checked={task.status === 'completed'}
                  onChange={() => toggleComplete(task.id, task.status)}
                />
                <button
                  className = "btn btn-delete"
                  onClick={() => deleteTask(task.id)}
                  >
                    🗑️
                  </button>
              </div>
              <p>{task.notes}</p>
              <p className="task-due">{task.due ? `Fecha de vencimiento: ${new Date(task.due).toLocaleString()}` : 'Sin fecha de vencimiento'}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TasksList;
