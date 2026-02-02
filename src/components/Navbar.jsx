import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import LogoutButton from './LogoutButton';
import ModalOrdenes from './modalOrdenes';
import ModalProductos from './ModalProductos';
import ConfirmationModal from './ModalConfirm';
import ModalReportes from './ModalReportes';

const NavbarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background-color: ${({ theme }) => theme.navbarBackground};
  padding: 10px 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const NavActions = styled.div`
  display: flex;
  gap: 15px;
  margin-left: auto;
  padding-right: 10px;
  align-items: center;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
    align-items: stretch;
  }
`;

const NavbarItem = styled(Link)`
  color: #fff;
  text-decoration: none;
  font-size: 18px;
  font-weight: 500;
  padding: 8px 12px;
  transition: color 0.3s ease-in-out;

  &:hover {
    color: ${({ theme }) => theme.primaryButton};
  }
`;

const Button = styled.button`
  background-color: ${({ theme }) => theme.primaryButton};
  color: #000;
  border: none;
  padding: 8px 20px;
  height: 100%;
  font-size: 15px;
  cursor: pointer;
  border-radius: 5px;
  transition: all 0.3s ease-in-out;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: #e6b800;
    transition: background-color 0.3s ease;
  }
`;

const Navbar = ({ userId, token, updateStatus }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenProductos, setIsModalOpenProductos] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isModalOpenReport, setModalReport] = useState(false);

  const [textoLabel, setIsLabel] = useState(null);

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const toggleModalProductos = () => setIsModalOpenProductos(!isModalOpenProductos);
  const toggleModalReport = () => setModalReport(!isModalOpenReport);
  const openConfirmationModal = () => setIsConfirmationModalOpen(true);
  const closeConfirmationModal = () => setIsConfirmationModalOpen(false);
  const onLabel = (texto) => setIsLabel(texto);

  return (
    <NavbarContainer>
      <NavLinks>
        <NavbarItem to="/">Volver</NavbarItem>
        <NavbarItem to="/productos">Manufacturados</NavbarItem>
        <NavbarItem to="/insumos">Productos</NavbarItem>
        <NavbarItem to="/ordenes">Órdenes</NavbarItem>
        <Button onClick={toggleModalReport}>Generar reportes</Button>
      </NavLinks>

      <NavActions>
        <Button onClick={toggleModal}>Nueva Orden</Button>
        <Button onClick={toggleModalProductos}>Agregar Producto</Button>
        <LogoutButton />
      </NavActions>

      <ModalOrdenes isModalOpen={isModalOpen} toggleModal={toggleModal} openConfirmationModal={openConfirmationModal} onLabel={onLabel} userId={userId} token={token} />
      <ModalReportes isModalOpen={isModalOpenReport} toggleModal={toggleModalReport} token={token} />
      <ModalProductos isModalOpen={isModalOpenProductos} toggleModal={toggleModalProductos} openConfirmationModal={openConfirmationModal} onLabel={onLabel} token={token} />
      <ConfirmationModal isOpen={isConfirmationModalOpen} onClose={closeConfirmationModal} label={textoLabel} updateStatus={updateStatus} />
    </NavbarContainer>
  );
};

export default Navbar;