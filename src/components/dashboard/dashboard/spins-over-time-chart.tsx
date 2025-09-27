"use client"

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"

interface SpinsOverTimeChartProps {
  data: Array<{
    day: string
    spins: number
  }>
}

export function SpinsOverTimeChart({ data }: SpinsOverTimeChartProps) {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#6b7280" }}
            domain={[0, 60]}
            ticks={[0, 10, 20, 30, 40, 50, 60]}
          />
          <Bar dataKey="spins" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={60} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
