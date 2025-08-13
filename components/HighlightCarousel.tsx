'use client';
import { useRef } from 'react';
import {
  HighlightCard,
  type HighlightCardProps,
} from '@/components/HighlightCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface HighlightCarouselProps {
  cards: HighlightCardProps[];
}

export function HighlightCarousel({ cards }: HighlightCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const scrollByAmount = (amount: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: amount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-row justify-between items-center">
        <h2 className="text-lg font-semibold text-muted-foreground">
          The latest at MA
        </h2>
        <div className="flex gap-2">
          <button
            aria-label="Scroll left"
            onClick={() => scrollByAmount(isMobile ? -400 : -600)}
            className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            aria-label="Scroll right"
            onClick={() => scrollByAmount(isMobile ? 400 : 600)}
            className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="relative -ml-6 lg:-ml-12 w-[calc(100%+3rem)] lg:w-[calc(100%+6rem)] overflow-hidden">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 pl-6 lg:pl-12"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {cards.map((card, index) => (
            <div key={`first-${index}`} className="flex-shrink-0">
              <HighlightCard {...card} />
            </div>
          ))}
        </div>
        <div className="md:block hidden absolute top-0 left-0 h-full w-12 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
        <div className="md:block hidden absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
      </div>
    </div>
  );
}
