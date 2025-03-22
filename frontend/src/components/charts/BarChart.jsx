import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList
} from "recharts";

export default function BarChart({ data, xAxisKey, yAxisKey, title }) {
  // Transform data from object to array format for Recharts
  const chartData = Object.entries(data).map(([category, value]) => ({
    category,
    value: Number(value.toFixed(2)),
  }));

  return (
    <div className="w-full h-[400px] bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} />
          <YAxis
            label={{
              value: "% of Population",
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" name="Percentage">
            <LabelList
              dataKey="value"
              position="top"
              formatter={(value) => `${value.toFixed(2)}%`}
              style={{
                fill: "#666",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            />
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
