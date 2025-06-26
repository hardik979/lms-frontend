"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const data = [
  {
    stage: "Min Guarantee",
    itJobsFactory: 5,
    market: 3,
  },
  {
    stage: "Minimum",
    itJobsFactory: 6.5,
    market: 4.2,
  },
  {
    stage: "Average",
    itJobsFactory: 8,
    market: 6.5,
  },
  {
    stage: "Highest",
    itJobsFactory: 15,
    market: 8,
  },
];

export default function ComparisonChart() {
  return (
    <section className="bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900  text-white mt-6 rounded-xl py-16 px-6 sm:px-12">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
          Salary Comparison (IT Jobs Factory vs Market)
        </h2>

        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis
              dataKey="stage"
              stroke="#e5e7eb"
              tick={{ fill: "#e5e7eb", fontSize: 12 }}
            />
            <YAxis
              domain={[0, 20]}
              tickFormatter={(val) => `${val} LPA`}
              stroke="#e5e7eb"
              tick={{ fill: "#e5e7eb", fontSize: 12 }}
              label={{
                value: "Salary (LPA)",
                angle: -90,
                position: "insideLeft",
                fill: "#e5e7eb",
                fontSize: 12,
              }}
            />
            <Tooltip
              contentStyle={{ backgroundColor: "#1e293b", border: "none" }}
              labelStyle={{ color: "#e5e7eb" }}
              itemStyle={{ color: "#e5e7eb" }}
              formatter={(val: number) => `${val} LPA`}
            />
            <Legend
              wrapperStyle={{
                color: "#e5e7eb",
              }}
            />
            <Line
              type="monotone"
              dataKey="itJobsFactory"
              name="IT Jobs Factory"
              stroke="#22d3ee"
              strokeWidth={3}
              dot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="market"
              name="Market"
              stroke="#9ca3af"
              strokeWidth={2}
              dot={{ r: 5 }}
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
