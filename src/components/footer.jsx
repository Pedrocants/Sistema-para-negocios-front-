import styled from 'styled-components';

const FooterContainer = styled.footer`
  width: 100%;
  background-color: #121212;
  padding: 1rem 0;
  margin-top: 2rem;
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
`;

const PageButton = styled.button`
  margin: 0 0.3rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  background-color: #2c2c2c;
  color: #ccc;
  border: none;
  cursor: pointer;
  font-weight: normal;
  transition: background-color 0.2s;

  &:hover {
    background-color: #3d3d3d;
  }
`;

const PaginationFooter = ({ totalPages, onPageChange, currentPage, setCurrentPage }) => {

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
        onPageChange(pageNumber);
    };

    const renderPageNumbers = () => {
        return [...Array((totalPages <= 10) ? totalPages : 10)].map((_, i) => (
            <PageButton
                key={i}
                onClick={() => handlePageClick(i)}
            >
                {i + 1}
            </PageButton>
        ));
    };

    return (
        <FooterContainer>
            {renderPageNumbers()}
        </FooterContainer>
    );
};

export default PaginationFooter;