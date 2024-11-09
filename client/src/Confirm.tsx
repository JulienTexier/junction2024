import { animate, motion, useMotionValue } from "framer-motion";
import { useEffect } from "react";
import styled from "styled-components";
import Icon from "./components/Icon";
import { iconColor, nonActiveColor } from "./constants";
import { useAppState } from "./state";

const confirmed = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <path d="M16 3C8.8 3 3 8.8 3 16s5.8 13 13 13 13-5.8 13-13c0-1.398-.188-2.793-.688-4.094L26.688 13.5c.2.8.313 1.602.313 2.5 0 6.102-4.898 11-11 11S5 22.102 5 16 9.898 5 16 5c3 0 5.695 1.195 7.594 3.094L25 6.688C22.7 4.386 19.5 3 16 3Zm11.281 4.281L16 18.563l-4.281-4.282-1.438 1.438 5 5 .719.687.719-.687 12-12Z" />
</svg>
`;

export function Confirm({ currentIndex }: { currentIndex: boolean }) {
  const progress = useMotionValue(100);
  const scale = useMotionValue(0);
  const { state, dispatch } = useAppState();
  const isConfirming = state.name === "confirming";
  const isConfirmed = state.name === "confirmed";

  useEffect(() => {
    if (!currentIndex) return;

    if (isConfirming) {
      animate(progress, 0, {
        duration: 2,
        onComplete: () => {
          dispatch("confirm-complete");
          scale.set(0);
        },
      });
    }

    return () => {
      progress.set(100);
      scale.set(0);
    };
  }, [isConfirming]);

  return (
    <>
      {isConfirmed ? (
        <ConfirmedWrapper
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          onAnimationComplete={() => {
            if (!currentIndex) return;
            setTimeout(() => {
              dispatch("reset");
            }, 2000);
          }}
        >
          <Icon svg={confirmed} color={iconColor} />
        </ConfirmedWrapper>
      ) : (
        <ConfirmWrapper
          width="120"
          height="120"
          viewBox="0 0 120 120"
          style={{ scale }}
          animate={{ scale: isConfirming ? 1 : 0 }}
          initial={{ scale: 0 }}
          exit={{ scale: 0 }}
        >
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="rgba(0, 0, 0, 0.2)"
            strokeWidth="12"
          />
          <motion.circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke={iconColor}
            strokeWidth="12"
            pathLength="100"
            strokeDasharray="100"
            strokeDashoffset={progress}
          />
        </ConfirmWrapper>
      )}
    </>
  );
}

const ConfirmWrapper = styled(motion.svg)`
  height: 70%;
  width: auto;
  aspect-ratio: 1 / 1;
  border-radius: 999px;
  position: absolute;
  top: 5%; // TODO: FIX THIS
  z-index: 0;
`;

const ConfirmedWrapper = styled(motion.div)`
  display: block;
  border-radius: 20px;
  background-color: ${nonActiveColor};
  position: absolute;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  text-align: center;
  z-index: 1;
  height: 90%;
  aspect-ratio: 1 / 1;
  z-index: 10;
`;
