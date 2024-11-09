import styled from "styled-components";
import { Carousel } from "./Carousel";
import { Header } from "./Header";

export default function App() {
  return (
    <Container>
      <Header />
      <Carousel />
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  overflow: hidden;
  padding-top: 1rem;
  padding-bottom: 1rem;
  width: 100vw;
`;
