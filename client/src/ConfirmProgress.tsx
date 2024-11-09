import { useEffect } from "react";
import { animate, motion, useMotionValue } from "framer-motion";
import styled from "styled-components";
import { iconColor } from "./constants";
import { useAppState } from "./state";

export function ConfirmProgress() {
  const progress = useMotionValue(100);
  const { dispatch } = useAppState();

  useEffect(() => {
    animate(progress, 0, {
      duration: 2,
      onComplete: () => {
        dispatch("confirm-complete");
      },
    });

    return () => {
      progress.stop();
    };
  }, []);

  return (
    <ConfirmWrapper
      viewBox="0 0 120 120"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
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
  );
}

const ConfirmWrapper = styled(motion.svg)`
  inset: 0px;
  border-radius: 999px;
  position: absolute;
  z-index: 1;
`;
