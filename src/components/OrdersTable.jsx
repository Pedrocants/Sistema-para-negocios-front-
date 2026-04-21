import styled from 'styled-components';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PaginationFooter from './footer';

const TableContainer = styled.div`
  margin: 20px 0;
  overflow-x: auto;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  background: linear-gradient(135deg, #1a1a1a, #333);
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
  color: #fff;
`;

const TableHeader = styled.th`
  padding: 16px;
  background-color: #222;
  color: #f0f0f0;
  text-align: left;
  border-bottom: 3px solid #555;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const TableRow = styled.tr`
  &:hover {
    background-color: #2a2a2a;
  }
`;

const TableData = styled.td`
  padding: 16px;
  border-bottom: 1px solid #444;
  vertical-align: middle;

  &:last-child {
    display: flex;
    gap: 10px;
  }
`;

const Button = styled.button`
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(255, 255, 255, 0.2);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const ButtonViewDetail = styled(Button)`
  background: #ff4d4d;
  color: #fff;
  border: 2px solid #ff4d4d;

  &:hover {
    background: transparent;
    color: #ff4d4d;
  }
`;
const OrdersTable = ({ orders, addIdOrden, page, onPageChange }) => {

  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [search, setSearch] = useState(0);

  if (!orders || orders.length === 0) {
    return <h1>Sin ordenes.</h1>;
  }

  const handleViewDetail = (id) => {
    addIdOrden(id);
    navigate(`/ordenes/${id}`);
  };

  const handleSearch = (e) => {
    const id = e.target.value;
    if (!isNaN(id) && id >= 0) {
      setSearch(id);
    }
    return;
  };

  return (
    <>
      <TableContainer>

        <SearchContainer>
          <SearchInput onChange={handleSearch} type="number" placeholder="Buscar..." />
          <ButtonViewDetail onClick={() => handleViewDetail(search)}>Buscar</ButtonViewDetail>
        </SearchContainer>

        <Table>
          <thead>
            <tr>
              <TableHeader>ID</TableHeader>
              <TableHeader>Cliente</TableHeader>
              <TableHeader>Total</TableHeader>
              <TableHeader>Pagado</TableHeader>
              <TableHeader>Detalles</TableHeader>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <TableRow key={order.idOrden}>
                <TableData>#{order.idOrden}</TableData>
                <TableData>{order.cliente}</TableData>
                <TableData>${order.total.toLocaleString('es-AR')}</TableData>
                <TableData style={{ color: order?.estado === 'pagada' ? '#00e676' : '#ff1744' }}>
                  {order?.estado === 'pagada' ? 'Sí' : 'No'}
                </TableData>
                <TableData>
                  <ButtonViewDetail onClick={() => handleViewDetail(order.idOrden)}>Ver Detalle</ButtonViewDetail>
                </TableData>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </TableContainer>

      <PaginationFooter
        totalPages={page}
        onPageChange={onPageChange}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </>
  )
};

export default OrdersTable