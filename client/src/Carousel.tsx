import { motion, useMotionValue } from "framer-motion";
import { useState } from "react";
import styled from "styled-components";
import { Card } from "./Card";
import { SPRING_OPTIONS } from "./constants";
import { ActionType, useArrowKeyNavigation } from "./hook";
import { cards } from "./state";

export function Carousel() {
  const [cardIndex, setCardIndex] = useState(0);
  const [isConfirming, setIsConfirming] = useState(false);
  const dragX = useMotionValue(0);

  const handleAction = (action: ActionType) => {
    if (action === "confirming") {
      setIsConfirming(true);
    } else {
      setCardIndex(action);
    }
  };

  useArrowKeyNavigation({
    cardIndex,
    maxIndex: cards.length - 1,
    onAction: handleAction,
  });

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
          <Card
            key={idx}
            idx={idx}
            cardIndex={cardIndex}
            card={card}
            isConfirming={isConfirming}
          />
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
