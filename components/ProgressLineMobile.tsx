'use client';

import { motion } from 'motion/react';

interface ProgressLineMobileProps {
  step: number;
  steps: Array<{ title: string; description: string; icon: any }>;
  stepEmojiMap: Record<number, string>;
  handleBack: () => void;
  isMobile: boolean;
}

export default function ProgressLineMobile({ 
  step, 
  steps, 
  stepEmojiMap, 
  handleBack, 
  isMobile 
}: ProgressLineMobileProps) {
  if (!isMobile) return null;

  return (
    <div className="flex relative overflow-hidden h-20 w-full items-center justify-center">
      {/* Horizontal Progress Line */}
      <motion.div
        className="absolute bg-white"
        style={{
          top: '50%',
          transform: 'translateY(-50%)',
          height: '2px'
        }}
        animate={{
          left: step === 0 ? '50%' : '0%',
          width: step === 0 ? '50%' : step === 5 ? '50%' : step === 4 ? '80%' : '100%'
        }}
        transition={{
          duration: 0.6,
          ease: "easeInOut",
        }}
      />
      
      {/* Progress Circles */}
      <div className="absolute w-full h-full">
        {steps.map((_, index) => {
          // Calculate relative position from current step
          const relativePosition = index - step;
          
          let positionPercentage = 50; // Default center
          let circleSize = 50;
          let isVisible = false;
          
          // Show 3 circles: previous, current, and next
          if (relativePosition === -1) {
            // Previous step
            positionPercentage = 20;
            circleSize = 50;
            isVisible = true;
          } else if (relativePosition === 0) {
            // Current step - center of screen, larger size
            positionPercentage = 50;
            circleSize = 70;
            isVisible = true;
          } else if (relativePosition === 1) {
            // Next step
            positionPercentage = 80;
            circleSize = 50;
            isVisible = true;
          } else if (relativePosition < -1) {
            // Steps that are further back - move progressively off screen
            const offsetSteps = Math.abs(relativePosition) - 1;
            positionPercentage = 20 - (offsetSteps * 30);
            circleSize = 50;
            isVisible = positionPercentage >= -10;
          } else if (relativePosition > 1) {
            // Steps that are further ahead - move progressively off screen
            const offsetSteps = relativePosition - 1;
            positionPercentage = 80 + (offsetSteps * 30);
            circleSize = 50;
            isVisible = positionPercentage <= 110;
          }
          
          return (
            <motion.div
              key={index}
              className={`absolute rounded-full bg-[#F65772] border-2 border-white flex items-center justify-center -translate-x-1/2 -translate-y-1/2 ${
                relativePosition === -1 ? 'cursor-pointer hover:bg-[#E02040] transition-colors duration-200' : ''
              }`}
              onClick={relativePosition === -1 ? handleBack : undefined}
              initial={{
                left: `${positionPercentage}%`,
                top: '50%',
                width: `${circleSize}px`,
                height: `${circleSize}px`,
                opacity: isVisible ? 1 : 0,
                scale: 0,
              }}
              animate={{
                left: `${positionPercentage}%`,
                width: `${circleSize}px`,
                height: `${circleSize}px`,
                opacity: isVisible ? 1 : 0,
                scale: isVisible ? 1 : 0,
              }}
              transition={{ 
                duration: 0.4,
                opacity: { duration: 0.3 },
                scale: { 
                  type: "spring", 
                  visualDuration: 0.4, 
                  bounce: 0.3,
                },
                left: { 
                  duration: 0.6,
                  ease: "easeInOut"
                },
                width: { 
                  duration: 0.6,
                  ease: "easeInOut"
                },
                height: { 
                  duration: 0.6,
                  ease: "easeInOut"
                }
              }}
            >
              <motion.span
                animate={{
                  fontSize: `${circleSize * 0.4}px`
                }}
                transition={{
                  duration: 0.6,
                  ease: "easeInOut"
                }}
                style={{
                  lineHeight: 1
                }}
              >
                {stepEmojiMap[index as keyof typeof stepEmojiMap]}
              </motion.span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
