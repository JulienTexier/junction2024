import styled from "styled-components";

export function Header() {
  return (
    <Container>
      <Placeholder />
      <Placeholder />
      <Placeholder />
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  overflow: hidden;
  padding-top: 1rem;
  padding-bottom: 1rem;
  height: 5vh;
  border-bottom: 1px solid #c3c3c3;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 2.5rem;
  padding-right: 2.5rem;
`;

const Placeholder = styled.div`
  width: 24px;
  height: 24px;
  background-color: #333;
`;
