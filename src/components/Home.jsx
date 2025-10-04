import React from 'react';
import styled from 'styled-components';

const HomeContainer = styled.div`
  text-align: center;
  color: #ffffff; /* Texto blanco */
  background-color: #1b1b1b; /* Fondo oscuro */
  height: 100vh;
  padding: 20px;
`;

const CompanyImage = styled.img`
  width: 200px;
  margin-top: 20px;
`;

const CompanyName = styled.h1`
  font-family: 'Montserrat', sans-serif;
  font-size: 48px;
  margin-top: 10px;
  color: #ffc107; /* Amarillo */
`;

const Home = () => {
  return (
    <HomeContainer>
      <CompanyImage src="ruta/a/imagen.png" alt="Logo de Chepps" />
      <CompanyName>Chepps</CompanyName>
    </HomeContainer>
  );
};

export default Home;