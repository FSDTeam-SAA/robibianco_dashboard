"use client"

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

interface ReviewDistributionChartProps {
  positiveReviews: number
  negativeReviews: number
}

export function ReviewDistributionChart({ positiveReviews, negativeReviews }: ReviewDistributionChartProps) {
  const total = positiveReviews + negativeReviews
  const positivePercentage = Math.round((positiveReviews / total) * 100)
  const negativePercentage = Math.round((negativeReviews / total) * 100)

  const data = [
    { name: "Positive", value: positivePercentage, color: "#48a256" },
    { name: "Negative", value: negativePercentage, color: "#f97316" },
  ]

  return (
    <div className="space-y-6">
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={0}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.name} className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-sm font-medium">
              {item.value}% {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
