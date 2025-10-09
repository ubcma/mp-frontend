'use client';

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useState } from 'react';
import { DemographicKey } from './RevenueChart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data: Record<DemographicKey, { category: string; count: number }[]> = {
  Major: [
    { category: 'Accounting', count: 18 },
    { category: 'Finance', count: 32 },
    { category: 'Marketing', count: 26 },
    { category: 'BUCS', count: 16 },
    { category: 'BTM', count: 20 },
    { category: 'OBHR', count: 10 },
    { category: 'Computer Science', count: 38 },
    { category: 'Economics', count: 30 },
    { category: 'Engineering', count: 32 },
  ],

  Year: [
    { category: 'Year 1', count: 40 },
    { category: 'Year 2', count: 56 },
    { category: 'Year 3', count: 58 },
    { category: 'Year 4', count: 52 },
    { category: 'Year 5+', count: 34 },
  ],

  Faculty: [
    { category: 'Commerce', count: 96 },
    { category: 'Science', count: 58 },
    { category: 'Arts', count: 42 },
    { category: 'Engineering', count: 44 },
  ],

  Gender: [
    { category: 'He/Him', count: 108 },
    { category: 'She/Her', count: 100 },
    { category: 'They/Them', count: 14 },
    { category: 'Other', count: 8 },
    { category: 'Prefer not to say', count: 10 },
  ],

  Interests: [
    { category: 'Brand Management', count: 62 },
    { category: 'Product', count: 66 },
    { category: 'UI / UX', count: 54 },
    { category: 'Entrepreneurship', count: 58 },
  ],
};

const tickFormatter = (value: string, index: number) => {
  if (typeof value !== 'string') return String(value);

  const limit = 10;
  return value.length <= limit ? value : `${value.substring(0, limit)}...`;
};

export default function MemberDemographics() {
  const [demoType, setDemoType] = useState<DemographicKey>('Year');

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Member Demographics</CardTitle>

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
            <SelectItem value="Gender">Gender</SelectItem>
            <SelectItem value="Interests">Interests</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%" className="text-sm">
            <BarChart
              data={data[demoType]}
              layout="vertical"
              {...{
                overflow: 'visible',
              }}
              margin={{ right: 20, left: 20 }}
            >
              <XAxis dataKey="count" type="number" />
              <YAxis
                dataKey="category"
                type="category"
                tickFormatter={tickFormatter}
              />
              <defs>
                <linearGradient id="colorDem" x1="1" y1="0" x2="0" y2="0">
                  <stop offset="5%" stopColor="#FF324D" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#FF6F82" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <Tooltip />
              <Bar dataKey="count" fill="url(#colorDem)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
