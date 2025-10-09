'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from '@/components/Search';
import { EventStatus } from '@/lib/utils';
import { EventList } from '@/components/EventList';
import { EventProvider, useEventContext } from '@/context/EventContext';

const tabs: { value: EventStatus | "All"; label: string }[] = [
  { value: "All", label: "All" },
  { value: "Upcoming", label: "Upcoming" },
  { value: "Ongoing", label: "Ongoing" },
  { value: "Past", label: "Past" },
];

const registrationTabs: { value: "All" | "Registered"; label: string }[] = [
  { value: "All", label: "All Events" },
  { value: "Registered", label: "Registered Events" },
];

export default function Home() {

  return (
    <EventProvider>
        <EventTabs />
    </EventProvider>
  );
}

function EventTabs() {
  const {
    activeTab,
    setActiveTab,
    registrationFilter,
    setRegistrationFilter,
  } = useEventContext();

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-2xl font-bold">Upcoming Events</h1>
        <p className="text-muted-foreground">
          {"Check out what exciting events we're bringing to you next!"}
        </p>
      </div>

      {/* First Tab Group: Date Range */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <Search />
        <Tabs
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(value as EventStatus | 'All')
          }
        >
          <TabsList>
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <Tabs
          value={registrationFilter}
          onValueChange={(value) =>
            setRegistrationFilter(value as 'All' | 'Registered')
          }
        >
          <TabsList>
            {registrationTabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <EventList />
    </div>
  );
}