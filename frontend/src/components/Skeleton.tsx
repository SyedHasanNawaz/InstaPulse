import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  variant?: 'rect' | 'circle' | 'text';
}

const Skeleton = ({ className = '', variant = 'rect' }: SkeletonProps) => {
  const baseClass = "relative overflow-hidden bg-zinc-200 dark:bg-zinc-800";
  
  const variantClasses = {
    rect: "rounded-2xl",
    circle: "rounded-full",
    text: "rounded-md h-4 w-full"
  };

  return (
    <div className={`${baseClass} ${variantClasses[variant]} ${className}`}>
      {/* Shimmer Effect */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "linear",
        }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent"
      />
      {/* Pulse Effect */}
      <div className="w-full h-full animate-pulse bg-zinc-300/20 dark:bg-zinc-700/20" />
    </div>
  );
};

export default Skeleton;
