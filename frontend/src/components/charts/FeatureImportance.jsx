import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';

export default function FeatureImportance({ data, selectedModel }) {
  const chartData = data[selectedModel].features.map((feature, index) => ({
    feature: feature,
    importance: selectedModel === "LightGBM" 
      ? data[selectedModel].importance[index]
      : data[selectedModel].importance[index] * 100,
  }));

  return (
    <div className="h-[500px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 10, right: 20, left: 20, bottom: 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.004 286.32)"/>
          <XAxis 
            type="number" 
            domain={selectedModel === "LightGBM" ? [0, 600] : [0, 60]}
            label={{ 
              value: selectedModel === "LightGBM" ? "Split Count" : "Importance (%)", 
              position: "bottom",
              offset: 10
            }}
          />
          <YAxis
            type="category"
            dataKey="feature"
            width={140}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(value) => [
              selectedModel === "LightGBM" 
                ? value.toFixed(0)
                : `${value.toFixed(2)}%`,
              "Importance"
            ]}
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          <Bar 
            dataKey="importance" 
            fill="#8884d8" 
            radius={[0, 4, 4, 0]}
          >
            <LabelList
              dataKey="importance"
              position="right"
              formatter={(value) => 
                selectedModel === "LightGBM" 
                  ? value.toFixed(0)
                  : `${value.toFixed(2)}%`
              }
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
} 