import { motion } from "framer-motion";
import { useEffect } from "react";
import styled from "styled-components";
import Icon from "./components/Icon";
import { activeColor, backgroundColor } from "./constants";
import { useAppState } from "./state";

const confirmed = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 200 200"><path fill="currentColor" fill-rule="evenodd" d="M131.898 177.009A83.089 83.089 0 0 1 100 183.333a83.087 83.087 0 0 1-58.925-24.408A83.088 83.088 0 0 1 16.667 100a83.085 83.085 0 0 1 24.408-58.925A83.084 83.084 0 0 1 100 16.667a83.084 83.084 0 0 1 58.925 24.408A83.094 83.094 0 0 1 183.333 100a83.089 83.089 0 0 1-24.408 58.925 83.097 83.097 0 0 1-27.027 18.084Zm15.072-96.706a7.5 7.5 0 1 0-10.607-10.606l-44.696 44.696L71.97 94.697a7.5 7.5 0 0 0-10.607 10.606l25 25a7.5 7.5 0 0 0 10.607 0l50-50Z" clip-rule="evenodd"/></svg>`;

export function ConfirmComplete() {
  const { dispatch } = useAppState();

  useEffect(() => {
    setTimeout(() => {
      dispatch("pending-manager");
    }, 2000);
  }, []);

  return (
    <ConfirmedWrapper
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ opacity: 0 }}
    >
      <Icon svg={confirmed} color={backgroundColor} />
    </ConfirmedWrapper>
  );
}

const ConfirmedWrapper = styled(motion.div)`
  position: absolute;
  inset: 0;
  background-color: ${activeColor};
  border-radius: 999px;
`;
