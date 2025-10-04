import Modal from 'react-modal';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const ModalContent = styled.div`
  background: linear-gradient(135deg, #1c1c1c, #2a2a2a);
  padding: 30px;
  border-radius: 12px;
  color: #fff;
  max-width: 500px;
  width: 100%;
  text-align: center;
  animation: ${fadeIn} 0.3s ease-out;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.6);
`;

const Title = styled.h2`
  font-size: 22px;
  margin-bottom: 20px;
  color: #ffd700;
  letter-spacing: 0.5px;
`;

const Button = styled.button`
  background: ${({ theme }) => theme.primaryButton || "#ffd700"};
  color: #000;
  border: none;
  padding: 12px 18px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #e0a800;
  }
`;

const ConfirmationModal = ({ isOpen, onClose, label, updateStatus }) => {
  const handlerClose = () => {
    updateStatus();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Confirmación"
      style={{
        overlay: {
          background: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(5px)",
          zIndex: 1000,
        },
        content: {
          width: "fit-content",
          margin: "auto",
          padding: 0,
          borderRadius: "12px",
          background: "transparent",
          border: "none",
        },
      }}
    >
      <ModalContent>
        <Title>{label ?? "Cargado con exito!"}</Title>
        <Button type="button" onClick={handlerClose}>
          Cerrar
        </Button>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmationModal;