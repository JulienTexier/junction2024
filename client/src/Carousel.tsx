import { motion, useMotionValue } from "framer-motion";
import styled from "styled-components";
import { Card } from "./Card";
import { SPRING_OPTIONS } from "./constants";
import { cards, useAppState } from "./state";

export function Carousel() {
  const dragX = useMotionValue(0);
  const { state } = useAppState();
  const cardIndex = state.index;

  return (
    <Container>
      <CardSlider
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        style={{ x: dragX }}
        animate={{ translateX: `-${cardIndex * 100}%` }}
        transition={SPRING_OPTIONS}
      >
        {cards.map((card, idx) => (
          <Card key={idx} idx={idx} cardIndex={cardIndex} card={card} />
        ))}
      </CardSlider>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  overflow: hidden;
  width: 100vw;
  height: 80vh;
`;

const CardSlider = styled(motion.div)`
  display: flex;
  align-items: center;
  margin: 0px;
`;
