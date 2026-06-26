import { motion } from 'framer-motion';

export const CelebrationRenderer = () => {
  // Simple particle burst using framer-motion
  const particles = Array.from({ length: 40 });

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((_, i) => {
        const angle = (i / particles.length) * 360;
        const radius = 150 + Math.random() * 150;
        const tx = Math.cos((angle * Math.PI) / 180) * radius;
        const ty = Math.sin((angle * Math.PI) / 180) * radius;
        
        return (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2 w-1.5 h-1.5 bg-foreground rounded-full"
            initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
            animate={{ 
              x: tx, 
              y: ty, 
              scale: [0, 1.5, 0],
              opacity: [1, 1, 0] 
            }}
            transition={{ 
              duration: 1 + Math.random(), 
              ease: "easeOut",
              times: [0, 0.4, 1]
            }}
          />
        );
      })}
    </div>
  );
};
