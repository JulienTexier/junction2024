import { animate, MotionValue, useMotionValue } from "framer-motion";
import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { WebSocketHook } from "react-use-websocket/dist/lib/types";
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
};

const messageThrottle = 1000;
const maxIndex = infinityCards.length - 1;
const socketUrl = "wss://echo.websocket.org"; // TODO: 'ws://localhost:8080'

const initialAppState: AppState = {
  lastMessageAt: undefined,
  state: {
    name: "swiping",
    index: infinityCards.length / 2,
  },
};

const AppContext = createContext<
  | {
      state: State;
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" && (e.ctrlKey || e.metaKey)) {
        dispatch("reset");
        window.alert("Manager reset");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const [state, dispatch] = useReducer(
    (current: AppState, action: StateAction) =>
      determineNextState(current, action, animations),
    initialAppState
  );

  const websocket = useWebSocket(socketUrl, {
    onMessage: (event) => {
      const data = parseApiPayload(event.data);
      const now = Date.now();

      // Only handle messages every 1 second
      if (state.lastMessageAt && now - state.lastMessageAt < messageThrottle) {
        return;
      }

      if (isApiPayload(data)) {
        const action = mapApiActionToStateAction[data.action as ApiAction];
        if (action) dispatch(action);
      }
    },
  });

  useApiSimulation(websocket);

  return (
    <AppContext.Provider value={{ state: state.state, animations, dispatch }}>
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

const mapApiActionToStateAction = {
  left_swipe: "swipe-left",
  right_swipe: "swipe-right",
  double_press_confirmed: "confirm-init",
  double_press_abort: "confirm-abort",
} as const;

type ApiAction = keyof typeof mapApiActionToStateAction;

function determineNextState(
  appState: AppState,
  action: StateAction,
  animations: Animations
): AppState {
  const { state } = appState;
  const next = { state, lastMessageAt: Date.now() };

  if (action === "swipe-left" && state.name === "swiping") {
    next.state.index =
      state.index === 0 ? maxIndex : Math.max(state.index - 1, 0);

    animate(animations.leftButton, 1, {
      duration: 0.5,
      onComplete: () => animate(animations.leftButton, 0, { duration: 0.5 }),
    });
  }

  if (action === "swipe-right" && state.name === "swiping") {
    next.state.index =
      state.index === maxIndex ? 0 : Math.min(state.index + 1, maxIndex);

    animate(animations.rightButton, 1, {
      duration: 0.5,
      onComplete: () => animate(animations.rightButton, 0, { duration: 0.5 }),
    });
  }

  if (action === "confirm-init" && state.name === "swiping") {
    next.state.name = "confirming";

    animate(animations.middleButton, 1);
  }

  if (action === "confirm-complete" && state.name === "confirming") {
    next.state.name = "confirmed";
    next.state.alertId = infinityCards[state.index].id;

    animate(animations.middleButton, 0);
  }

  if (action === "pending-manager" && state.name === "confirmed") {
    next.state.name = "pending-manager";
  }

  if (action === "confirm-abort" && state.name === "confirming") {
    next.state.name = "swiping";

    animate(animations.middleButton, 0);
  }

  if (action === "reset") {
    next.state.name = "swiping";
    next.state.alertId = undefined;

    animate(animations.middleButton, 0);
    animate(animations.leftButton, 0);
    animate(animations.rightButton, 0);
  }

  return next;
}

type ApiMessage = { action: ApiAction };

function isApiPayload(message: any): message is ApiMessage {
  return message && typeof message === "object" && "action" in message;
}

function parseApiPayload(message: any) {
  try {
    return JSON.parse(message);
  } catch (_) {
    return null;
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function useApiSimulation(webhook: WebSocketHook) {
  const { readyState, sendJsonMessage } = webhook;

  useEffect(() => {
    const send = (action: ApiMessage) => sendJsonMessage(action);

    async function simulateApi() {
      send({ action: "left_swipe" });
      await sleep(2000);
      send({ action: "right_swipe" });
      await sleep(2000);
      send({ action: "right_swipe" });
      await sleep(2000);
      send({ action: "double_press_confirmed" });
      await sleep(5000);
      send({ action: "right_swipe" });
    }

    if (readyState === ReadyState.OPEN) {
      simulateApi();
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") send({ action: "left_swipe" });
      if (event.key === "ArrowRight") send({ action: "right_swipe" });
      if (event.key === "ArrowDown") send({ action: "double_press_confirmed" });
      if (event.key === "ArrowUp") send({ action: "double_press_abort" });
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [readyState]);
}
