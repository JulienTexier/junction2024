import styled from "styled-components";
import { Carousel } from "./Carousel";
import { Header } from "./Header";
import { AppStateProvider } from "./state";
import { memo } from "react";

export default function App() {
  return (
    <AppStateProvider>
      <Memoed />
    </AppStateProvider>
  );
}

function Lol() {
  console.log("rendering");
  return (
    <Container>
      <Header />
      <Carousel />
    </Container>
  );
}

const Memoed = memo(Lol);

const Container = styled.div`
  position: relative;
  overflow: hidden;
  padding-top: 1rem;
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr;
`;