import { motion } from "framer-motion";
import styled from "styled-components";
import { Card } from "./Card";
import { SPRING_OPTIONS } from "./constants";
import { cards, useAppState } from "./state";

export function Carousel() {
  const { state } = useAppState();
  const currentCardIndex = state.index;

  return (
    <Container>
      <CardSlider
        animate={{ translateX: `-${currentCardIndex * 100}%` }}
        transition={SPRING_OPTIONS}
      >
        {cards.map((card, idx) => (
          <Card key={idx} idx={idx} card={card} />
        ))}
      </CardSlider>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  overflow: hidden;
  width: 100vw;
  padding: 1rem;
`;

const CardSlider = styled(motion.div)`
  display: flex;
  align-items: center;
  height: 100%;
`;
