// src/App.jsx
import React, { useState, useEffect } from 'react';
import { gapi } from 'gapi-script';

const CLIENT_ID = '78380164814-91vt0n8ljs8doro59nuuilabj0e0j3bq.apps.googleusercontent.com';
const API_KEY = 'AIzaSyCOa-nE8XB9Qvl9N2dYuHz9nInv_4RfQf8';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/tasks/v1/rest"];
const SCOPES = "https://www.googleapis.com/auth/tasks";

function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [task, setTask] = useState({
    title: '',
    details: '',
    date: '',
    time: ''
  });

  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
        prompt: 'select_account'
      }).then(() => {
        const authInstance = gapi.auth2.getAuthInstance();
        setIsSignedIn(authInstance.isSignedIn.get());
        authInstance.isSignedIn.listen(setIsSignedIn);
      }).catch(error => {
        console.error('Error initializing Google API client:', error);
      });
    };

    gapi.load('client:auth2', initClient);
  }, []);

  const handleSignIn = () => {
    gapi.auth2.getAuthInstance().signIn({
      prompt: 'select_account'
    });
  };

  const handleSignOut = () => {
    gapi.auth2.getAuthInstance().signOut();
  };

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

  return (
    <div className="app-container">
  {isSignedIn ? (
    <div className="form-container">
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
      <button className="btn btn-signout" onClick={handleSignOut}>
        Cerrar Sesión
      </button>
    </div>
  ) : (
    <button className="btn btn-signin" onClick={handleSignIn}>
      Iniciar Sesión con Google
    </button>
  )}
</div>

  );
}

export default App;
