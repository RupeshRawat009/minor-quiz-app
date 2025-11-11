import React from "react";
import { motion } from "framer-motion";

const MotionWrapper = ({ children, keyVal }) => {
  return (
    <motion.div
      key={keyVal}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

export default MotionWrapper;
