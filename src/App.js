import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import Navbar from './components/Navbar';
import OrdersTable from './components/OrdersTable';
import Products from './components/Products';
import { darkTheme } from './components/theme';
import GlobalStyle from './globalStyles';
import styled from 'styled-components';
import { useAuth0 } from '@auth0/auth0-react';
import Modal from 'react-modal';
import { obtenerDatos } from './helper/traeDatos';
import { mostrarOrdenes, mostrarProductos, obtenerIdUsuario } from './helper/url';
import OrderDetail from './components/OrdenDetalle';
import InsumoTable from './components/InsumoTable';
import ProductoDetalleInfo from './components/ProductoDetalleInfo';
import ScrollToTop from './helper/ScrollToTop';

Modal.setAppElement('#root');

const HeaderContainer = styled.header`
  background-color: ${({ theme }) => theme.background};
  position: fixed;
  top: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  padding: 10px 0;
`;

const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 15px;
`;

const Title = styled.h1`
  font-size: 32px;
  color: ${({ theme }) => theme.primaryButton};
  font-family: 'Montserrat', sans-serif;
`;

const Logo = styled.img`
  height: 120px;
  margin-bottom: 10px;
`;
const AppBody = styled.div`
  margin-top: 180px;
  padding: 20px;
  background: linear-gradient(180deg, #2c2c2c, #000000);
  min-height: 100vh;
  animation: fadeIn 0.5s ease-in;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

let productosArray;

const cargarProductos = async (token) => {
  const datosProductos = await obtenerDatos(mostrarProductos(), "GET", token);
  productosArray = (Array.isArray(datosProductos)) ? datosProductos : Object.values(datosProductos);
}

const App = () => {

  const { user, isAuthenticated, isLoading, loginWithRedirect, getAccessTokenSilently } = useAuth0();
  const [userId, setUserId] = useState(null);

  const [page, setPage] = useState(0);
  const [orders, setOrdenes] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [idOrden, setIdOrden] = useState(null);
  const [token, setToken] = useState();
  const [status, setUpdateStatus] = useState(false);

  const updateStatus = () => {
    setUpdateStatus(!status);
  }

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      loginWithRedirect();
      return;
    }
  }, [isAuthenticated, isLoading, loginWithRedirect]);
  useEffect(() => {
    try {
      if (user != null) {
        async function cargar() {
          const token = await getAccessTokenSilently();
          if (!token) {
            return;
          }
          setToken(token);
          const userIdEncoded = encodeURIComponent(user.sub);
          const cargarUsuario = await obtenerDatos(obtenerIdUsuario(userIdEncoded), "GET", token);

          let id;
          id = await cargarUsuario;
          setUserId(() => id);
        }
        cargar();
      }
      return;
    } catch (e) {
      console.error(e);
      return;
    }
  }, [!userId, isAuthenticated]);
  useEffect(() => {
    async function cargar() {
      if (!token) {
        return;
      }
      cargarProductos(token);
      const datos = await obtenerDatos(mostrarOrdenes(currentPage, 15), "GET", token);

      let ordenesArray;

      ordenesArray = (Array.isArray(datos)) ? datos['content'] : Object.values(datos.content);
      setPage(() => datos.totalPages);
      setOrdenes(() => ordenesArray);
    }
    cargar();
  }, [currentPage, token, status])

  function onPageChange(pagina) {
    setCurrentPage(pagina);
  }
  function addIdOrden(id) {
    setIdOrden(() => id);
  }

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return isAuthenticated && (
    <ThemeProvider theme={darkTheme}>
      <GlobalStyle />
      <Router>
        <ScrollToTop />
        <HeaderContainer>
          <HeaderTop>
            <Logo src="/442418039_1441156863179431_493331331508367596_n.jpg" alt="Logo de Chepps" />
            <Title>Chepps</Title>
          </HeaderTop>
          {userId && (
            <Navbar userId={userId} token={token} updateStatus={updateStatus} />
          )}
        </HeaderContainer>
        <AppBody>
          <Routes>
            <Route path="/" element={<Navigate to="/ordenes" />} />
            <Route path="/ordenes" element={<OrdersTable orders={orders} addIdOrden={addIdOrden} page={page} onPageChange={onPageChange} />} />
            <Route path="/productos" element={<Products token={token} />} />
            <Route path="/insumos" element={<InsumoTable token={token} />} />
            <Route path="/ordenes/:id" element={<OrderDetail token={token} />} />
            <Route path="/producto/:id" element={<ProductoDetalleInfo token={token} />} />
            <Route path="/productoManufacturado/:id" element={<ProductoDetalleInfo token={token} manufacturado={true} />} />
          </Routes>
        </AppBody>
      </Router>
    </ThemeProvider>


  )
};

export default App;