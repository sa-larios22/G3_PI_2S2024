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

    const intervalID = setInterval(fetchTasks, 10000);

    return () => clearInterval(intervalID);
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
      }).then(() => {
        setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
        alert('Tarea eliminada');
      }).catch(error => {
        console.error('Error deleting task: ', error);
        alert('Error al eliminar la tarea: ' + error.result.error.message);
      });
    }
  };

  const pendingTasks = tasks.filter(task => task.status !== 'completed');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  return (
    <div className="task-list-container">
      <NavBar />
      <h2>Lista de Tareas</h2>

      <div className="tasks-section">
        <h3>Tareas Pendientes</h3>
        {pendingTasks.length === 0 ? (
          <p>No hay tareas pendientes.</p>
        ) : (
          <ul className="task-list">
            {pendingTasks.map(task => (
              <li key={task.id} className="task-item">
                <div className="task-header">
                  <h4>{task.title}</h4>
                  <div className="task-actions">
                    <input
                      type="checkbox"
                      className="task-checkbox"
                      checked={task.status === 'completed'}
                      onChange={() => toggleComplete(task.id, task.status)}
                    />
                    <button
                      className="btn btn-delete"
                      onClick={() => deleteTask(task.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <p>{task.notes}</p>
                <p className="task-due">{task.due ? `Fecha de vencimiento: ${new Date(task.due).toLocaleString()}` : 'Sin fecha de vencimiento'}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="tasks-section">
        <h3>Tareas Completadas</h3>
        {completedTasks.length === 0 ? (
          <p>No hay tareas completadas.</p>
        ) : (
          <ul className="task-list">
            {completedTasks.map(task => (
              <li key={task.id} className="task-item completed">
                <div className="task-header">
                  <h4>{task.title}</h4>
                  <div className="task-actions">
                    <input
                      type="checkbox"
                      className="task-checkbox"
                      checked={task.status === 'completed'}
                      onChange={() => toggleComplete(task.id, task.status)}
                    />
                    <button
                      className="btn btn-delete"
                      onClick={() => deleteTask(task.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <p>{task.notes}</p>
                <p className="task-due">{task.due ? `Fecha de vencimiento: ${new Date(task.due).toLocaleString()}` : 'Sin fecha de vencimiento'}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default TasksList;
