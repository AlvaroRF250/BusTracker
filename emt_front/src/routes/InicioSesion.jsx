import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import '../estilos/InicioSesion.css'
import '../estilos/General.css'
import '../estilos/Perfil.css'
import Header from '../components/Header';
import { Modal, Button } from 'react-bootstrap';


function InicioSesion() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [cookies, setCookie, removeCookie] = useCookies(['username']);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [showModalChange, setShowModalChange] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    fetch('http://localhost:8000/emt/iniciar_sesion/', {
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

  const handleLogout = () => {
    removeCookie('username', {path:'/'});
    window.location.href = '/';
  };

  const handleChangePassword = (event) => {
    event.preventDefault();
  
    const formData = new FormData();
    formData.append('old_password', oldPassword);
    formData.append('new_password', password);
    formData.append('username', cookies.username);
  
    fetch('http://localhost:8000/emt/cambiar_contrasena/', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log('Contraseña cambiada correctamente');
          setOldPassword('');
          setPassword('');
          setShowModalChange(false);
        } else {
          console.error('Error al cambiar la contraseña');
          setError('La contraseña antigua es incorrecta');
        }
      })
      .catch((error) => {
        console.error('Error al realizar la llamada a la API:', error);
      });
  };
  

  const handleCancelChangePassword = () => {
    setOldPassword('');
    setPassword('');
    setShowModalChange(false);
  };
  
  const handleEditPassword = () => {
    setShowModalChange(true);
  };

  const handleDeleteAccount = () => {
    setShowModalDelete(true);
  };

  const handleConfirmDeleteAccount = () => {
    const formData = new FormData();
    formData.append('username', cookies.username);
    fetch('http://localhost:8000/emt/eliminar_cuenta/', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          console.log('Cuenta eliminada correctamente');
          removeCookie('username', { path: '/' });
          window.location.href = '/'; 

        } else {
          console.error('Error al eliminar la cuenta');
        }
      })
      .catch(error => {
        console.error('Error al realizar la llamada a la API:', error);
      });

      setShowModalDelete(false);
      
  };

  const handleCancelDeleteAccount = () => {
    setShowModalDelete(false);
  };


  
  return (
    <div>
  <Header />
  {!cookies.username && (
    <div id="contentSesion">
      <div className="container">
        <form id="formSesion">
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
          <div className="button-group">
            <button onClick={handleLogin}>Iniciar sesión</button>
          </div>
        </form>
        <a href="/registro">
          <button>Registrarse</button>
        </a>
      </div>
    </div>
  )}
  {cookies.username && (
    <div id="contentPerfil">
      <div className="container">
        <p>¿Deseas modificar algo de tu perfil, {cookies.username}?</p>
        <button className="btn btn-primary" onClick={handleEditPassword}>
          Cambiar contraseña
        </button>
        <br />
        <button className="btn btn-warning" onClick={handleLogout}>
          Cerrar sesión
        </button>

        <Modal show={showModalChange} onHide={handleCancelChangePassword}>
          <Modal.Header closeButton>
            <Modal.Title>Cambiar contraseña</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {error && <p className="error-message">{error}</p>}
            <form id='formInicioSesion' onSubmit={handleChangePassword}>
              <div className="form-group">
                <label>Contraseña actual:</label>
                <input
                  type="password"
                  name="oldPassword"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Nueva contraseña:</label>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Modal.Footer> 
                <Button variant="secondary" onClick={handleCancelChangePassword}>
                  Cancelar
                </Button>
                <Button variant="primary" type="submit">
                  Cambiar contraseña
                </Button>
              </Modal.Footer>
            </form>
          </Modal.Body>
        </Modal>
        <br />
        <button className="btn btn-danger" onClick={handleDeleteAccount}>
          Eliminar cuenta
        </button>
        <Modal show={showModalDelete} onHide={handleCancelDeleteAccount}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmación</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            ¿Estás seguro de que deseas eliminar tu cuenta?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCancelDeleteAccount}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleConfirmDeleteAccount}>
              Eliminar cuenta
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  )}
</div>

  );
}

export default InicioSesion;
