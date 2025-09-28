"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface ReviewDistributionData {
  positive: number;
  positivePercentage: string;
  negative: number;
  negativePercentage: string;
  total: number;
}

interface ReviewDistributionChartProps {
  data: ReviewDistributionData;
}

export function ReviewDistributionChart({
  data,
}: ReviewDistributionChartProps) {
  if (!data) return null;

  const chartData = [
    { name: "Positive", value: parseFloat(data.positivePercentage), color: "#48a256" },
    { name: "Negative", value: parseFloat(data.negativePercentage), color: "#f97316" },
  ];

  return (
    <div className="space-y-6">
      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={0}
              dataKey="value"
              strokeWidth={0}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-3">
        {chartData.map((item) => (
          <div key={item.name} className="flex items-center space-x-3">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-[17px] font-medium text-[#1F2937]">
              {item.value}% {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
