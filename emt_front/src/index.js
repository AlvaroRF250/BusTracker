import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import Inicio from './routes/Inicio';
import Lineas from './routes/Lineas';
import Parada from './routes/Parada';
import Registro from './routes/Registro';
import InicioSesion from './routes/InicioSesion';
import Favoritos from './routes/Favoritos';
import Consultas from './routes/Consultas';
import 'bootstrap/dist/css/bootstrap.css';
import Mapa from './routes/Mapa';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Inicio />,
  },

  {
    path: '/lineas',
    element: <Lineas />
  },

  {
    path: '/parada/:id_Stop',
    element: <Parada />
  },

  {
    path: '/iniciar_sesion',
    element: <InicioSesion />
  },

  {
    path: '/registro',
    element: <Registro />
  },

  {
    path: '/favoritos/:username',
    element: <Favoritos />
  },

  {
    path: '/consultas/:username',
    element: <Consultas />
  },

  {
    path: '/mapa',
    element: <Mapa />
  },


  

])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
        <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
