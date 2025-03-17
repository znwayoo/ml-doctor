import { useState } from 'react';
import { api } from '../../services/api';
import { transformFormData, calculateBMI } from '../../utils/helpers';
import { 
  AGE_MAP, 
  GENDER_MAP, 
  RACE_MAP, 
  EDUCATION_MAP,
  BINARY_MAP,
  ALCOHOL_MAP 
} from '../../utils/constants';

export default function DiagnosisForm({ onResults }) {
  const [formData, setFormData] = useState({
    age_group: 'Age 18 to 24',
    gender: 'Male',
    race: 'White',
    education: 'Graduated High School',
    weight: '',
    height: '',
    physical_activity: 'No',
    alcohol_consumption: 'No Alcohol',
    smoking_status: 'No',
    high_blood_pressure: 'No',
    high_cholesterol: 'No',
    heart_disease: 'No',
    kidney_disease: 'No'
  });

  const [error, setError] = useState('');

  const validateForm = () => {
    if (!formData.weight || parseFloat(formData.weight) <= 0) {
      setError('Please enter a valid weight');
      return false;
    }
    if (!formData.height || parseFloat(formData.height) <= 0) {
      setError('Please enter a valid height');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const transformedData = transformFormData(formData);
      const bmiInfo = calculateBMI(parseFloat(formData.weight), parseFloat(formData.height));
      
      console.log('Sending data to API:', transformedData); // Debug log
      const response = await api.getPrediction(transformedData);
      console.log('API Response:', response); // Debug log
      
      onResults({ 
        predictions: response.predictions,
        bmiInfo 
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('An error occurred while processing your request');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Age Group */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Age Group
          </label>
          <select
            value={formData.age_group}
            onChange={(e) => setFormData({...formData, age_group: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {Object.keys(AGE_MAP).map(age => (
              <option key={age} value={age}>{age}</option>
            ))}
          </select>
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Gender
          </label>
          <select
            value={formData.gender}
            onChange={(e) => setFormData({...formData, gender: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {Object.keys(GENDER_MAP).map(gender => (
              <option key={gender} value={gender}>{gender}</option>
            ))}
          </select>
        </div>

        {/* Race */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Race
          </label>
          <select
            value={formData.race}
            onChange={(e) => setFormData({...formData, race: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {Object.keys(RACE_MAP).map(race => (
              <option key={race} value={race}>{race}</option>
            ))}
          </select>
        </div>

        {/* Education */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Education Level
          </label>
          <select
            value={formData.education}
            onChange={(e) => setFormData({...formData, education: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {Object.keys(EDUCATION_MAP).map(edu => (
              <option key={edu} value={edu}>{edu}</option>
            ))}
          </select>
        </div>

        {/* Weight and Height */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Weight (kg)
            </label>
            <input
              type="number"
              value={formData.weight}
              onChange={(e) => setFormData({...formData, weight: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              min="1"
              step="0.1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Height (cm)
            </label>
            <input
              type="number"
              value={formData.height}
              onChange={(e) => setFormData({...formData, height: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              min="1"
              step="0.1"
              required
            />
          </div>
        </div>

        {/* Physical Activity */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Do you exercise?
          </label>
          <select
            value={formData.physical_activity}
            onChange={(e) => setFormData({...formData, physical_activity: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {Object.keys(BINARY_MAP).map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        {/* Alcohol Consumption */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Alcohol Consumption (within 30 days)
          </label>
          <select
            value={formData.alcohol_consumption}
            onChange={(e) => setFormData({...formData, alcohol_consumption: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {Object.keys(ALCOHOL_MAP).map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        {/* Smoking Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Do you smoke?
          </label>
          <select
            value={formData.smoking_status}
            onChange={(e) => setFormData({...formData, smoking_status: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {Object.keys(BINARY_MAP).map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        {/* High Blood Pressure */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Do you have high blood pressure?
          </label>
          <select
            value={formData.high_blood_pressure}
            onChange={(e) => setFormData({...formData, high_blood_pressure: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {Object.keys(BINARY_MAP).map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        {/* High Cholesterol */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Do you have high cholesterol?
          </label>
          <select
            value={formData.high_cholesterol}
            onChange={(e) => setFormData({...formData, high_cholesterol: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {Object.keys(BINARY_MAP).map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        {/* Heart Disease */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Do you have heart disease?
          </label>
          <select
            value={formData.heart_disease}
            onChange={(e) => setFormData({...formData, heart_disease: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {Object.keys(BINARY_MAP).map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        {/* Kidney Disease */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Do you have kidney disease?
          </label>
          <select
            value={formData.kidney_disease}
            onChange={(e) => setFormData({...formData, kidney_disease: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {Object.keys(BINARY_MAP).map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Add error message display */}
      {error && (
        <div className="text-red-600 text-sm mt-2">
          {error}
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Diagnose
      </button>
    </form>
  );
}
