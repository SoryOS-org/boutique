import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

interface AnimatedButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  triggerAnimation?: boolean;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({ 
  children, 
  triggerAnimation, 
  className, 
  ...props 
}) => {
  return (
    <motion.button
      {...props}
      className={`${className} cursor-pointer`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={triggerAnimation ? { scale: [1, 1.2, 1], rotate: [0, -5, 5, -5, 0] } : {}}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.button>
  );
};
