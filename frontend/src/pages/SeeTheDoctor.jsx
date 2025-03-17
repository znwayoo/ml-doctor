import { useState } from 'react';
import DiagnosisForm from '../components/forms/DiagnosisForm';
import ResultModal from '../components/ResultModal';

export default function SeeTheDoctor() {
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);
  const [bmiInfo, setBmiInfo] = useState(null);
  const [error, setError] = useState('');

  const handleResults = (data) => {
    try {
      console.log('Received results:', data); // Debug log
      setResults(data.predictions);
      setBmiInfo(data.bmiInfo);
      setShowResults(true);
      setError('');
    } catch (err) {
      console.error('Error handling results:', err);
      setError('Failed to process results');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">
        🏥 Diabetic Doctor - Do you have diabetes? 🤔
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}

      <DiagnosisForm onResults={handleResults} />

      {showResults && results && bmiInfo && (
        <ResultModal
          results={results}
          bmiInfo={bmiInfo}
          onClose={() => setShowResults(false)}
        />
      )}
    </div>
  );
}
