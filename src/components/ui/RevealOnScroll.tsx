import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import type { ReactNode } from "react";

/* ------------------ Props ------------------ */

type RevealOnScrollProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
};

/* ------------------ Component ------------------ */

const RevealOnScroll = ({
  children,
  delay = 0,
  y = 40,
}: RevealOnScrollProps) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, delay },
      });
    }
  }, [controls, inView, delay]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={controls}
      className="w-full"
    >
      {children}
    </motion.div>
  );
};

export default RevealOnScroll;