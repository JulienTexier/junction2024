import { AnimatePresence, motion, useSpring } from "framer-motion";
import { useEffect } from "react";
import styled from "styled-components";
import { manager } from "./assets/icons";
import Icon from "./components/Icon";
import { ConfirmComplete } from "./ConfirmComplete";
import { ConfirmProgress } from "./ConfirmProgress";
import {
  iconBackground,
  iconColor,
  primaryColor,
  SPRING_OPTIONS,
} from "./constants";
import { useAppState, type Card } from "./state";

export function Card({ card, idx }: { card: Card; idx: number }) {
  const scale = useSpring(1, SPRING_OPTIONS);
  const iconScale = useSpring(1, SPRING_OPTIONS);
  const {
    appState: { state },
  } = useAppState();
  const currentCardIndex = state.index;
  const isCurrentCard = idx === currentCardIndex;
  const isConfirming = state.name === "confirming";
  const isConfirmed = state.name === "confirmed";
  const isPendingManager = state.name === "pending-manager";

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
    <CardWrapper style={{ scale }}>
      {isPendingManager ? (
        <>
          <AnimatePresence>
            <IconContainer
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <Icon svg={manager} />
            </IconContainer>
          </AnimatePresence>

          <EnglishText>Manager alerted</EnglishText>
          <FinnishText>Manageri kutsuttu</FinnishText>
        </>
      ) : (
        <>
          <IconContainer style={{ backgroundColor: iconBackground }}>
            {isPendingManager ? (
              <Icon svg={manager} />
            ) : (
              <IconWrapper style={{ scale: iconScale }}>
                <Icon svg={card.icon} color={iconColor} />
              </IconWrapper>
            )}

            {isCurrentCard && (
              <AnimatePresence>
                {isConfirming && <ConfirmProgress />}
                {isConfirmed && <ConfirmComplete />}
              </AnimatePresence>
            )}
          </IconContainer>

          <EnglishText>{card.title.en}</EnglishText>
          <FinnishText>{card.title.fi}</FinnishText>
        </>
      )}
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

const IconContainer = styled(motion.div)`
  position: relative;
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
