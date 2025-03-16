import { useState, useEffect } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ScatterChart, Scatter, ZAxis } from "recharts";
import ReactECharts from "echarts-for-react";

const API_BASE_URL = "http://127.0.0.1:5000/api/charts";

export default function Dashboard() {
  const [distributionData, setDistributionData] = useState([]);
  const [correlationData, setCorrelationData] = useState([]);
  const [avgRiskData, setAvgRiskData] = useState([]);
  const [selectedFeature, setSelectedFeature] = useState("age_group");

  useEffect(() => {
    if (!selectedFeature) return;

    axios.get(`${API_BASE_URL}/distribution?feature=${selectedFeature}`)
      .then(response => {
        setDistributionData(
          Object.entries(response.data).map(([key, value]) => ({ name: key, value }))
        );
      })
      .catch(error => console.error("Error fetching distribution:", error));

    axios.get(`${API_BASE_URL}/correlation`)
      .then(response => {
        setCorrelationData(response.data);
      })
      .catch(error => console.error("Error fetching correlation:", error));

    axios.get(`${API_BASE_URL}/avg_risk?feature=${selectedFeature}`)
      .then(response => {
        setAvgRiskData(
          Object.entries(response.data).map(([key, value]) => ({ x: key, y: value }))
        );
      })
      .catch(error => console.error("Error fetching avg risk:", error));
  }, [selectedFeature]);

  const heatmapOption = {
    title: { text: "Correlation Matrix" },
    tooltip: {},
    xAxis: { 
      type: "category", 
      data: Object.keys(correlationData),
      axisLabel: {
        rotate: 90, // Rotate labels by 90 degrees
        interval: 0, // Ensure all labels are displayed
      },
     },
    yAxis: { type: "category", data: Object.keys(correlationData) },
    visualMap: { min: -1, max: 1, calculable: true, orient: "vertical", left: "right" },
    series: [{
      type: "heatmap",
      data: Object.entries(correlationData).flatMap(([row, values]) =>
        Object.entries(values).map(([col, value]) => [row, col, value])
      ),
      label: {
        show: true,
        formatter: ({ value }) => value[2].toFixed(2),
      },
      itemStyle: {
        borderWidth: 1,
        borderColor: "#fff"
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: "rgba(0,0,0,0.5)"
        }
      }
    }],
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-center">📊 Dashboard</h1>

      <div className="text-center space-x-2">
        <label className="font-semibold">Select Feature:</label>
        <select 
          className="border p-2 rounded-md"
          value={selectedFeature}
          onChange={(e) => setSelectedFeature(e.target.value)}
        >
          <option value="age_group">Age Group</option>
          <option value="bmi_category">BMI Category</option>
          <option value="smoking_status">Smoking Status</option>
        </select>
      </div>

      {/* Bar Chart - Distribution */}
      <div className="border p-4">
        <h2 className="text-lg font-semibold">Feature Distribution</h2>
        <BarChart width={500} height={300} data={distributionData}>
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <Tooltip />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </div>

      {/* Heatmap - Correlation */}
      <div className="border p-4">
        <h2 className="text-lg font-semibold">Correlation Matrix</h2>
        <ReactECharts option={heatmapOption} style={{ height: "500px", width: "100%" }} />
      </div>

      {/* Scatter Plot for Avg Risk */}
      <div className="border p-4">
        <h2 className="text-lg font-semibold">Scatter Plot - Avg Risk</h2>
        <ScatterChart width={500} height={400}>
          <XAxis type="category" dataKey="x" name="Feature Value" />
          <YAxis type="number" dataKey="y" name="Risk Probability" />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Scatter data={avgRiskData} fill="#ff7300" />
        </ScatterChart>
      </div>
    </div>
  );
}
