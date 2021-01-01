import { motion } from "framer-motion";
import * as React from "react";

type ViewWrapperProps = {};

export const ViewWrapper: React.FC<ViewWrapperProps> = ({ children }) => {
  return (
    <motion.div
      initial="out"
      animate="in"
      exit="out"
      variants={{
        out: { opacity: 0, y: 10, transition: { duration: 0.2 } },
        in: { opacity: 1, y: 0, transition: { duration: 0.4 } },
      }}
    >
      {children}
    </motion.div>
  );
};
