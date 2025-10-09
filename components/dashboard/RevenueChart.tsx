'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useState, useEffect, useMemo } from 'react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '../ui/button';
import { Filter } from 'lucide-react';
import {
  Transaction,
  useAllTransactionsQuery,
} from '@/lib/queries/transactions';
import { EventDetails } from '@/lib/types';

export type DemographicKey =
  | 'Major'
  | 'Year'
  | 'Faculty'
  | 'Gender'
  | 'Interests';

function processRevenueOverTime(
  transactions: Transaction[],
  range: '6mo' | '3mo' | '1mo' | '1wk'
) {
  const now = new Date();
  const filtered = transactions.filter((tx) => {
    const txDate = new Date(tx.paidAt);
    const daysDiff = Math.floor(
      (now.getTime() - txDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (range === '1wk') return daysDiff <= 7;
    if (range === '1mo') return daysDiff <= 30;
    if (range === '3mo') return daysDiff <= 90;
    if (range === '6mo') return daysDiff <= 180;
    return false;
  });

  const revenueMap = new Map<string, number>();

  filtered.forEach((tx) => {
    const date = new Date(tx.paidAt);
    let key: string;

    if (range === '1wk') {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      key = days[date.getDay()];
    } else if (range === '1mo') {
      const day = date.getDate();
      const month = date.toLocaleString('default', { month: 'short' });
      key = `${month} ${day}`;
    } else if (range === '3mo') {
      const dayOfMonth = date.getDate();
      const month = date.toLocaleString('default', { month: 'short' });

      let period;
      if (dayOfMonth <= 7) period = '07';
      else if (dayOfMonth <= 14) period = '14';
      else if (dayOfMonth <= 21) period = '21';
      else period = '30';

      key = `${month} ${period}`;
    } else {
      key = date.toLocaleString('default', { month: 'short' });
    }

    revenueMap.set(key, (revenueMap.get(key) || 0) + Number(tx.amount) / 100);
  });

  const entries = Array.from(revenueMap.entries());

  if (range === '1mo') {
    entries.sort((a, b) => {
      const dayA = parseInt(a[0].split(' ')[1]);
      const dayB = parseInt(b[0].split(' ')[1]);
      return dayA - dayB;
    });
  }

  return entries.map(([label, revenue]) => ({
    label,
    revenue,
  }));
}

function processRevenueByEvent(
  transactions: Transaction[],
  events?: EventDetails[]
) {
  const revenueMap = new Map<string, number>();

  const eventIdToName = new Map<string, string>();
  if (events) {
    events.forEach((event) => {
      eventIdToName.set(String(event.id), event.title);
    });
  }

  transactions.forEach((tx) => {
    if (tx.eventId) {
      const eventId = String(tx.eventId);
      const eventKey = eventIdToName.get(eventId) || eventId;
      revenueMap.set(
        eventKey,
        (revenueMap.get(eventKey) || 0) + Number(tx.amount) / 100
      );
    }
  });

  return Array.from(revenueMap.entries()).map(([event, revenue]) => ({
    event,
    revenue,
  }));
}

export function RevenueChart() {
  const {
    data: transactions = [],
    isLoading,
    error,
  } = useAllTransactionsQuery();

  const [timeRange, setTimeRange] = useState<'6mo' | '3mo' | '1mo' | '1wk'>(
    '6mo'
  );
  const [demoType, setDemoType] = useState<DemographicKey>('Major');

  const events: EventDetails[] = [
    {
      id: '21',
      title: 'Test',
      slug: 'test',
      startsAt: new Date('2025-10-09T07:00:00.000Z'),
      endsAt: new Date('2025-10-10T07:00:00.000Z'),
      location: 'Vancouver, BC, CAN',
      price: 27,
      description: 'Description',
      imageUrl:
        'https://utfs.io/f/icFgxUjDNp9SuBJU7yvTFJPjsNlvdgVeB8Hyx01LD23IRiGo',
      isVisible: false,
      membersOnly: false,
      createdAt: '2025-10-09T07:00:00.000Z',
      updatedAt: '2025-10-10T07:00:00.000Z',
    },
    {
      id: '28',
      title: 'Launch Party',
      slug: 'launch-party',
      startsAt: new Date('2025-10-09T07:00:00.000Z'),
      endsAt: new Date('2025-10-10T07:00:00.000Z'),
      location: 'Great Hall North, AMS Student Nest',
      price: 0,
      description: 'This is a test free event for everyone',
      imageUrl:
        'https://utfs.io/f/icFgxUjDNp9SZz6k2Ouq9Sbrijsp83wdyznfRJ5C1XIxUeHF',
      isVisible: true,
      membersOnly: false,
      createdAt: '2025-10-09T07:00:00.000Z',
      updatedAt: '2025-10-10T07:00:00.000Z',
    },
    {
      id: '39',
      title: 'test email',
      slug: 'test-email',
      startsAt: new Date('2025-10-09T07:00:00.000Z'),
      endsAt: new Date('2025-10-10T07:00:00.000Z'),
      location: 'party bus',
      price: 0,
      description: 'test email ',
      imageUrl:
        'https://utfs.io/f/icFgxUjDNp9SYgYNME8WgoQTZvmMRLxUD3d2ja49SHG8IXPn',
      isVisible: true,
      membersOnly: false,
      createdAt: '2025-10-09T07:00:00.000Z',
      updatedAt: '2025-10-10T07:00:00.000Z',
    },
  ];

  const revenueByEvent = useMemo(
    () => processRevenueByEvent(transactions, events),
    [transactions]
  );
  const availableEvents = useMemo(
    () => revenueByEvent.map((e) => e.event),
    [revenueByEvent]
  );
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

  useEffect(() => {
    if (availableEvents.length > 0 && selectedEvents.length === 0) {
      setSelectedEvents(availableEvents);
    }
  }, [availableEvents, selectedEvents.length]);

  const filteredEventData = useMemo(
    () =>
      revenueByEvent.filter((entry) => selectedEvents.includes(entry.event)),
    [revenueByEvent, selectedEvents]
  );

  const revenueOverTime = useMemo(
    () => processRevenueOverTime(transactions, timeRange),
    [transactions, timeRange]
  );

  function toggleEvent(eventName: string) {
    setSelectedEvents((prev) =>
      prev.includes(eventName)
        ? prev.filter((e) => e !== eventName)
        : [...prev, eventName]
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Revenue Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center">
            <p className="text-destructive">
              Error loading transaction data. Please try again.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Revenue Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center">
            <p className="text-muted-foreground">Loading transaction data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <Tabs defaultValue="time" className="w-full">
        <CardHeader>
          <div className="flex flex-row justify-between sm:items-center gap-4">
            <CardTitle className="text-xl">Revenue Analytics</CardTitle>
            <TabsList>
              <TabsTrigger value="time">Over Time</TabsTrigger>
              <TabsTrigger value="event">By Event</TabsTrigger>
            </TabsList>
          </div>
        </CardHeader>

        <CardContent>
          <TabsContent value="time">
            <div className="flex justify-end mb-4">
              <Tabs
                value={timeRange}
                onValueChange={(val) => setTimeRange(val as any)}
              >
                <TabsList>
                  <TabsTrigger value="6mo">6 Months</TabsTrigger>
                  <TabsTrigger value="3mo">3 Months</TabsTrigger>
                  <TabsTrigger value="1mo">This Month</TabsTrigger>
                  <TabsTrigger value="1wk">Past Week</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="h-[400px]">
              {revenueOverTime.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueOverTime}>
                    <defs>
                      <linearGradient
                        id="colorRevenue"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#FF324D"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#FF6F82"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis
                      tickFormatter={(value) => {
                        return `$${value}`;
                      }}
                    />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#FF324D"
                      fill="url(#colorRevenue)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-muted-foreground">
                    No revenue data for this time period
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="event">
            <div className="flex justify-end mb-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter Events
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                  {availableEvents.map((event) => (
                    <DropdownMenuCheckboxItem
                      key={event}
                      checked={selectedEvents.includes(event)}
                      onCheckedChange={() => toggleEvent(event)}
                      onSelect={(e) => e.preventDefault()}
                    >
                      {event}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="h-[400px]">
              {filteredEventData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredEventData}>
                    <defs>
                      <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FF324D" stopOpacity={1} />
                        <stop
                          offset="100%"
                          stopColor="#FF6F82"
                          stopOpacity={1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="event" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="url(#colorBar)" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-muted-foreground">
                    No events selected or no revenue data
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}
