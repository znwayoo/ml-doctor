import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function ConfusionMatrix({ data, title }) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!data || !data.matrix) return;

    const updateChart = () => {
      // Clear previous rendering
      d3.select(svgRef.current).selectAll("*").remove();

      const container = containerRef.current;
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight || containerWidth; // 1:1 aspect ratio

      // Calculate responsive dimensions
      const margin = { 
        top: containerHeight * 0.1, 
        right: containerWidth * 0.1, 
        bottom: containerHeight * 0.15, 
        left: containerWidth * 0.15 
      };

      const width = containerWidth - margin.left - margin.right;
      const height = containerHeight - margin.top - margin.bottom;
      const cellSize = Math.min(width, height) / 2; // For 2x2 matrix

      // Create color scale
      const colorScale = d3.scaleLinear()
        .domain([0, d3.max(data.matrix.flat())])
        .range(['#f7fbff', '#08306b']);

      // Create SVG
      const svg = d3.select(svgRef.current)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      // Add cells
      const cells = svg.selectAll('rect')
        .data(data.matrix.flat())
        .enter()
        .append('rect')
        .attr('x', (d, i) => (i % 2) * cellSize)
        .attr('y', (d, i) => Math.floor(i / 2) * cellSize)
        .attr('width', cellSize)
        .attr('height', cellSize)
        .attr('fill', d => colorScale(d))
        .attr('stroke', 'white')
        .attr('stroke-width', 2);

      // Add text labels
      svg.selectAll('text.value')
        .data(data.matrix.flat())
        .enter()
        .append('text')
        .attr('x', (d, i) => (i % 2) * cellSize + cellSize / 2)
        .attr('y', (d, i) => Math.floor(i / 2) * cellSize + cellSize / 2)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .style('fill', d => d / d3.max(data.matrix.flat()) > 0.5 ? 'white' : 'black')
        .style('font-size', '14px')
        .text(d => d.toLocaleString());

      // Add row labels
      svg.selectAll('text.row-label')
        .data(data.labels)
        .enter()
        .append('text')
        .attr('x', -30)
        .attr('y', (d, i) => i * cellSize + cellSize / 2)
        .attr('text-anchor', 'middle')
        .attr('transform', (d, i) => `rotate(-90, -30, ${i * cellSize + cellSize / 2})`)
        .style('font-size', '12px')
        .text(d => d);

      // Add column labels
      svg.selectAll('text.col-label')
        .data(data.labels)
        .enter()
        .append('text')
        .attr('x', (d, i) => i * cellSize + cellSize / 2)
        .attr('y', -10)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .text(d => d);

      // Add title
      svg.append('text')
        .attr('x', width / 2)
        .attr('y', -30)
        .attr('text-anchor', 'middle')
        .style('font-size', '16px')
        .style('font-weight', 'bold')
        .text('Predicted');

      svg.append('text')
        .attr('x', -height / 2)
        .attr('y', -70)
        .attr('text-anchor', 'middle')
        .style('font-size', '16px')
        .style('font-weight', 'bold')
        .attr('transform', 'rotate(-90)')
        .text('Actual');
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
      <h3 className="text-lg font-semibold mb-4">{title || 'Confusion Matrix'}</h3>
      <div className="max-w-3xl mx-auto">
        <div ref={containerRef} className="w-full aspect-square">
          <svg ref={svgRef} className="w-full h-full"></svg>
        </div>
      </div>
    </div>
  );
} 