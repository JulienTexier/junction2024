import { motion } from "framer-motion";
import styled from "styled-components";
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
  isConfirming,
}: {
  cardIndex: number;
  card: Card;
  idx: number;
  isConfirming: boolean;
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
      <Confirm currentIndex={idx === cardIndex} isConfirming={isConfirming} />
      <IconWrapper>
        <Icon dangerouslySetInnerHTML={{ __html: card.icon }} />
      </IconWrapper>
      <EnglishText>{card.title.en}</EnglishText>
      <FinnishText>{card.title.fi}</FinnishText>
    </CardWrapper>
  );
}

const CardWrapper = styled(motion.div)`
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
  position: absolute;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  text-align: center;
`;

const Icon = styled.div`
  color: ${iconColor};
`;
