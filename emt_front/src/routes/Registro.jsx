import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import Header from '../components/Header';
import "../estilos/Registro.css"
import '../estilos/General.css'

function Registro() {
  const [username, setUsername] = useState('');
  const [cookies, setCookie] = useCookies(['username']);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);

    fetch('http://localhost:8000/emt/registro/', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setErrorMessage(data.error);
        } else {
          console.log(data);
          setCookie('username', username);
          window.location.href = `/`;
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <Header />
      {!cookies.username && ( 
      <div id='contentRegistro'>
        <div className="container">
          <form id='formRegistro' onSubmit={handleSubmit}>
            {errorMessage && <p>{errorMessage}</p>}
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Crear cuenta</button>
          </form>
          </div>
      </div>
      )}
      {cookies.username && (
        window.location.href = `/`
        )}
    </div>
  );
}

export default Registro;
