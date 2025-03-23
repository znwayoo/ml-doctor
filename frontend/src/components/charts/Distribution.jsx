import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList
} from "recharts";

export default function Distribution({ data, xAxisKey, yAxisKey, title }) {
  // Transform data from object to array format for Recharts
  const chartData = Object.entries(data).map(([category, value]) => ({
    category,
    value: Number(value.toFixed(2)),
  }));

  // Calculate dynamic XAxis height based on number of categories
  const getXAxisHeight = () => {
    return chartData.length <= 2 ? 100 : 200;
  };

  return (
    <div className="w-full h-[550px] bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart 
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3"stroke="oklch(0.92 0.004 286.32)"/>
          <XAxis 
            dataKey="category" 
            angle={-45} 
            textAnchor="end" 
            height={getXAxisHeight()}
            tick={{ 
              fontSize: 12,
              fill: '#666',
              dx: -5
            }}
            interval={0}
          />
          <YAxis
            label={{
              value: "% of Population",
              angle: -90,
              position: "insideLeft",
              style: { textAnchor: 'middle' }
            }}
            tick={{ fontSize: 10 }}
          />
          <Tooltip 
            formatter={(value) => [`${value.toFixed(2)}%`, "Percentage"]}
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          <Bar dataKey="value" fill="#8884d8">
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
