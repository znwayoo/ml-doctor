export default function ResultModal({ results, bmiInfo, onClose }) {
  if (!results || !bmiInfo) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full m-4">
        <h2 className="text-2xl font-bold mb-4">Your Results</h2>
        
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
