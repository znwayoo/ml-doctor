export default function ResultModal({ results, bmiInfo, onClose }) {
  if (!results || !bmiInfo) return null;

  // Calculate average probability
  const averageProbability = 
    Object.values(results).reduce((sum, prob) => sum + prob, 0) / Object.values(results).length;

  // Determine risk color for average probability
  const avgRiskColor = 
    averageProbability > 0.5 ? 'text-red-600' :
    averageProbability >= 0.3 ? 'text-yellow-600' :
    'text-green-600';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-4">Your Results</h2>
        
        {/* Average Prediction Section */}
        <div className="text-center my-6 py-4 border-y border-gray-200">
          <p className="text-lg text-gray-600 mb-2">Average Diabetes Risk</p>
          <p className={`text-5xl font-bold ${avgRiskColor}`}>
            {(averageProbability * 100).toFixed(1)}%
          </p>
        </div>

        <div className="mb-4">
          <p className="text-lg">
            Your BMI: <span className="font-bold">{bmiInfo.bmi.toFixed(1)}</span>
          </p>
          <p className="text-lg">
            Category: 
            <span style={{ color: bmiInfo.color }} className="font-bold ml-2">
              {bmiInfo.category} {bmiInfo.emoji}
            </span>
          </p>
        </div>

        <div className="space-y-4">
          {Object.entries(results).map(([model, probability]) => {
            const riskColor = 
              probability > 0.5 ? 'text-red-600' :
              probability >= 0.3 ? 'text-yellow-600' :
              'text-green-600';

            return (
              <div key={model} className="border-b pb-2">
                <p className="text-lg">
                  {model} predicts a diabetes risk of:
                  <span className={`font-bold ml-2 ${riskColor}`}>
                    {(probability * 100).toFixed(2)}%
                  </span>
                </p>
              </div>
            );
          })}
        </div>

        <div className="text-xs text-gray-500 italic text-center mt-4 mb-2">
          Note: These predictions are for informational purposes only and should not be considered as medical advice. 
          Please consult with a healthcare professional for proper medical diagnosis and treatment.
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
        >
          Close
        </button>
      </div>
    </div>
  );
}
