import styled from 'styled-components';

export const RadioGroup = styled.div` display: flex;
flex-direction: column;
gap: 1rem;
padding: 1rem;
background-color: #1e1e1e;
border-radius: 8px;
color: #f0f0f0;
max-width: 100%;
`;

export const RadioOption = styled.div` display: flex;
align-items: center;
gap: 0.5rem;
`;

export const RadioInput = styled.input` accent-color: #4f46e5;
width: 18px;
height: 18px;
`;

export const RadioLabel = styled.label` font-size: 1rem;
cursor: pointer;

@media (max-width: 600px) {
  font-size: 0.95rem;
}

`;