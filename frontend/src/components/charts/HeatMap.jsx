import { ResponsiveContainer } from 'recharts';

export default function HeatMap({ data }) {
  // Transform correlation matrix data
  const features = Object.keys(data);
  const maxValue = Math.max(...features.flatMap(f => 
    Object.values(data[f]).map(Math.abs)
  ));

  const getColor = (value) => {
    const normalized = (value + 1) / 2; // Convert from [-1,1] to [0,1]
    return `hsl(${normalized * 240}, 70%, 60%)`;
  };

  return (
    <div className="w-full h-full bg-white p-4 rounded-lg shadow overflow-auto">
      <h3 className="text-lg font-semibold mb-4">Correlation Matrix</h3>
      <div className="relative">
        <table className="w-full">
          <thead>
            <tr>
              <th className="sticky top-0 left-0 bg-white z-20"></th>
              {features.map(feature => (
                <th 
                  key={feature}
                  className="p-2 sticky top-0 bg-white z-10 transform -rotate-90 origin-left"
                  style={{ minWidth: '40px' }}
                >
                  {feature}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.map(row => (
              <tr key={row}>
                <th className="sticky left-0 bg-white z-10 p-2 text-left">
                  {row}
                </th>
                {features.map(col => (
                  <td 
                    key={`${row}-${col}`}
                    className="p-2 text-center text-sm"
                    style={{
                      backgroundColor: getColor(data[row][col]),
                      color: Math.abs(data[row][col]) > 0.5 ? 'white' : 'black'
                    }}
                  >
                    {data[row][col].toFixed(2)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
