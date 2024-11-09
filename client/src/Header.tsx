import {
  interpolate,
  motion,
  MotionValue,
  useMotionTemplate,
  useTransform,
} from "framer-motion";
import styled from "styled-components";
import {
  confirm,
  manager,
  swipeLeft,
  swipeRight,
  warning,
} from "./assets/icons";
import Icon from "./components/Icon";
import {
  activeColor,
  iconBackground,
  iconColor,
  primaryColor,
} from "./constants";
import { Card, cards, useAppState } from "./state";

export function Header() {
  const {
    animations,
    appState: { state },
  } = useAppState();
  const inAlert =
    state.name === "confirmed" || state.name === "pending-manager";
  const alertId = state.alertId as Card["id"];

  const alertIcon = cards.find((card) => card.id === alertId)?.icon || manager;

  return (
    <Container>
      {inAlert ? (
        <>
          <HeaderButton
            animationValue={animations.leftButton}
            svg={warning}
            size="small"
          />
          <AlertIconContainer>
            <AlertIconWrapper
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <Icon svg={alertIcon} color={iconColor} />
            </AlertIconWrapper>
          </AlertIconContainer>
          <HeaderButton
            animationValue={animations.rightButton}
            svg={warning}
            size="small"
          />
        </>
      ) : (
        <>
          <HeaderButton
            animationValue={animations.leftButton}
            svg={swipeLeft}
          />
          <HeaderButton
            animationValue={animations.middleButton}
            svg={confirm}
          />
          <HeaderButton
            animationValue={animations.rightButton}
            svg={swipeRight}
          />
        </>
      )}
    </Container>
  );
}

function useButtonAnimations(value: MotionValue) {
  const bgOpacity = useTransform(() =>
    interpolate([0, 1], [0, 0.3])(value.get())
  );
  const iconScale = useTransform(() =>
    interpolate([0, 1], [1, 0.9])(value.get())
  );
  return { bgOpacity, iconScale };
}

function HeaderButton({
  svg,
  animationValue,
  size = "normal",
}: {
  svg: string;
  animationValue: MotionValue;
  size?: "small" | "normal";
}) {
  const animations = useButtonAnimations(animationValue);

  return (
    <IconWrapper
      style={{
        height: size === "small" ? "9vh" : "11vh",
        backgroundColor: useMotionTemplate`rgba(0,0,0,${animations.bgOpacity})`,
      }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        style={{ scale: animations.iconScale, width: "100%", height: "100%" }}
      >
        <Icon svg={svg} color={activeColor} />
      </motion.div>
    </IconWrapper>
  );
}

const Container = styled.div`
  position: relative;
  overflow: hidden;
  padding: 1rem;
  background-color: ${primaryColor};
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 1rem;
  border-radius: 8px;
`;

const IconWrapper = styled(motion.div)`
  display: flex;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0);
  aspect-ratio: 1;
`;

const AlertIconWrapper = styled(motion.div)`
  height: 100%;
  aspect-ratio: 1 / 1;
  padding: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AlertIconContainer = styled.div`
  position: relative;
  background-color: ${iconBackground};
  height: 11vh;
  border-radius: 999px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  z-index: 1;
`;
