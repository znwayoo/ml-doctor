import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function HeatMap({ data }) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!data) return;

    const updateChart = () => {
      // Clear previous rendering
      d3.select(svgRef.current).selectAll("*").remove();

      const features = Object.keys(data);
      const container = containerRef.current;
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight || containerWidth * 0.8; // Set a default aspect ratio if height is 0

      // Calculate responsive dimensions
      const margin = { 
        top: containerHeight * 0.05, 
        right: containerWidth * 0.15, // Increased for legend
        bottom: containerHeight * 0.15, 
        left: containerWidth * 0.15 
      };

      const width = containerWidth - margin.left - margin.right;
      const height = containerHeight - margin.top - margin.bottom;
      const cellSize = Math.min(width, height) / features.length;

      // Updated color scale for better visibility of negative values
      const colorScale = d3.scaleLinear()
        .domain([-1, 0, 1])
        .range(['#ef3b2c', '#fff', '#08519c']);

      // Create SVG
      const svg = d3.select(svgRef.current)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      // Create cells
      features.forEach((row, i) => {
        features.forEach((col, j) => {
          svg.append('rect')
            .attr('x', j * cellSize)
            .attr('y', i * cellSize)
            .attr('width', cellSize)
            .attr('height', cellSize)
            .attr('fill', colorScale(data[row][col]))
            .attr('stroke', 'white')
            .attr('stroke-width', 1);

          svg.append('text')
            .attr('x', j * cellSize + cellSize / 2)
            .attr('y', i * cellSize + cellSize / 2)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .style('fill', Math.abs(data[row][col]) > 0.5 ? 'white' : 'black')
            .style('font-size', '12px')
            .text(data[row][col].toFixed(2));
        });
      });

      // Update column labels - moved to bottom with -90 degree rotation
      svg.selectAll('text.col-label')
        .data(features)
        .enter()
        .append('text')
        .attr('x', (d, i) => i * cellSize + cellSize / 2)
        .attr('y', height - 80) // Reduced from 20 to 10
        .attr('transform', (d, i) => `rotate(-90, ${i * cellSize + cellSize / 2}, ${height - 80})`) // Update transform to match new y
        .attr('text-anchor', 'end')
        .style('font-size', '12px')
        .text(d => d);

      // Update row labels
      svg.selectAll('text.row-label')
        .data(features)
        .enter()
        .append('text')
        .attr('x', -30)
        .attr('y', (d, i) => i * cellSize + cellSize / 2)
        .attr('text-anchor', 'end')
        .attr('dominant-baseline', 'middle')
        .style('font-size', '12px')
        .text(d => d);

      // Create vertical color legend on the right
      const legendWidth = containerWidth * 0.03; // 3% of container width
      const legendHeight = height * 0.6;
      
      const legendScale = d3.scaleLinear()
        .domain([-1, 0, 1])
        .range([legendHeight, legendHeight/2, 0]);
      
      const legendAxis = d3.axisRight(legendScale)
        .tickValues([-1, -0.5, 0, 0.5, 1])
        .tickFormat(d3.format(".1f"));

      // Center the legend vertically
      const legendY = (height - legendHeight) / 2;
      
      const legend = svg.append('g')
        .attr('transform', `translate(${width + 30}, ${legendY})`); // Added vertical offset

      // Create gradient for legend
      const defs = svg.append('defs');
      const gradient = defs.append('linearGradient')
        .attr('id', 'correlation-gradient')
        .attr('x1', '0%')
        .attr('x2', '0%')
        .attr('y1', '100%')
        .attr('y2', '0%');

      gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', '#ef3b2c');

      gradient.append('stop')
        .attr('offset', '50%')
        .attr('stop-color', '#fff');

      gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', '#08519c');

      legend.append('rect')
        .attr('width', legendWidth)
        .attr('height', legendHeight)
        .style('fill', 'url(#correlation-gradient)');

      // Adjust legend axis position and style
      const legendAxisG = legend.append('g')
        .attr('transform', `translate(${legendWidth}, 0)`);
      
      legendAxisG.call(legendAxis)
        .selectAll('text') // Style the tick labels
        .style('font-size', '10px')
        .attr('dx', '5px'); // Move text slightly away from axis

      // Add legend title with adjusted position
      legend.append('text')
        .attr('transform', `translate(${legendWidth + 45}, ${legendHeight/2}) rotate(-90)`)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .text('Correlation');
    };

    // Initial render
    updateChart();

    // Add resize listener
    const resizeObserver = new ResizeObserver(updateChart);
    resizeObserver.observe(containerRef.current);

    // Cleanup
    return () => resizeObserver.disconnect();
  }, [data]);

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Correlation Matrix</h3>
      <div ref={containerRef} className="w-full aspect-square">
        <svg ref={svgRef} className="w-full h-full"></svg>
      </div>
    </div>
  );
}
