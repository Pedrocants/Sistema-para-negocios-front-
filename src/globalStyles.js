import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
    font-family: 'Montserrat', sans-serif;
    margin: 0;
    padding: 0;
  }

  h1, h2, h3, h4, h5, h6 {
    color: ${({ theme }) => theme.text};
  }

  button {
    font-family: 'Montserrat', sans-serif;
  }


  .ReactModal__Overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    overflow: hidden;
  }

  .ReactModal__Content {
    position: relative;
    background: black;
    padding: 0;
    border: none;
    max-width: 500px;
    width: 100%;
    max-height: 80vh;
    overflow-y: auto;
    outline: none;
    z-index: 10000;
`;

export default GlobalStyle;