import { motion, useMotionValue } from "framer-motion";
import { useState } from "react";
import styled from "styled-components";
import { iconBackground, iconColor, primaryColor } from "./constants";
import { ActionType, useArrowKeyNavigation } from "./hook";
import { cards } from "./state";

const SPRING_OPTIONS = {
  type: "spring",
  mass: 3,
  stiffness: 400,
  damping: 50,
};

export function Carousel() {
  const [cardIndex, setCardIndex] = useState(0);
  const dragX = useMotionValue(0);

  const handleAction = (action: ActionType) => {
    if (action === "confirming") {
      window.alert("Confirmed");
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
        <Cards cardIndex={cardIndex} />
      </CardSlider>
    </Container>
  );
}

const Cards = ({ cardIndex }: { cardIndex: number }) => {
  return (
    <>
      {cards.map((card, idx) => (
        <Card
          key={idx}
          style={{
            backgroundImage: `url(${card})`,
            transform: `translateX(${(idx - cardIndex) * 100}%)`,
          }}
          animate={{ scale: cardIndex === idx ? 0.95 : 0.85 }}
          transition={SPRING_OPTIONS}
        >
          <IconWrapper>
            <Icon dangerouslySetInnerHTML={{ __html: card.icon }} />
          </IconWrapper>

          <EnglishText>{card.title.en}</EnglishText>
          <FinnishText>{card.title.fi}</FinnishText>
        </Card>
      ))}
    </>
  );
};

const Container = styled.div`
  position: relative;
  overflow: hidden;
  width: 100vw;
`;

const CardSlider = styled(motion.div)`
  display: flex;
  align-items: center;
  margin: 0px;
`;

const Card = styled(motion.div)`
  aspect-ratio: 16 / 9;
  width: 100vw;
  flex-shrink: 0;
  border-radius: 1rem;
  background-color: ${primaryColor};
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
  padding: 4rem 0;
`;

const EnglishText = styled.div`
  color: white;
  font-size: 4rem;
`;

const FinnishText = styled.div`
  color: white;
  font-size: 2rem;
`;

const IconWrapper = styled.div`
  background-color: ${iconBackground};
  height: 560px;
  width: 560px;
  border-radius: 999px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Icon = styled.div`
  color: ${iconColor};
`;
