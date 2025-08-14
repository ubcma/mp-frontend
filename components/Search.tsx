// 'use client';

// import * as React from 'react';
// import { SearchIcon, X } from 'lucide-react';

// import {
//   CommandDialog,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
// } from '@/components/ui/command';
// import { Button } from '@/components/ui/button';
// import { getEventStatus } from '@/lib/utils';
// import { useEventContext } from '@/context/EventContext';

// export function Search() {
//   const [open, setOpen] = React.useState(false);
//   const { filteredEvents, setSearchTerm, searchTerm } = useEventContext();

//   React.useEffect(() => {
//     const down = (e: KeyboardEvent) => {
//       if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
//         e.preventDefault();
//         setOpen((open) => !open);
//       }
//     };
//     document.addEventListener('keydown', down);
//     return () => document.removeEventListener('keydown', down);
//   }, []);

//   const handleClearSearch = (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setSearchTerm('');
//   };

//   return (
//     <div className="relative md:w-fit w-full">
//       <Button
//         variant="outline"
//         role="combobox"
//         aria-expanded={open}
//         aria-label="Search events"
//         className="relative w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-64 lg:w-96"
//         onClick={() => setOpen(true)}
//       >
//         <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
//         <span className="inline-flex">{searchTerm || 'Search events...'}</span>
//         {searchTerm && (
//           <div
//             onClick={handleClearSearch}
//             role="button"
//             tabIndex={0}
//             aria-label="Clear search"
//             className="absolute right-12 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-sm z-50 cursor-pointer"
//             onKeyDown={(e) => {
//               if (e.key === 'Enter' || e.key === ' ') {
//                 e.preventDefault();
//                 handleClearSearch(e as any);
//               }
//             }}
//           >
//             <X className="h-4 w-4" />
//             <span className="sr-only">Clear search</span>
//           </div>
//         )}
//         <kbd className="pointer-events-none absolute right-[0.2rem] top-[0.2rem] hidden h-7 select-none items-center gap-1 rounded border bg-muted px-2 font-mono text-[10px] font-medium opacity-100 md:flex">
//           <span className="text-xs">⌘</span>K
//         </kbd>
//       </Button>
//       <CommandDialog open={open} onOpenChange={setOpen}>
//         <CommandInput
//           placeholder="Search all events..."
//           value={searchTerm}
//           onValueChange={setSearchTerm}
//         />
//         <CommandList>
//           <CommandEmpty>No events found.</CommandEmpty>
//           {filteredEvents?.length > 0 && (
//             <CommandGroup heading="Events">
//               {filteredEvents?.map((event) => (
//                 <CommandItem
//                   key={event.id}
//                   value={event.title}
//                   onSelect={() => {
//                     setSearchTerm(event.title);
//                     setOpen(false);
//                   }}
//                 >
//                   <div className="flex flex-col">
//                     <span>{event.title}</span>
//                     <span className="text-xs text-muted-foreground">
//                       {new Date(event.startsAt).toLocaleDateString('en-US', {
//                         month: 'short',
//                         day: 'numeric',
//                         year: 'numeric',
//                       })}{' '}
//                       • {getEventStatus(event.startsAt)}
//                     </span>
//                   </div>
//                 </CommandItem>
//               ))}
//             </CommandGroup>
//           )}
//         </CommandList>
//       </CommandDialog>
//     </div>
//   );
// }

'use client';

import * as React from 'react';
import { SearchIcon, X } from 'lucide-react';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { getEventStatus } from '@/lib/utils';
import { useEventContext } from '@/context/EventContext';

export function Search() {
  const [open, setOpen] = React.useState(false);
  const { filteredEvents, setSearchTerm, searchTerm } = useEventContext();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <div className="relative w-full md:w-fit">
      <button
        role="combobox"
        aria-expanded={open}
        aria-label="Search events"
        className="flex flex-row items-center px-2 border hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-12 md:h-10 w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none md:w-96"
        onClick={() => setOpen(true)}
      >
        <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
        <span className="inline-flex">{searchTerm || 'Search events...'}</span>
        <span className='ml-auto flex flex-row items-center gap-1'>
          {searchTerm && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                setSearchTerm('');
              }}
              className="h-full px-2 py-3"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </span>
          )}
          <kbd className="pointer-events-none hidden h-7 select-none items-center gap-1 rounded border bg-muted px-2 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </span>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search all events..."
          value={searchTerm}
          onValueChange={setSearchTerm}
        />
        <CommandList>
          <CommandEmpty>No events found.</CommandEmpty>
          {filteredEvents?.length > 0 && (
            <CommandGroup heading="Events">
              {filteredEvents?.map((event) => (
                <CommandItem
                  key={event.id}
                  value={event.title}
                  onSelect={() => {
                    setSearchTerm(event.title);
                    setOpen(false);
                  }}
                >
                  <div className="flex flex-col">
                    <span>{event.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(event.startsAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}{' '}
                      • {getEventStatus(event.startsAt)}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </div>
  );
}
