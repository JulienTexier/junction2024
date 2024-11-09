import { animate, motion, useMotionValue } from "framer-motion";
import { useEffect } from "react";
import styled from "styled-components";
import { iconColor } from "./constants";

export function Confirm({
  currentIndex,
  isConfirming,
}: {
  currentIndex: boolean;
  isConfirming: boolean;
}) {
  console.log("isConfirming", isConfirming);
  const progress = useMotionValue(100);
  const scale = useMotionValue(0);

  useEffect(() => {
    if (!currentIndex) return;
    if (isConfirming) {
      animate(progress, 0, {
        duration: 2,
        onComplete: () => {
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
