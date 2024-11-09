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
      scale.set(1);
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
  height: 600px;
  width: 600px;
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
