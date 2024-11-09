import { motion } from "framer-motion";
import { useEffect } from "react";
import styled from "styled-components";
import { confirmed } from "./assets/icons";
import Icon from "./components/Icon";
import { activeColor, backgroundColor } from "./constants";
import { useAppState } from "./state";

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
