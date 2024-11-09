import { motion } from "framer-motion";
import styled from "styled-components";
import Icon from "./components/Icon";
import { Confirm } from "./Confirm";
import {
  iconBackground,
  iconColor,
  primaryColor,
  SPRING_OPTIONS,
} from "./constants";
import type { Card } from "./state";

export function Card({
  cardIndex,
  card,
  idx,
}: {
  cardIndex: number;
  card: Card;
  idx: number;
}) {
  return (
    <CardWrapper
      key={idx}
      style={{
        transform: `translateX(${(idx - cardIndex) * 100}%)`,
      }}
      animate={{ scale: cardIndex === idx ? 0.95 : 0.85 }}
      transition={SPRING_OPTIONS}
    >
      <Confirm currentIndex={idx === cardIndex} />
      <IconContainer>
        <IconWrapper>
          <Icon svg={card.icon} color={iconColor} />
        </IconWrapper>
      </IconContainer>
      <EnglishText>{card.title.en}</EnglishText>
      <FinnishText>{card.title.fi}</FinnishText>
    </CardWrapper>
  );
}

const CardWrapper = styled(motion.div)`
  aspect-ratio: 16 / 9;
  width: 100vw;
  height: 80vh;
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
`;

const EnglishText = styled.div`
  color: white;
  font-size: 4vw;
`;

const FinnishText = styled.div`
  color: white;
  font-size: 2vw;
`;

const IconContainer = styled.div`
  background-color: ${iconBackground};
  height: 60%;
  aspect-ratio: 1 / 1;
  border-radius: 999px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  z-index: 1;
`;

const IconWrapper = styled.div`
  height: 30vh;
  aspect-ratio: 1 / 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;
