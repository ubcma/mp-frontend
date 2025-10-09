"use client"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useRevenueQuery } from "@/lib/queries/transactions"
import { cn } from "@/lib/utils"
import { TrendingDown, TrendingUp } from "lucide-react"

export function SectionCards() {

  const { data: revenue, isLoading: isRevenueLoading, isError: isRevenueError} = useRevenueQuery();

  const details = [
  {
    title: "Total Revenue",
    value: (revenue?.totalRevenue ? `$${(revenue?.totalRevenue / 100).toFixed(2)}` : "N/A"),
    change: 12.5,
    changeIcon: <TrendingUp />,
    description: "[REAL DATA] Trending up this month",
  },
  {
    title: "New Members",
    value: 10,
    change: -20,
    changeIcon: <TrendingDown />,
    description: "[SAMPLE DATA] Down 20% from last month",
  },
  {
    title: "Active Accounts",
    value: 20,
    change: 12.5,
    changeIcon: <TrendingUp />,
    description: "[SAMPLE DATA] Strong user retention",
  }
]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

      {details.map((detail, index) => (
        <Card key={index} className="@container/card gap-2">
          <CardHeader>
            <CardDescription>{detail.title}</CardDescription>
            <CardTitle className="text-3xl font-semibold">
              {detail.value}
            </CardTitle>
            <CardAction>
              <Badge className={cn(detail.change < 0 ? 'bg-rose-300 text-rose-900' : 'bg-emerald-300 text-emerald-900')}variant="outline">
                {detail.changeIcon} {detail.change > 0 && "+"}{detail.change}%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {detail.description} {detail.changeIcon}
            </div>
            <div className="text-muted-foreground">
              Visitors for the last 6 months
            </div>
          </CardContent>
        </Card>
      ))}


    </div>
  )
}