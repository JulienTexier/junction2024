import { useEffect } from "react";

export type ActionType = number | "confirming";

type UseArrowKeyNavigationProps = {
  cardIndex: number;
  maxIndex: number;
  onAction: (action: ActionType) => void;
};

export function useArrowKeyNavigation({
  cardIndex,
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
          onAction(cardIndex === maxIndex ? 0 : cardIndex + 1);
          break;
        case "ArrowLeft":
          // Loop to the last image if at index 0, otherwise move backward
          onAction(cardIndex === 0 ? maxIndex : cardIndex - 1);
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
  }, [cardIndex, maxIndex, onAction]);
}
