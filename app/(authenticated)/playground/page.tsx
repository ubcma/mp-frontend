'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Page() {
  const [step, setStep] = useState(0);
  const totalSteps = 7;

  // Calculate which circles should be visible - including queue circles
  const getVisibleCircles = () => {
    const circles = [];

    // Show more circles to include queue circles
    // When going forward: show current-1, current, current+1, current+2
    // When going backward: show current-2, current-1, current, current+1
    for (
      let i = Math.max(0, step - 2);
      i <= Math.min(totalSteps - 1, step + 2);
      i++
    ) {
      const position = i - step; // -2 = far top, -1 = top, 0 = middle, 1 = bottom, 2 = far bottom
      circles.push({ index: i, position });
    }

    return circles;
  };

  const getCircleProps = (position: number) => {
    switch (position) {
      case -2: // Far top circle (queue)
        return {
          scale: 0.2,
          y: -400,
          opacity: 1,
        };
      case -1: // Top circle
        return {
          scale: 0.3,
          y: -250,
          opacity: 1,
        };
      case 0: // Middle circle (active)
        return {
          scale: 1,
          y: 0,
          opacity: 1,
        };
      case 1: // Bottom circle
        return {
          scale: 0.3,
          y: 250,
          opacity: 1,
        };
      case 2: // Far bottom circle (queue)
        return {
          scale: 0.2,
          y: 400,
          opacity: 1,
        };
      default:
        return {
          scale: 0.2,
          y: 0,
          opacity: 1,
        };
    }
  };

  const visibleCircles = getVisibleCircles();

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Circle container taking full height */}
      <div className="relative h-screen w-full flex flex-col items-center justify-center">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Single absolute positioned border line */}
          <motion.div
            className="absolute w-0.5 bg-gradient-to-b from-neutral-400 to-neutral-500 left-1/2 transform -translate-x-1/2"
            animate={{
              height:
                step === 0
                  ? '50vh'
                  : step === 1
                    ? '80vh' // 50vh to center + 125px to second circle
                    : step === totalSteps - 2
                      ? 'calc(80%)' // Same for second to last
                      : step === totalSteps - 1
                        ? '50vh'
                        : '100vh',
              top:
                step === 0
                  ? '50vh'
                  : step === 1
                    ? '20vh' // Start 125px above center to reach second circle
                    : step === totalSteps - 2
                      ? '0%' // Start from top
                      : step === totalSteps - 1
                        ? '0%'
                        : '0%',
            }}
            transition={{
              duration: 0.6,
              ease: 'easeInOut',
            }}
          />

          {/* Render circles */}
          <AnimatePresence mode="popLayout">
            {visibleCircles.map(({ index, position }) => {
              const props = getCircleProps(position);

              return (
                <motion.div
                  key={index}
                  className="absolute flex items-center justify-center"
                  initial={{
                    scale: position >= 1 ? 0.2 : props.scale,
                    y: position >= 1 ? 400 : props.y,
                    opacity: position >= 1 ? 0 : 100,
                  }}
                  animate={{
                    scale: props.scale,
                    y: props.y,
                    opacity: props.opacity,
                  }}
                  exit={{
                    scale: position <= -1 ? 0.2 : props.scale,
                    y: position <= -1 ? -400 : props.y,
                    opacity: 0,
                  }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                  layout
                >
                  {/* Circle */}
                  <motion.div
                    className="w-32 h-32 rounded-full bg-white border-2 border-neutral-300 flex items-center justify-center shadow-lg relative z-10"
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                  >
                    {/* Content - show different sizes based on position */}
                    {position === 0 && (
                      <motion.div
                        className="w-28 h-28 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-inner"
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                      >
                        {index + 1}
                      </motion.div>
                    )}
                    {position !== 0 && (
                      <motion.div
                        className="w-16 h-16 bg-blue-400 rounded-full flex items-center justify-center text-white font-bold text-sm"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                      >
                        {index + 1}
                      </motion.div>
                    )}
                  </motion.div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-8 flex space-x-4 bg-white px-6 py-3 rounded-full shadow-lg border">
        <button
          className="px-6 py-2 bg-black text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
          onClick={() => setStep((prev) => Math.max(prev - 1, 0))}
          disabled={step === 0}
        >
          Previous
        </button>
        <span className="px-4 py-2 font-medium text-gray-700">
          Step {step + 1} of {totalSteps}
        </span>
        <button
          className="px-6 py-2 bg-black text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
          onClick={() => setStep((prev) => Math.min(prev + 1, totalSteps - 1))}
          disabled={step === totalSteps - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
}
