import { useEffect } from "react";

export type ActionType = number | "confirming";

type UseArrowKeyNavigationProps = {
  imgIndex: number;
  maxIndex: number;
  onAction: (action: ActionType) => void;
};

export function useArrowKeyNavigation({
  imgIndex,
  maxIndex,
  onAction,
}: UseArrowKeyNavigationProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowRight", "ArrowLeft", "ArrowUp"].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case "ArrowRight":
          // Loop to the first image if at maxIndex, otherwise move forward
          onAction(imgIndex === maxIndex ? 0 : imgIndex + 1);
          break;
        case "ArrowLeft":
          // Loop to the last image if at index 0, otherwise move backward
          onAction(imgIndex === 0 ? maxIndex : imgIndex - 1);
          break;
        case "ArrowUp":
          // Trigger "confirming" action
          onAction("confirming");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [imgIndex, maxIndex, onAction]);
}
