import { useState, useEffect } from 'react';
import { api } from '../services/api';
import BarChart from '../components/charts/BarChart';
import HeatMap from '../components/charts/HeatMap';
import ConfusionMatrix from '../components/charts/ConfusionMatrix';

export default function Dashboard() {
  const [distributionData, setDistributionData] = useState(null);
  const [correlationData, setCorrelationData] = useState(null);
  const [avgRiskData, setAvgRiskData] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState('age_group');
  const [selectedModel, setSelectedModel] = useState('Decision_Tree');
  const [confusionMatrix, setConfusionMatrix] = useState(null);
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
    { value: 'alcohol_consumption_cat', label: 'Alcohol Consumption' },
    { value: 'high_blood_pressure', label: 'High Blood Pressure'},
    { value: 'high_cholesterol', label: 'High Cholesterol'},
    { value: 'heart_disease', label: 'Heart Disease'},
    { value: 'kidney_disease', label: 'Kidney Disease'},
  ];

  const models = [
    "Decision_Tree",
    "Logistic_Regression",
    "XGBoost",
    "LightGBM"
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [distribution, correlation, avgRisk, confusion] = await Promise.all([
          api.getDistribution(selectedFeature),
          api.getCorrelation(),
          api.getAverageRisk(selectedFeature),
          api.getConfusionMatrix(selectedModel)
        ]);

        console.log('Confusion Matrix Data:', confusion);

        setDistributionData(distribution);
        setCorrelationData(correlation);
        setAvgRiskData(avgRisk);
        setConfusionMatrix(confusion);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedFeature, selectedModel]);

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Model for Confusion Matrix
          </label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {models.map(model => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>
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

        {confusionMatrix && console.log('Rendering Confusion Matrix:', confusionMatrix)}
        {confusionMatrix && (
          <ConfusionMatrix 
            data={confusionMatrix}
            title={`Confusion Matrix of ${selectedModel}`}
          />
        )}
      </div>

      {correlationData && (
        <div className="mt-12">
          <HeatMap data={correlationData} />
        </div>
      )}
    </div>
  );
}
