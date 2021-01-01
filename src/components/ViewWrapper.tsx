import { motion } from "framer-motion";
import * as React from "react";

type ViewWrapperProps = {};

export const ViewWrapper: React.FC<ViewWrapperProps> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
    >
      {children}
    </motion.div>
  );
};
