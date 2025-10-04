import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { mostrarProductos } from '../helper/url';
import { obtenerDatos } from '../helper/traeDatos';

const ProductsContainer = styled.div`
  margin: 20px 0;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: #333;
  color: #fff;
`;

const TableHeader = styled.th`
  padding: 10px;
  border-bottom: 2px solid #444;
`;

const TableData = styled.td`
  padding: 10px;
  border-bottom: 1px solid #444;
`;
const ButtonViewDetail = styled.button`
  padding: 10px 15px; /* Ajuste de padding */
  background-color: #000; /* Fondo negro */
  color: #ff0000; /* Letras rojas */
  border: 2px solid #ff0000; /* Borde rojo */
  border-radius: 5px; /* Bordes redondeados */
  font-size: 16px; /* Tamaño de letra */
  font-weight: bold; /* Negrita */
  cursor: pointer; /* Indicador de clic */
  transition: all 0.3s ease; /* Transición para efectos */

  &:hover {
    background-color: #222; /* Fondo más claro al pasar el cursor */
    color: #fff; /* Letras blancas */
    border-color: #fff; /* Borde blanco */
  }

  &:active {
    transform: scale(0.95); /* Pequeño efecto de clic */
  }
`;

const SearchInput = styled.input`
  padding: 10px 14px;
  border: none;
  border-radius: 8px;
  background-color: #222;
  color: #fff;
  font-size: 14px;
  width: 250px;
  transition: background-color 0.3s ease;

  &:focus {
    background-color: #333;
    outline: none;
  }

  &::placeholder {
    color: #aaa;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 15px;
`;

const Products = ({ token }) => {
  const [productos, addProductos] = useState();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [productoSearch, setProductoSearch] = useState([]);

  const handlerProductId = (id) => {
    navigate(`/productoManufacturado/${id}`);

  }
  useEffect(() => {
    async function cargar() {
      if (token != null) {
        const url = mostrarProductos();
        const data = await obtenerDatos(url, 'GET', token);
        addProductos(data);
      }
    }
    cargar();
  }, []);

  useEffect(() => {
    if (search === '') {
      return;
    }
    const textos = search.toLowerCase().split(' ');
    const result = productos.filter(p =>
      textos.every(texto => p.denominacion.toLowerCase().includes(texto)
      )
    );
    setProductoSearch(result);
  }, [search]);

  const handlerSearch = (e) => {
    setSearch(e.target.value);
  };

  if (!productos || productos.length === 0) {

    return <h1>Sin productos.</h1>

  }
  return productos && (
    <ProductsContainer>
      <SearchContainer>
        <SearchInput onChange={handlerSearch} type="text" placeholder="Buscar insumo..." />
      </SearchContainer>

      <Table>
        <thead>
          <tr>

            <TableHeader>Numero</TableHeader>
            <TableHeader>Nombre</TableHeader>
            <TableHeader>Precio</TableHeader>

          </tr>
        </thead>
        <tbody>
          {search == '' ? productos.map((producto) => (
            <tr key={producto.idProductoManufacturado}>
              <TableData>#{producto.idProductoManufacturado}</TableData>
              <TableData>{producto.denominacion}</TableData>
              <TableData>${producto.precio}</TableData>

              <TableData>

                <ButtonViewDetail type='button' onClick={() => (handlerProductId(producto.idProductoManufacturado))}>Ver detalle</ButtonViewDetail>
              </TableData>
            </tr>
          )) : productoSearch.map((producto) => (
            <tr key={producto.idProductoManufacturado}>
              <TableData>#{producto.idProductoManufacturado}</TableData>
              <TableData>{producto.denominacion}</TableData>
              <TableData>${producto.precio.toLocaleString('es-AR')}</TableData>
              <TableData>
                <ButtonViewDetail
                  type="button"
                  onClick={() => handlerProductId(producto.idProductoManufacturado)}
                >
                  Ver detalle
                </ButtonViewDetail>
              </TableData>
            </tr>
          ))}
        </tbody>
      </Table>
    </ProductsContainer>
  );
};

export default Products;