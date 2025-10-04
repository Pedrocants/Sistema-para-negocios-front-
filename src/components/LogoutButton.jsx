import { useAuth0 } from '@auth0/auth0-react';
import styled from 'styled-components';
import React from 'react';

const Button = styled.button`
  background-color: #e0a800; /* Fondo amarillo */
  color: #000; /* Letras negras */
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: #ffd700; /* Cambia el color al pasar el mouse */
  }
`;
const LogoutButton = () => {
  const { logout, isAuthenticated } = useAuth0() || {};
  try {
    if (!isAuthenticated || !logout) {
      return null;
    }
    const logoutUrl = process.env.REACT_APP_URL || window.location.origin;

    return (
      <Button onClick={() => logout({ returnTo: logoutUrl })}>
        Cerrar sesión
      </Button>
    );
  } catch (error) {
    console.error(error);
  }
};

export default LogoutButton;