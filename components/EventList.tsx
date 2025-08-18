'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { EventDetails } from '@/lib/types';
import { EventCard } from './EventCard';
import { useEventContext } from '@/context/EventContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Registration } from '@/lib/queries/registrations';

export function EventList() {
  const { filteredEvents, registeredEvents, isLoading } = useEventContext();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: {
        duration: 0.2,
      },
    },
  };

  const noResultsVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 300,
        damping: 30,
        delay: 0.2,
      },
    },
  };

  if (isLoading) {
    return (
      <motion.div
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {[...Array(3)].map((_, i) => (
          <motion.div key={i} variants={itemVariants}>
            <Skeleton className="h-[400px] w-full rounded-xl" />
          </motion.div>
        ))}
      </motion.div>
    );
  }

  if (filteredEvents?.length === 0) {
    return (
      <motion.div
        className="flex flex-col justify-center items-center w-full h-[50vh] text-center"
        variants={noResultsVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.img
          src="/no_results_found.svg"
          alt="No events found"
          className="w-24 h-24 mb-4"
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 20,
            delay: 0.3,
          }}
        />
        <motion.h3
          className="text-lg font-semibold"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          No events found.
        </motion.h3>
        <motion.p
          className="text-muted-foreground text-sm max-w-96"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {
            "We couldn't find anything matching your search criteria. Try adjusting your filters or search terms"
          }
        </motion.p>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="event-list"
      className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <AnimatePresence>
        {filteredEvents?.map((event: EventDetails) => {
          const isEventRegistered = registeredEvents?.some(
              (registeredEvent) => registeredEvent.eventId === event.id
            );


          return (
            <motion.div
              key={event.id}
              variants={itemVariants}
              layout
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <EventCard event={event} registered={isEventRegistered} />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}
