"use client"

import * as React from "react"
import { SearchIcon, X } from "lucide-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { getEventStatus } from "@/utils/eventStatus"
import { useEventContext } from "@/context/EventContext"

export function Search() {
  const [open, setOpen] = React.useState(false)
  const { events, setSearchTerm, searchTerm } = useEventContext()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <div className="relative ">
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={open}
        aria-label="Search events"
        className="relative h-10 w-64 justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 sm:w-96"
        onClick={() => setOpen(true)}
      >
        <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
        <span className="inline-flex">{searchTerm || "Search events..."}</span>
        {searchTerm && (
          <Button
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation()
              setSearchTerm("")
            }}
            className="h-full px-2 py-1 absolute right-[2.4rem]"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-7 select-none items-center gap-1 rounded border bg-muted px-2 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search all events..." value={searchTerm} onValueChange={setSearchTerm} />
        <CommandList>
          <CommandEmpty>No events found.</CommandEmpty>
          <CommandGroup heading="Events">
            {events.map((event) => (
              <CommandItem
                key={event.eventID}
                value={event.eventName}
                onSelect={() => {
                  setSearchTerm(event.eventName)
                  setOpen(false)
                }}
              >
                <div className="flex flex-col">
                  <span>{event.eventName}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(event.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}{" "}
                    • {getEventStatus(event.date)}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  )
}

