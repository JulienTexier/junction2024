import styled from "styled-components";
import { Carousel } from "./Carousel";
import { Header } from "./Header";
import { AppStateProvider } from "./state";
import { WebSocketListener } from "./WebSocketListener";

export default function App() {
  return (
    <AppStateProvider>
      <Container>
        <Header />
        <Carousel />
      </Container>
      <WebSocketListener />
    </AppStateProvider>
  );
}

const Container = styled.div`
  position: relative;
  overflow: hidden;
  padding-top: 1rem;
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr;
`;
