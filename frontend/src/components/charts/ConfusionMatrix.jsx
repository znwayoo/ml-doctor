import { ResponsiveContainer, ComposedChart, XAxis, YAxis, Tooltip, Rectangle, Cell } from 'recharts';

export default function ConfusionMatrix({ data, title }) {
  if (!data || !data.matrix) return null;

  const maxValue = Math.max(...data.matrix.flat());

  const getColor = (value) => {
    const normalized = value / maxValue;
    return `hsl(200, 70%, ${100 - normalized * 50}%)`; // Blue shade getting darker with higher values
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">{title || 'Confusion Matrix'}</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-2 border"></th>
              <th className="p-2 border text-center" colSpan="2">Predicted</th>
            </tr>
            <tr>
              <th className="p-2 border"></th>
              {data.labels.map((label) => (
                <th key={label} className="p-2 border text-center">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.matrix.map((row, i) => (
              <tr key={i}>
                <th className="p-2 border text-left">
                  {data.labels[i]}
                </th>
                {row.map((value, j) => (
                  <td
                    key={`${i}-${j}`}
                    className="p-4 border text-center"
                    style={{
                      backgroundColor: getColor(value),
                      color: value / maxValue > 0.5 ? 'white' : 'black',
                      minWidth: '100px'
                    }}
                  >
                    {value.toLocaleString()}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-sm text-gray-600 text-center">
        <p>Actual values on rows, predicted values on columns</p>
        <p>Darker color indicates higher value</p>
      </div>
    </div>
  );
} 