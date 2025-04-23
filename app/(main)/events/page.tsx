'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from '@/components/Search';
import { EventStatus, getEventStatus } from '@/helpers/eventStatus';
import { EventList } from '@/components/EventList';
import { EventProvider, useEventContext } from '@/context/EventContext';
import { useGetEventsQuery } from '@/lib/queries/events';

const tabs: { value: EventStatus | "All"; label: string }[] = [
  { value: "All", label: "All" },
  { value: "Upcoming", label: "Upcoming" },
  { value: "Ongoing", label: "Ongoing" },
  { value: "Past", label: "Past" },
];

export default function Home() {

  return (
    <EventProvider>
      <main className="p-6">
        <EventTabs />
      </main>
    </EventProvider>
  );
}

function EventTabs() {
  const { activeTab, setActiveTab } = useEventContext();

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => setActiveTab(value as EventStatus | "All")}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold">Upcoming Events</h1>
        <p className="text-muted-foreground">
          Check out what exciting events we're bringing to you next!
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <Search />
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <EventList />
    </Tabs>
  );
}

