'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface OnboardingProgressLineProps {
  currentStep: number;
}

const stepEmojiMap = {
  0: '👋',
  1: '🧑‍🎓',
  2: '📸',
  3: '🍔',
  4: '⚽️',
  5: '🎉', 
};

const OnboardingProgressLine = ({ currentStep }: OnboardingProgressLineProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [containerHeight, setContainerHeight] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setContainerHeight(window.innerHeight);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const updateCanvas = () => {
      const actualHeight = window.innerHeight;
      setContainerHeight(actualHeight);
      
      canvas.width = 96; 
      canvas.height = actualHeight;

      // Clear canvas
      context.clearRect(0, 0, canvas.width, canvas.height);

      // vertical line
      context.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      context.lineWidth = 3;

      context.beginPath();
      context.moveTo(48, 0); // Center of the 96px width
      context.lineTo(48, canvas.height); // Full height
      context.stroke();
    };

    // Initialize canvas immediately
    updateCanvas();

    // Handle window resize
    const handleResize = () => updateCanvas();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate emoji positions with absolute positioning
  const getEmojiPosition = (type: 'previous' | 'current' | 'next') => {

    const height = containerHeight || window.innerHeight;
    
    switch (type) {
      case 'previous':
        return 100; // 100px from top
      case 'current':
        return height / 2; // Centered
      case 'next':
        return height - 100; // 100px from bottom
      default:
        return 100;
    }
  };

  // Get emojis to display (previous, current, next)
  const getVisibleEmojis = () => {
    const emojis = [];
    
    // Previous step
    if (currentStep > 0) {
      emojis.push({
        emoji: stepEmojiMap[currentStep - 1 as keyof typeof stepEmojiMap],
        step: currentStep - 1,
        type: 'previous' as const,
      });
    }

    // Current step
    emojis.push({
      emoji: stepEmojiMap[currentStep as keyof typeof stepEmojiMap],
      step: currentStep,
      type: 'current' as const,
    });

    // Next step
    if (currentStep < Object.keys(stepEmojiMap).length - 1) {
      emojis.push({
        emoji: stepEmojiMap[currentStep + 1 as keyof typeof stepEmojiMap],
        step: currentStep + 1,
        type: 'next' as const,
      });
    }

    return emojis;
  };

  const visibleEmojis = isMounted && containerHeight > 0 ? getVisibleEmojis() : []; 

  return (
    <div className="relative h-full w-24 flex items-center justify-center flex-shrink-0">
      {/* Canvas for vertical line */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
      />

      {/* Emoji overlays */}
      <AnimatePresence>
        {visibleEmojis.map(({ emoji, step, type }) => {
        const top = getEmojiPosition(type);
        const isCurrent = type === 'current';
        const size = isCurrent ? 150 : 100;
        const borderColor = isCurrent ? 'white' : 'none';
        
        // Get background color based on type
        let backgroundColor;
        switch (type) {
          case 'current':
            backgroundColor = '#F65772';
            break;
          case 'previous':
            backgroundColor = '#FF5874';
            break;
          case 'next':
            backgroundColor = '#FF6F87';
            break;
          default:
            backgroundColor = '#F65772';
        }

        let boxShadow;
        switch (type) {
          case 'current':
            boxShadow = '0 0 20px 10px #FF8096';
            break;
          case 'previous':
            boxShadow = '0 0 12px 6px #FF6F87' ;
            break;
          case 'next':
            boxShadow = '0 0 12px 6px #FF8096';
        }
        
        return (
          <motion.div
            key={`emoji-${step}`}
            className="absolute flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ 
              opacity: 0,
              transition: {
                duration: 0.3,
                ease: "easeInOut"
              }
            }}
            transition={{
              duration: 0.3,
              ease: "easeInOut"
            }}
            style={{
              top: `${top}px`,
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: `${size}px`,
              height: `${size}px`,
              zIndex: 10,
            }}
          >
            {/* Circular background */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                backgroundColor,
                boxShadow,
                border: `3px solid ${borderColor}`,
              }}
            />
            
            {/* Emoji */}
            <span
              className="relative"
              style={{
                fontSize: `${size * 0.5}px`,
                lineHeight: 1,
                zIndex: 20,
              }}
            >
              {emoji}
            </span>
          </motion.div>
        );
        })}
      </AnimatePresence>
    </div>
  );
};

export default OnboardingProgressLine;
