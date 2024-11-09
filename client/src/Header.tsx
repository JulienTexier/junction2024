import styled from "styled-components";
import { primaryColor } from "./constants";

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
  background-color: ${primaryColor};
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 1rem;
  padding: 1rem 2rem;
  border-radius: 8px;
`;

const Placeholder = styled.div`
  width: 24px;
  height: 24px;
  background-color: #333;
`;
