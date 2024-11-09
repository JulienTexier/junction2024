import { motion, useMotionValue } from "framer-motion";
import { Dispatch, SetStateAction, useState } from "react";
import styled from "styled-components";
import { ActionType, useArrowKeyNavigation } from "./hook";

const imgs = [
  "https://images.unsplash.com/photo-1604383393193-ce637a2f9c17?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1730999477808-4b085fd38712?q=80&w=2524&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1731000893765-6f99cb45ff09?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1543086331-70d74e82e608?q=80&w=2456&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];

const SPRING_OPTIONS = {
  type: "spring",
  mass: 3,
  stiffness: 400,
  damping: 50,
};

export function Carousel() {
  const [imgIndex, setImgIndex] = useState(0);
  const dragX = useMotionValue(0);

  const handleAction = (action: ActionType) => {
    if (action === "confirming") {
      window.alert("Confirmed");
    } else {
      setImgIndex(action);
    }
  };

  useArrowKeyNavigation({
    imgIndex,
    maxIndex: imgs.length - 1,
    onAction: handleAction,
  });

  return (
    <Container>
      <ImageSlider
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        style={{ x: dragX }}
        animate={{ translateX: `-${imgIndex * 100}%` }}
        transition={SPRING_OPTIONS}
      >
        <Images imgIndex={imgIndex} />
      </ImageSlider>
      <Dots imgIndex={imgIndex} setImgIndex={setImgIndex} />
    </Container>
  );
}

const Images = ({ imgIndex }: { imgIndex: number }) => {
  return (
    <>
      {imgs.map((imgSrc, idx) => (
        <Image
          key={idx}
          style={{
            backgroundImage: `url(${imgSrc})`,
            transform: `translateX(${(idx - imgIndex) * 100}%)`,
          }}
          animate={{ scale: imgIndex === idx ? 0.95 : 0.85 }}
          transition={SPRING_OPTIONS}
        />
      ))}
    </>
  );
};

const Dots = ({
  imgIndex,
  setImgIndex,
}: {
  imgIndex: number;
  setImgIndex: Dispatch<SetStateAction<number>>;
}) => {
  return (
    <DotContainer>
      {imgs.map((_, idx) => (
        <Dot
          key={idx}
          onClick={() => setImgIndex(idx + 1)} // Adjust to the real index (starting from 1)
          $active={imgIndex === idx}
        />
      ))}
    </DotContainer>
  );
};

const Container = styled.div`
  position: relative;
  overflow: hidden;
  width: 100vw;
`;

const ImageSlider = styled(motion.div)`
  display: flex;
  align-items: center;
  scale: calc(1 - 0.25);
`;

const Image = styled(motion.div)`
  aspect-ratio: 16 / 9;
  width: 100vw;
  flex-shrink: 0;
  border-radius: 1rem;
  background-color: #333;
  background-size: cover;
  background-position: center;
`;

const DotContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const Dot = styled.div<{ $active: boolean }>`
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background-color: ${(props) => (props.$active ? "#111" : "#666")};
  transition: background-color 0.3s;
`;
