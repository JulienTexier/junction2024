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

export type Card = {
  icon: string;
  title: {
    en: string;
    fi: string;
  };
};

export const cards: Card[] = [
  {
    icon: `<svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M96.625 102.045c0 4.513 4.318 8.797 8.813 8.797h88.124c4.521 0 8.813-4.31 8.813-8.797H220c0 7-2.785 13.713-7.743 18.663a26.464 26.464 0 0 1-18.695 7.73h-35.249l.008 18.141a70.53 70.53 0 0 1 44.059 23.282A70.31 70.31 0 0 1 220 216.416v52.786a8.788 8.788 0 0 1-2.581 6.221 8.82 8.82 0 0 1-6.231 2.577H87.813a8.82 8.82 0 0 1-6.232-2.577A8.79 8.79 0 0 1 79 269.202v-52.786a70.317 70.317 0 0 1 17.623-46.558 70.54 70.54 0 0 1 44.065-23.279v-18.141h-35.25c-14.63 0-26.438-11.789-26.438-26.393h17.625Zm52.875 61.584c-28.535 0-52.875 24.282-52.875 52.787v43.988h105.75v-43.988c0-28.488-24.34-52.787-52.875-52.787Zm0 17.596a35.104 35.104 0 0 1 17.907 4.874l-24.146 24.097a8.79 8.79 0 0 0-.368 12.029 8.82 8.82 0 0 0 12 1.141l.837-.73 24.147-24.097a35.15 35.15 0 0 1 4.622 22.185 35.17 35.17 0 0 1-9.885 20.4 35.275 35.275 0 0 1-20.292 10.154 35.309 35.309 0 0 1-22.286-4.301 35.217 35.217 0 0 1-15.039-16.974 35.139 35.139 0 0 1-1.556-22.607 35.183 35.183 0 0 1 12.572-18.867 35.29 35.29 0 0 1 21.487-7.304Z" fill="currentColor"/><path d="M107.996 60.876c0-1.81.657-3.405 1.972-4.789l3.998-3.99c1.35-1.349 2.967-2.023 4.85-2.023 1.919 0 3.518.674 4.797 2.022l15.671 15.591V30.226c0-1.845.666-3.344 1.999-4.497 1.332-1.152 2.94-1.729 4.823-1.729h6.823c1.883 0 3.491.576 4.824 1.73 1.332 1.152 1.999 2.651 1.999 4.496v37.461l15.67-15.59c1.279-1.349 2.878-2.023 4.797-2.023 1.919 0 3.518.674 4.797 2.022l3.998 3.991c1.35 1.348 2.025 2.944 2.025 4.79 0 1.88-.675 3.493-2.025 4.841l-34.699 34.642c-1.244 1.312-2.843 1.968-4.797 1.968-1.919 0-3.536-.656-4.851-1.968l-34.699-34.642c-1.315-1.383-1.972-2.997-1.972-4.842Z" fill="currentColor"/></svg>`,
    title: {
      en: "Over weight",
      fi: "Ylipainoinen",
    },
  },
  {
    icon: `<svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M97.375 101.123c0 4.46 4.257 8.694 8.688 8.694h86.875c4.456 0 8.687-4.26 8.687-8.694H219a26.09 26.09 0 0 1-7.634 18.442 26.047 26.047 0 0 1-18.428 7.639h-34.75l.008 17.927a69.487 69.487 0 0 1 43.434 23.007A69.575 69.575 0 0 1 219 214.143v52.163a8.687 8.687 0 0 1-8.687 8.694H88.688a8.686 8.686 0 0 1-6.144-2.546A8.699 8.699 0 0 1 80 266.306v-52.163a69.582 69.582 0 0 1 17.373-46.008 69.488 69.488 0 0 1 43.44-23.004v-17.927h-34.75C91.641 127.204 80 115.555 80 101.123h17.375ZM149.5 161.98c-28.13 0-52.125 23.995-52.125 52.163v43.469h104.25v-43.469c0-28.151-23.995-52.163-52.125-52.163Zm0 17.388a34.548 34.548 0 0 1 17.653 4.816l-23.804 23.812a8.701 8.701 0 0 0-.362 11.887 8.68 8.68 0 0 0 11.83 1.128l.825-.721 23.804-23.813a34.796 34.796 0 0 1-5.188 42.082 34.737 34.737 0 0 1-56.799-10.989 34.796 34.796 0 0 1-1.535-22.34 34.773 34.773 0 0 1 12.394-18.644 34.728 34.728 0 0 1 21.182-7.218Z" fill="currentColor"/><path d="M190.45 64.963c0 1.788-.648 3.365-1.944 4.732l-3.941 3.944c-1.331 1.332-2.925 1.998-4.781 1.998-1.892 0-3.468-.666-4.73-1.998l-15.448-15.407v37.019c0 1.823-.657 3.304-1.97 4.443-1.314 1.14-2.899 1.709-4.756 1.709h-6.726c-1.856 0-3.441-.569-4.755-1.709-1.314-1.139-1.97-2.62-1.97-4.443V58.232L123.98 73.64c-1.261 1.332-2.837 1.998-4.729 1.998-1.891 0-3.468-.666-4.729-1.998l-3.941-3.944c-1.331-1.332-1.996-2.91-1.996-4.732 0-1.858.665-3.453 1.996-4.785l34.207-34.232c1.226-1.298 2.803-1.946 4.729-1.946 1.892 0 3.486.648 4.782 1.946l34.207 34.232c1.296 1.367 1.944 2.962 1.944 4.785Z" fill="#950034"/></svg>`,

    title: {
      en: "Under weight",
      fi: "Alipainoinen",
    },
  },
  {
    icon: `<svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="16.5" y="222.481" width="267" height="41.755" rx="20.877" stroke="#950034" stroke-width="15"/><circle cx="262.623" cy="243.358" r="8.868" fill="#950034"/><circle cx="85.264" cy="243.358" r="8.868" fill="#950034"/><circle cx="129.604" cy="243.358" r="8.868" fill="#950034"/><circle cx="173.943" cy="243.358" r="8.868" fill="#950034"/><circle cx="218.283" cy="243.358" r="8.868" fill="#950034"/><circle cx="40.925" cy="243.358" r="8.868" fill="#950034"/><path d="M224.786 187.343 79.056 41.539l-9.459 9.386 21.284 21.209-12.268 21.135a3.643 3.643 0 0 0 .887 4.73l15.593 12.045c-.296 2.513-.517 4.951-.517 7.39s.221 4.803.517 7.168L79.5 136.869a3.644 3.644 0 0 0-.887 4.73l14.78 25.569c.887 1.626 2.882 2.217 4.508 1.626l18.401-7.464c3.843 2.956 7.833 5.469 12.489 7.316l2.734 19.584c.296 1.773 1.848 3.103 3.695 3.103h29.56c1.847 0 3.399-1.33 3.695-3.103l2.734-19.584c3.769-1.552 7.095-3.547 10.272-5.838l33.92 33.92 9.385-9.385ZM150 143.299c-14.263 0-25.865-11.602-25.865-25.865 0-3.695.887-6.799 2.143-9.829l33.551 33.551c-3.03 1.33-6.134 2.143-9.829 2.143Zm-1.921-51.508-23.5-23.5c1.404-.74 2.734-1.478 4.212-2.07l2.734-19.583a3.737 3.737 0 0 1 3.695-3.103h29.56a3.737 3.737 0 0 1 3.695 3.103l2.734 19.584c4.656 1.847 8.646 4.36 12.489 7.242l18.401-7.39c1.626-.665 3.621 0 4.508 1.626l14.78 25.569c.887 1.626.517 3.62-.887 4.73l-15.593 12.045c.296 2.513.518 4.951.518 7.39s-.222 4.803-.518 7.168l15.593 12.267c1.404 1.109 1.774 3.104.887 4.73l-8.572 14.928-37.172-37.172c.222-.591.222-1.256.222-1.921 0-14.263-11.602-25.865-25.865-25.865-.665 0-1.256 0-1.921.222Z" fill="currentColor"/></svg>`,
    title: {
      en: "Equipment broken",
      fi: "Laiteongelma",
    },
  },
  {
    icon: `<svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="m243.752 257-45.857-45.857c-21.4 17.324-49.933 28.533-79.485 28.533-14.267 0-26.496-8.152-32.61-20.381l-23.438 15.286v-61.143L85.8 188.724c5.095-12.229 18.343-20.381 32.61-20.381 10.19 0 20.38-3.057 28.533-8.153L43 56.248 56.248 43 257 243.752 243.752 257Zm2.038-144.705c0-14.266-8.152-26.495-20.38-32.61l15.285-23.437h-61.143l15.286 23.438c-12.228 5.095-20.381 18.343-20.381 32.609 0 7.134-1.019 13.248-4.076 19.362l51.971 52.991c15.286-20.381 23.438-45.858 23.438-72.353Z" fill="currentColor"/></svg>`,
    title: {
      en: "Product defect",
      fi: "Virhe tuotteessa",
    },
  },
];

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
};

export type AppState = {
  state: State;
  lastMessageAt?: number; // timestamp
};

const messageThrottle = 1000;
const maxIndex = 3; // 4 cards
const socketUrl = "wss://echo.websocket.org"; // TODO: 'ws://localhost:8080'

const initialAppState: AppState = {
  lastMessageAt: undefined,
  state: {
    name: "swiping",
    index: 0,
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
      // simulateApi();
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
