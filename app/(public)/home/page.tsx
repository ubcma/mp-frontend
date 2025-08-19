'use client';

import { ActionButtons } from '@/components/ActionButtons';
import { HighlightCarousel } from '@/components/HighlightCarousel';
import OnboardingModal from '@/components/OnboardingModal';
import { Skeleton } from '@/components/ui/skeleton';
import { useUserQuery } from '@/lib/queries/user';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Award, Calendar, Globe, MapPin } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' }, // ✅ now valid
  },
};

const highlightCards = [
  {
    image:
      'https://gs42emtt45.ufs.sh/f/qeDSywamz1NxH4tQ5JT6W5MP98mJjURL4xkwFTZOQiGbpShA',
    heading: 'Gateways tickets now available',
    subheading: "UBCMA's flagship marketing conference",
    url: '/gateways',
    color: '#000000',
    highlightTags: [
      {
        icon: Calendar,
        text: 'Wednesday, November 20 @ 8:00 AM',
        color: '#9FC5FF',
      },
      {
        icon: MapPin,
        text: 'AMS Great Hall',
        color: '#DBCCFF',
      },
    ],
  },
  {
    image:
      'https://gs42emtt45.ufs.sh/f/qeDSywamz1NxnEfYPdoHpX2NmeMbcOv7uC06IdP1w5839oBh',
    heading: 'Job board now open',
    subheading: 'Delivering opportunities to your doorstep',
    url: '/jobs',
    color: '#202E43',
    highlightTags: [
      {
        icon: Award,
        text: 'Members only',
        color: '#FF5370',
      },
    ],
  },
    {
    image:
      'https://gs42emtt45.ufs.sh/f/qeDSywamz1Nx5d0JzlLAyEGpJWNOfhraPBzoqbQT0MFdgi9H',
    heading: 'Meet the exec team',
    subheading: 'We are in full swing for 2025-26!',
    url: '/jobs',
    color: '#731726',
    highlightTags: [
      {
        icon: Globe,
        text: 'External Link',
        color: '#FFFFFF',
      },
    ],
  },
];

export default function Home() {
  const { data: user } = useUserQuery();
  const userFirstName = user?.name.split(' ')[0];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="home-page"
        variants={containerVariants}
        initial="hidden"
        animate="show"
        exit={{ opacity: 0, y: -10 }}
        className="flex flex-col justify-center w-full gap-4"
      >

        {/* Welcome Section */}
        <motion.div variants={itemVariants} className="flex flex-col gap-2">
          <span className="flex flex-row text-3xl font-semibold">
            {userFirstName ? (
              `Welcome back, ${userFirstName}!`
            ) : (
              <Skeleton className="h-8 w-32 rounded-xl" />
            )}
          </span>
          <p className="text-muted-foreground">
            Check out the exciting events and opportunities we’re bringing to you
            next.
          </p>
        </motion.div>

        {/* Divider */}
        <motion.span
          variants={itemVariants}
          className="border-b border-muted-foreground/20 w-full mb-4"
        />

        {/* Highlight Cards Carousel */}
        <motion.div variants={itemVariants}>
          <HighlightCarousel cards={highlightCards} />
        </motion.div>

        {/* Action Buttons */}
        <motion.div variants={itemVariants} className="space-y-4">
          <h2 className="text-lg font-medium text-muted-foreground">
            Explore the portal
          </h2>
          <ActionButtons />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}