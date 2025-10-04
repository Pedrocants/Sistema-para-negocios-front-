import styled from 'styled-components';

export const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  h1, h3 {
    text-align: center;
    color: #ffffff;
  }

  hr {
    border: none;
    height: 1px;
    background: #4a4a4a;
    margin: 1rem 0;
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const Label = styled.label`
  color: #ffffff;
  font-weight: 500;
`;

export const Input = styled.input`
  padding: 0.8rem;
  border: 1px solid #555;
  border-radius: 8px;
  background: #1c1c1e;
  color: white;

  &:focus {
    outline: none;
    border-color: #4c9aff;
  }
`;

export const Select = styled.select`
  padding: 0.8rem;
  border-radius: 8px;
  background: #1c1c1e;
  color: white;
  border: 1px solid #555;

  &:focus {
    outline: none;
    border-color: #4c9aff;
  }
`;

export const Button = styled.button`
  padding: 0.8rem 1.2rem;
  background: linear-gradient(135deg, #4c9aff, #3a7bd5);
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background: linear-gradient(135deg, #3a7bd5, #4c9aff);
  }

  &:nth-child(2) {
    background: #ff4b4b;

    &:hover {
      background: #e63b3b;
    }
  }
`;
export const ButtonHiellow = styled.button`
  background-color: #e0a800;
  color: #000;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: #ffd700;
  }
`;
