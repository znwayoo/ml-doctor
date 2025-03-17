import { useState, useEffect } from 'react';
import { api } from '../services/api';
import BarChart from '../components/charts/BarChart';
import HeatMap from '../components/charts/HeatMap';

export default function Dashboard() {
  const [distributionData, setDistributionData] = useState(null);
  const [correlationData, setCorrelationData] = useState(null);
  const [avgRiskData, setAvgRiskData] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState('age_group');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const features = [
    { value: 'age_group', label: 'Age Group' },
    { value: 'sex', label: 'Gender' },
    { value: 'race', label: 'Race' },
    { value: 'education', label: 'Education' },
    { value: 'bmi_category', label: 'BMI Category' },
    { value: 'physical_activity', label: 'Physical Activity' },
    { value: 'smoking_status', label: 'Smoking Status' },
    { value: 'alcohol_consumption_cat', label: 'Alcohol Consumption' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [distribution, correlation, avgRisk] = await Promise.all([
          api.getDistribution(selectedFeature),
          api.getCorrelation(),
          api.getAverageRisk(selectedFeature)
        ]);

        setDistributionData(distribution);
        setCorrelationData(correlation);
        setAvgRiskData(avgRisk);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedFeature]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Feature
        </label>
        <select
          value={selectedFeature}
          onChange={(e) => setSelectedFeature(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          {features.map(feature => (
            <option key={feature.value} value={feature.value}>
              {feature.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {distributionData && (
          <BarChart
            data={distributionData}
            title={`Distribution by ${selectedFeature}`}
          />
        )}
        
        {avgRiskData && (
          <BarChart
            data={avgRiskData}
            title={`Average Diabetes Risk by ${selectedFeature}`}
          />
        )}
      </div>

      {correlationData && (
        <div className="mt-6">
          <HeatMap data={correlationData} />
        </div>
      )}
    </div>
  );
}
