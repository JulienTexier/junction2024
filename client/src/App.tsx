import styled from "styled-components";
import { Carousel } from "./Carousel";
import { Header } from "./Header";
import { AppStateProvider } from "./state";

export default function App() {
  return (
    <AppStateProvider>
      <Container>
        <Header />
        <Carousel />
      </Container>
    </AppStateProvider>
  );
}

const Container = styled.div`
  position: relative;
  overflow: hidden;
  padding-top: 1rem;
  padding-bottom: 1rem;
  width: 100vw;
`;
