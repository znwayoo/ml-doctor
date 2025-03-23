import { useState, useEffect } from 'react';
import { api } from '../services/api';
import BarChart from '../components/charts/BarChart';
import HeatMap from '../components/charts/HeatMap';
import ConfusionMatrix from '../components/charts/ConfusionMatrix';
import { getFeatureLabel } from '../utils/dataTransformers';

export default function Dashboard() {
  // State for data
  const [distributionData, setDistributionData] = useState(null);
  const [correlationData, setCorrelationData] = useState(null);
  const [avgRiskData, setAvgRiskData] = useState(null);
  const [confusionMatrix, setConfusionMatrix] = useState(null);
  
  // Selection states
  const [selectedFeature, setSelectedFeature] = useState('age_group');
  const [selectedModel, setSelectedModel] = useState('Decision_Tree');
  
  // Individual loading states
  const [distributionLoading, setDistributionLoading] = useState(true);
  const [confusionLoading, setConfusionLoading] = useState(true);
  const [correlationLoading, setCorrelationLoading] = useState(true);
  
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

  // Effect for distribution data
  useEffect(() => {
    const fetchDistributionData = async () => {
      setDistributionLoading(true);
      try {
        const [distribution, avgRisk] = await Promise.all([
          api.getDistribution(selectedFeature),
          api.getAverageRisk(selectedFeature)
        ]);

        const transformedDistribution = Object.entries(distribution).reduce((acc, [key, value]) => {
          acc[getFeatureLabel(selectedFeature, key)] = value;
          return acc;
        }, {});

        const transformedAvgRisk = Object.entries(avgRisk).reduce((acc, [key, value]) => {
          acc[getFeatureLabel(selectedFeature, key)] = value;
          return acc;
        }, {});

        setDistributionData(transformedDistribution);
        setAvgRiskData(transformedAvgRisk);
        setError(null);
      } catch (err) {
        console.error('Error fetching distribution data:', err);
        setError('Failed to load distribution data');
      } finally {
        setDistributionLoading(false);
      }
    };

    fetchDistributionData();
  }, [selectedFeature]);

  // Effect for confusion matrix
  useEffect(() => {
    const fetchConfusionData = async () => {
      setConfusionLoading(true);
      try {
        const confusion = await api.getConfusionMatrix(selectedModel);
        setConfusionMatrix(confusion);
        setError(null);
      } catch (err) {
        console.error('Error fetching confusion matrix:', err);
        setError('Failed to load confusion matrix');
      } finally {
        setConfusionLoading(false);
      }
    };

    fetchConfusionData();
  }, [selectedModel]);

  // Effect for correlation matrix (only fetched once)
  useEffect(() => {
    const fetchCorrelationData = async () => {
      setCorrelationLoading(true);
      try {
        const correlation = await api.getCorrelation();
        setCorrelationData(correlation);
        setError(null);
      } catch (err) {
        console.error('Error fetching correlation data:', err);
        setError('Failed to load correlation data');
      } finally {
        setCorrelationLoading(false);
      }
    };

    fetchCorrelationData();
  }, []); // Empty dependency array as correlation data only needs to be fetched once

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

      {/* Distribution Analysis Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Distribution Analysis</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Feature
          </label>
          <select
            value={selectedFeature}
            onChange={(e) => setSelectedFeature(e.target.value)}
            className="mt-1 block w-full md:w-1/3 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-10 px-3"
          >
            {features.map(feature => (
              <option key={feature.value} value={feature.value}>
                {feature.label}
              </option>
            ))}
          </select>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          {distributionLoading ? (
            <div className="flex justify-center items-center h-[400px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
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
          )}
        </div>
      </section>

      {/* Confusion Matrix Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Model Performance Analysis</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Model
          </label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="mt-1 block w-full md:w-1/3 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-10 px-3"
          >
            {models.map(model => (
              <option key={model} value={model}>
                {model.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          {confusionLoading ? (
            <div className="flex justify-center items-center h-[400px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            confusionMatrix && (
              <ConfusionMatrix 
                data={confusionMatrix}
                title={`Confusion Matrix of ${selectedModel.replace('_', ' ')}`}
              />
            )
          )}
        </div>
      </section>

      {/* Correlation Matrix Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Feature Correlation Analysis</h2>
        <div className="bg-white rounded-lg shadow p-6">
          {correlationLoading ? (
            <div className="flex justify-center items-center h-[400px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            correlationData && <HeatMap data={correlationData} />
          )}
        </div>
      </section>
    </div>
  );
}
