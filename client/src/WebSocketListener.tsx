import useWebSocket, { ReadyState } from "react-use-websocket";
import styled from "styled-components";
import { iconColor } from "./constants";
import { useAppState } from "./state";

const messageThrottle = 1000;
const socketUrl = "ws://localhost:8000/ws/sensor"; // "wss://echo.websocket.org"

export function WebSocketListener() {
  const { appState, dispatch } = useAppState();

  const { readyState } = useWebSocket(socketUrl, {
    onMessage: (event) => {
      const data = parseApiPayload(event.data);
      const now = Date.now();

      if (isApiPayload(data)) {
        const action =
          mapApiActionToStateAction[(data.action || "") as ApiAction];

        // console.log("Received action from API", data.action);

        // Only handle same messages every 1 second
        if (
          appState.lastMessageAction === action &&
          appState.lastMessageAt &&
          now - appState.lastMessageAt < messageThrottle
        ) {
          return;
        }

        // No need to handle many confirmation messages
        if (action === "confirm-init" && appState.state.name === "confirming") {
          return;
        }

        // Server doesn't send confirm-abort so we need to handle it here
        if (
          appState.lastMessageAction === "confirm-init" &&
          action !== "confirm-init"
        ) {
          dispatch("confirm-abort");
          return;
        }

        if (action) {
          dispatch(action);
        }
      }
    },
  });

  if (readyState !== ReadyState.OPEN) {
    return <Indicator />;
  }

  return null;
}

const Indicator = styled.div`
  position: absolute;
  bottom: 2rem;
  right: 2rem;
  color: red;
  opacity: 0.5;
  background-color: ${iconColor};
  height: 10px;
  width: 10px;
  border-radius: 50%;
`;

const mapApiActionToStateAction = {
  left_swipe: "swipe-left",
  right_swipe: "swipe-right",
  double_press_active: "confirm-active",
  double_press_confirmed: "confirm-init",
  double_press_abort: "confirm-abort",
} as const;

type ApiAction = keyof typeof mapApiActionToStateAction;

type ApiMessage = { action: ApiAction };

function isApiPayload(message: any): message is ApiMessage {
  return message && typeof message === "object" && "action" in message;
}

function parseApiPayload(message: any) {
  try {
    const data = JSON.parse(message);
    return data.sensor_data;
  } catch (_) {
    return null;
  }
}
