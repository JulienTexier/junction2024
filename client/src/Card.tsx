import { useEffect } from "react";
import { AnimatePresence, motion, useSpring } from "framer-motion";
import styled from "styled-components";
import Icon from "./components/Icon";
import {
  iconBackground,
  iconColor,
  primaryColor,
  SPRING_OPTIONS,
} from "./constants";
import { useAppState, type Card } from "./state";
import { ConfirmProgress } from "./ConfirmProgress";
import { ConfirmComplete } from "./ConfirmComplete";

export function Card({ card, idx }: { card: Card; idx: number }) {
  const scale = useSpring(1, SPRING_OPTIONS);
  const iconScale = useSpring(1, SPRING_OPTIONS);
  const { state } = useAppState();
  const currentCardIndex = state.index;
  const isCurrentCard = idx === currentCardIndex;
  const isConfirming = state.name === "confirming";
  const isConfirmed = state.name === "confirmed";

  useEffect(() => {
    if (isCurrentCard) {
      scale.set(1);
    } else {
      scale.set(0.95);
    }
  }, [isCurrentCard]);

  useEffect(() => {
    if (isConfirming) {
      iconScale.set(0.85);
    } else {
      iconScale.set(1);
    }
  }, [isConfirming]);

  return (
    <CardWrapper key={idx} style={{ scale }}>
      <IconContainer>
        <IconWrapper style={{ scale: iconScale }}>
          <Icon svg={card.icon} color={iconColor} />
        </IconWrapper>

        {isCurrentCard && (
          <AnimatePresence>
            {isConfirming && <ConfirmProgress />}
            {isConfirmed && <ConfirmComplete />}
          </AnimatePresence>
        )}
      </IconContainer>

      <EnglishText>{card.title.en}</EnglishText>
      <FinnishText>{card.title.fi}</FinnishText>
    </CardWrapper>
  );
}

const CardWrapper = styled(motion.div)`
  width: 100%;
  height: 100%;
  padding: 8%;
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
  position: relative;
  background-color: ${iconBackground};
  flex: 1;
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

const IconWrapper = styled(motion.div)`
  height: 70%;
  aspect-ratio: 1 / 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;
