import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { obtenerDatos } from '../helper/traeDatos';
import { getInsumos } from '../helper/url';

const ProductsContainer = styled.div`
  margin: 20px 0;
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 15px;
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

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: #333;
  color: #fff;
`;

const TableHeader = styled.th`
  padding: 10px;
  border-bottom: 1px solid #555;
`;

const TableData = styled.td`
  padding: 10px;
  border-bottom: 1px solid #444;
`;

const ButtonViewDetail = styled.button`
  padding: 6px 12px;
  background-color: #555;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #777;
  }
`;

const InsumoTable = ({ token }) => {
    const [insumos, setInsumos] = useState();
    const [search, setSearch] = useState('');
    const [insumoSearch, setInsumoSearch] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function cargar() {
            if (token != null) {
                const url = getInsumos();
                const data = await obtenerDatos(url, 'GET', token);
                setInsumos(data);
            }
        }
        cargar();
    }, []);

    useEffect(() => {
        if (search === '') {
            return;
        }
        const textos = search.toLowerCase().split(' ');
        const result = insumos.filter(p =>
            textos.every(texto => p.denominacion.toLowerCase().includes(texto)
            )
        );
        setInsumoSearch(result);
    }, [search]);

    const handlerSearch = (e) => {
        setSearch(e.target.value);
    };
    const handlerProductId = (id) => {
        navigate(`/producto/${id}`);
    };
    if (!insumos || insumos.length === 0) {

        return <h1>Sin productos.</h1>

    }

    return (
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
                        <TableHeader></TableHeader>
                    </tr>
                </thead>
                <tbody>
                    {search == '' ? insumos.map((producto) => (
                        <tr key={producto.idInsumo}>
                            <TableData>#{producto.idInsumo}</TableData>
                            <TableData>{producto.denominacion}</TableData>
                            <TableData>${producto.precio.toLocaleString('es-AR')}</TableData>
                            <TableData>
                                <ButtonViewDetail
                                    type="button"
                                    onClick={() => handlerProductId(producto.idInsumo)}
                                >
                                    Ver detalle
                                </ButtonViewDetail>
                            </TableData>
                        </tr>
                    )) : insumoSearch.map((producto) => (
                        <tr key={producto.idInsumo}>
                            <TableData>#{producto.idInsumo}</TableData>
                            <TableData>{producto.denominacion}</TableData>
                            <TableData>${producto.precio.toLocaleString('es-AR')}</TableData>
                            <TableData>
                                <ButtonViewDetail
                                    type="button"
                                    onClick={() => handlerProductId(producto.idInsumo)}
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
}

export default InsumoTable;