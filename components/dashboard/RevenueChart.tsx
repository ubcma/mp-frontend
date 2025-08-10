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
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '../ui/button';
import { Filter } from 'lucide-react';

// Mock data
const revenueByEvent = [
  { event: 'Welcome Night', revenue: 1240 },
  { event: 'Gateways', revenue: 980 },
  { event: 'Connect 4', revenue: 1580 },
  { event: 'Rendevous', revenue: 1340 },
];

const revenueOverTime = {
  '6mo': [
    { label: 'Jan', revenue: 1000 },
    { label: 'Feb', revenue: 1600 },
    { label: 'Mar', revenue: 1200 },
    { label: 'Apr', revenue: 1800 },
    { label: 'May', revenue: 1900 },
    { label: 'Jun', revenue: 1750 },
  ],
  '3mo': [
    { label: 'Apr 15', revenue: 1500 },
    { label: 'Apr 30', revenue: 1730 },
    { label: 'May 15', revenue: 1500 },
    { label: 'May 30', revenue: 1600 },
    { label: 'Jun 15', revenue: 1800 },
    { label: 'Jun 30', revenue: 1600 },
  ],
  '1wk': [
    { label: 'Mon', revenue: 250 },
    { label: 'Tue', revenue: 340 },
    { label: 'Wed', revenue: 280 },
    { label: 'Thu', revenue: 420 },
    { label: 'Fri', revenue: 390 },
    { label: 'Sat', revenue: 480 },
    { label: 'Sun', revenue: 520 },
  ],
};

const revenueByDemographic: Record<
  DemographicKey,
  { category: string; revenue: number }[]
> = {
  Major: [
    { category: 'Computer Science', revenue: 3100 },
    { category: 'Marketing', revenue: 2600 },
    { category: 'Finance', revenue: 3000 },
  ],
  Year: [
    { category: '1st Year', revenue: 2200 },
    { category: '2nd Year', revenue: 2700 },
    { category: '3rd Year', revenue: 2650 },
    { category: '4th Year', revenue: 2950 },
  ],
  Faculty: [
    { category: 'Commerce', revenue: 3500 },
    { category: 'Science', revenue: 3100 },
    { category: 'Arts', revenue: 2500 },
    { category: 'Engineering', revenue: 2800 },
  ],
  Gender: [
    { category: 'He/Him', revenue: 2500 },
    { category: 'She/Her', revenue: 2600 },
    { category: 'They/Them', revenue: 700 },
  ],
  Interests: [
    { category: 'Technology', revenue: 3500 },
    { category: 'Entrepreneurship', revenue: 2900 },
    { category: 'Design', revenue: 2100 },
    { category: 'Finance', revenue: 2800 },
  ],
};

export type DemographicKey = 'Major' | 'Year' | 'Faculty' | 'Gender' | 'Interests';

export function RevenueChart() {
  const availableEvents = revenueByEvent.map((e) => e.event);
  const [selectedEvents, setSelectedEvents] =
    useState<string[]>(availableEvents);

  const [timeRange, setTimeRange] = useState<'6mo' | '3mo' | '1wk'>('6mo');
  const [demoType, setDemoType] = useState<DemographicKey>('Major');
  const filteredData = revenueByEvent.filter((entry) =>
    selectedEvents.includes(entry.event)
  );

  function toggleEvent(eventName: string) {
    setSelectedEvents((prev) =>
      prev.includes(eventName)
        ? prev.filter((e) => e !== eventName)
        : [...prev, eventName]
    );
  }

  return (
    <Card>
      <Tabs defaultValue="time" className="w-full">
        <CardHeader>
          <div className="flex flex-row justify-between sm:items-center gap-4">
            <CardTitle className='text-xl'>Revenue Analytics</CardTitle>
            <TabsList>
              <TabsTrigger value="time">Over Time</TabsTrigger>
              <TabsTrigger value="event">By Event</TabsTrigger>
              <TabsTrigger value="demographic">By Demographic</TabsTrigger>
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
                  <TabsTrigger value="1wk">Past Week</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueOverTime[timeRange]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8884d8"
                    fill="#8884d8"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="event">
            <div className="flex justify-end mb-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter/>
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
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="event" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="demographic">
            <div className="flex justify-end mb-4">
              <Select
                value={demoType}
                onValueChange={(val) => setDemoType(val as any)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Year">Year Level</SelectItem>
                  <SelectItem value="Major">Major</SelectItem>
                  <SelectItem value="Faculty">Faculty</SelectItem>
                  <SelectItem value="Pronouns">Pronouns</SelectItem>
                  <SelectItem value="Interests">Interests</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueByDemographic[demoType]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}
