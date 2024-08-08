import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { gapi } from 'gapi-script';
import './App.css';
import CreateTask from './tasks/CreateTask';
import ListTasks from './tasks/ListTasks';

const CLIENT_ID = '78380164814-91vt0n8ljs8doro59nuuilabj0e0j3bq.apps.googleusercontent.com';
const API_KEY = 'AIzaSyCOa-nE8XB9Qvl9N2dYuHz9nInv_4RfQf8';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/tasks/v1/rest"];
const SCOPES = "https://www.googleapis.com/auth/tasks";

function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const navigate = useNavigate();

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
        if (authInstance.isSignedIn.get()) {
          navigate('/listTasks');
        }
      }).catch(error => {
        console.error('Error initializing Google API client:', error);
      });
    };

    gapi.load('client:auth2', initClient);
  }, [navigate]);

  const handleSignIn = () => {
    gapi.auth2.getAuthInstance().signIn({
      prompt: 'select_account'
    }).then(() => {
      navigate('/listTasks');
    });
  };

  const handleSignOut = () => {
    gapi.auth2.getAuthInstance().signOut().then(() => {
      navigate('/');
    });
  };

  return (
    <div className="app-container">
      {isSignedIn ? (
        <button className="btn btn-signout" onClick={handleSignOut}>
          Cerrar Sesión
        </button>
      ) : (
        <button className="btn btn-signin" onClick={handleSignIn}>
          Iniciar Sesión con Google
        </button>
      )}
    </div>
  );
}

export default function RootApp() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/createTask" element={<CreateTask />} />
        <Route path="/listTasks" element={<ListTasks />} />
      </Routes>
    </Router>
  );
}
