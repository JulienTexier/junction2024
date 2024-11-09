import { animate, MotionValue, useMotionValue } from "framer-motion";
import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from "react";

import {
  brokenEquipment,
  overWeight,
  productDefect,
  underWeight,
} from "./assets/icons";

export type Card = {
  id: string;
  icon: string;
  title: {
    en: string;
    fi: string;
  };
};

export const cards: Card[] = [
  {
    id: "over_weight",
    icon: overWeight,
    title: {
      en: "Over weight",
      fi: "Ylipainoinen",
    },
  },
  {
    id: "under_weight",
    icon: underWeight,

    title: {
      en: "Under weight",
      fi: "Alipainoinen",
    },
  },
  {
    id: "broken_equipment",
    icon: brokenEquipment,
    title: {
      en: "Equipment broken",
      fi: "Laiteongelma",
    },
  },
  {
    id: "product_defect",
    icon: productDefect,
    title: {
      en: "Product defect",
      fi: "Virhe tuotteessa",
    },
  },
];

export const infinityCards = Array(100).fill(cards).flat();

type Animations = {
  leftButton: MotionValue;
  rightButton: MotionValue;
  middleButton: MotionValue;
};

type StateAction =
  | "swipe-left"
  | "swipe-right"
  | "confirm-active"
  | "confirm-init"
  | "confirm-complete"
  | "pending-manager"
  | "confirm-abort"
  | "reset";

type State = {
  name: "swiping" | "confirming" | "confirmed" | "pending-manager";
  index: number;
  alertId?: Card["id"];
};

export type AppState = {
  state: State;
  lastMessageAt?: number; // timestamp
  lastMessageAction?: StateAction;
};

const maxIndex = infinityCards.length - 1;

const initialAppState: AppState = {
  lastMessageAt: undefined,
  lastMessageAction: undefined,
  state: {
    name: "swiping",
    index: infinityCards.length / 2,
  },
};

const AppContext = createContext<
  | {
      appState: AppState;
      animations: Animations;
      dispatch: Dispatch<StateAction>;
    }
  | undefined
>(undefined);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const leftButtonAnimation = useMotionValue(0);
  const rightButtonAnimation = useMotionValue(0);
  const middleButtonAnimation = useMotionValue(0);

  const animations = {
    leftButton: leftButtonAnimation,
    rightButton: rightButtonAnimation,
    middleButton: middleButtonAnimation,
  };

  const [state, dispatch] = useReducer(
    (current: AppState, action: StateAction) =>
      determineNextState(current, action, animations),
    initialAppState
  );

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") dispatch("swipe-right");
      if (event.key === "ArrowRight") dispatch("swipe-left");
      if (event.key === "ArrowDown") dispatch("confirm-init");
      if (event.key === "ArrowUp") dispatch("confirm-abort");
      if (event.key === "ArrowUp" && event.metaKey) {
        dispatch("reset");
        window.alert("Manager has acknowledged the alert");
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // useApiSimulation(websocket);

  return (
    <AppContext.Provider value={{ appState: state, animations, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const state = useContext(AppContext);

  if (state === undefined) {
    throw new Error("useAppState must be used within AppStateProvider");
  }

  return state;
}

// Helpers

function determineNextState(
  appState: AppState,
  action: StateAction,
  animations: Animations
): AppState {
  const { state } = appState;

  if (action === "swipe-left" && state.name === "swiping") {
    animate(animations.rightButton, 1, {
      duration: 0.5,
      onComplete: () => animate(animations.rightButton, 0, { duration: 0.5 }),
    });

    return {
      lastMessageAt: Date.now(),
      lastMessageAction: action,
      state: {
        name: "swiping",
        index: state.index === 0 ? maxIndex : Math.max(state.index - 1, 0),
      },
    };
  }

  if (action === "swipe-right" && state.name === "swiping") {
    animate(animations.leftButton, 1, {
      duration: 0.5,
      onComplete: () => animate(animations.leftButton, 0, { duration: 0.5 }),
    });

    return {
      lastMessageAt: Date.now(),
      lastMessageAction: action,
      state: {
        name: "swiping",
        index:
          state.index === maxIndex ? 0 : Math.min(state.index + 1, maxIndex),
      },
    };
  }

  if (action === "confirm-init" && state.name === "swiping") {
    animate(animations.middleButton, 1);

    return {
      lastMessageAt: Date.now(),
      lastMessageAction: action,
      state: {
        name: "confirming",
        index: state.index,
      },
    };
  }

  if (action === "confirm-complete" && state.name === "confirming") {
    animate(animations.middleButton, 0);

    return {
      lastMessageAt: Date.now(),
      lastMessageAction: action,
      state: {
        name: "confirmed",
        index: state.index,
        alertId: infinityCards[state.index].id,
      },
    };
  }

  if (action === "confirm-active" && state.name === "confirming") {
    animate(animations.middleButton, 0);

    return {
      lastMessageAt: Date.now(),
      lastMessageAction: action,
      state: {
        name: "swiping",
        index: state.index,
      },
    };
  }

  if (action === "pending-manager" && state.name === "confirmed") {
    return {
      lastMessageAt: Date.now(),
      lastMessageAction: action,
      state: {
        name: "pending-manager",
        index: state.index,
        alertId: state.alertId,
      },
    };
  }

  if (action === "confirm-abort" && state.name === "confirming") {
    animate(animations.middleButton, 0);

    return {
      lastMessageAt: Date.now(),
      lastMessageAction: action,
      state: {
        name: "swiping",
        index: state.index,
      },
    };
  }

  if (action === "reset") {
    animate(animations.middleButton, 0);
    animate(animations.leftButton, 0);
    animate(animations.rightButton, 0);

    return initialAppState;
  }

  return appState;
}
