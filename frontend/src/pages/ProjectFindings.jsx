import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import { api } from '../services/api';

export default function ProjectFindings() {
  const [diabetesData, setDiabetesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDiabetesDistribution = async () => {
      try {
        const data = await api.getDistribution('diabetes_status');
        // Transform the data for side-by-side bars
        const transformedData = [
          {
            status: 'No Diabetes',
            percentage: data['0'] || 0,
            fill: '#4CAF50'
          },
          {
            status: 'Has Diabetes',
            percentage: data['1'] || 0,
            fill: '#F44336'
          }
        ];
        setDiabetesData(transformedData);
      } catch (err) {
        console.error('Error fetching diabetes distribution:', err);
        setError('Failed to load diabetes distribution data');
      } finally {
        setLoading(false);
      }
    };

    fetchDiabetesDistribution();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Diabetes Risk Prediction Project</h1>
      
      <section className="prose lg:prose-xl mb-12">
        <h2>Project Overview</h2>
        <p>
          This project aims to predict diabetes risk using machine learning models
          trained on the BRFSS 2023 dataset. We'll explore the data, understand the
          key factors, and provide insights into diabetes risk prediction.
        </p>
      </section>

      <section className="bg-white rounded-lg shadow p-6 mb-12">
        <h2 className="text-2xl font-bold mb-4">Diabetes Distribution in Dataset</h2>
        {loading ? (
          <div className="flex justify-center items-center h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="text-red-600 text-center p-4">{error}</div>
        ) : (
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={diabetesData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="status"
                  tick={{ fill: '#666' }}
                  tickLine={{ stroke: '#666' }}
                />
                <YAxis 
                  label={{ 
                    value: 'Percentage (%)', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { textAnchor: 'middle' }
                  }}
                  domain={[0, 100]}
                  tick={{ fill: '#666' }}
                  tickLine={{ stroke: '#666' }}
                />
                <Tooltip 
                  formatter={(value) => [`${value.toFixed(2)}%`, 'Percentage']}
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                  }}
                />
                <Bar 
                  dataKey="percentage"
                  radius={[4, 4, 0, 0]}
                  fillOpacity={0.8}
                  animationDuration={1000}
                  fill={(entry) => entry.fill}
                >
                  <LabelList 
                    dataKey="percentage" 
                    position="top" 
                    formatter={(value) => `${value.toFixed(2)}%`}
                    style={{ 
                      fill: '#666',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        <div className="mt-4 text-sm text-gray-600">
          <p>This chart shows the distribution of diabetes cases in our dataset. 
          The green bar represents individuals without diabetes, while the red bar represents those with diabetes.</p>
        </div>
      </section>
    </div>
  );
}
