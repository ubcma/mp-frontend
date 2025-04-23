'use client'

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getEventStatus, type EventStatus } from "@/helpers/eventStatus";
import { Event } from "@/types";
import { useRouter } from "next/navigation";

export function EventCard({
  event,
}: {
  event: Event;
}) {
  const status = getEventStatus(event.date);

  const router = useRouter();

  return (
    <Card className="flex flex-col h-full overflow-hidden gap-0 p-0">
      <CardContent className="p-0 flex-1 flex flex-col">
        <div className="relative">
          <div className="absolute left-4 top-4 rounded bg-ma-red px-2 py-1 text-xs font-semibold text-white">
            {new Date(event.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </div>
          <img
            src={event.imageUrl || "/placeholder.svg"}
            alt={event.title}
            className="h-64 w-full object-cover"
          />
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent"></div>
        </div>
        <div className="p-6 pt-2 bg-black text-center flex-1 flex flex-col justify-center">
          <h3 className="text-xl text-white font-semibold">
            {event.title}
          </h3>
          <p className="text-muted-foreground truncate">
            {event.description}
          </p>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0 bg-black">
        {status === "Upcoming" ? (
            <Button onClick={()=> router.push(`/events/${event.title}`)} className="w-full bg-ma-red hover:bg-rose-600">
              Register for this event!
            </Button>
        ) : status === "Ongoing" ? (
          <Button className="w-full bg-green-500 hover:bg-green-600">
            Event in progress!
          </Button>
        ) : (
          <Button className="w-full bg-ma-red/60" disabled>
            Event has passed.
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}