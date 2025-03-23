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
      // Also remove any existing tooltips
      d3.select(containerRef.current).selectAll('.tooltip').remove();

      const container = containerRef.current;
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight || containerWidth;

      const margin = { 
        top: containerHeight * 0.1, 
        right: containerWidth * 0.1, 
        bottom: containerHeight * 0.15, 
        left: containerWidth * 0.15 
      };

      const width = containerWidth - margin.left - margin.right;
      const height = containerHeight - margin.top - margin.bottom;
      const cellSize = Math.min(width, height) / 2;

      // Create color scale
      const colorScale = d3.scaleLinear()
        .domain([0, d3.max(data.matrix.flat())])
        .range(['#f7fbff', '#08306b']);

      // Create tooltip with fixed positioning relative to container
      const tooltip = d3.select(containerRef.current)
        .append("div")
        .attr("class", "tooltip")
        .style("position", "fixed") // Change to fixed positioning
        .style("visibility", "hidden")
        .style("background-color", "rgba(0, 0, 0, 0.8)")
        .style("color", "white")
        .style("padding", "8px")
        .style("border-radius", "4px")
        .style("font-size", "12px")
        .style("pointer-events", "none")
        .style("z-index", "100"); // Ensure tooltip is above other elements

      // Function to get classification type
      const getClassificationType = (row, col) => {
        if (row === 0 && col === 0) return "True Negative";
        if (row === 0 && col === 1) return "False Positive";
        if (row === 1 && col === 0) return "False Negative";
        if (row === 1 && col === 1) return "True Positive";
        return "";
      };

      // Create SVG
      const svg = d3.select(svgRef.current)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      // Add cells with interactivity
      const cellGroups = svg.selectAll('g.cell-group')
        .data(data.matrix.flat())
        .enter()
        .append('g')
        .attr('class', 'cell-group')
        .attr('transform', (d, i) => `translate(${(i % 2) * cellSize},${Math.floor(i / 2) * cellSize})`);

      // Add rectangle to each group
      cellGroups.append('rect')
        .attr('width', cellSize)
        .attr('height', cellSize)
        .attr('fill', d => colorScale(d))
        .attr('stroke', 'white')
        .attr('stroke-width', 2)
        .style('cursor', 'pointer');

      // Add text to each group
      cellGroups.append('text')
        .attr('x', cellSize / 2)
        .attr('y', cellSize / 2)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .style('fill', d => d / d3.max(data.matrix.flat()) > 0.5 ? 'white' : 'black')
        .style('font-size', '14px')
        .style('pointer-events', 'none')
        .text(d => d.toLocaleString());

      // Add interactivity to the groups
      cellGroups
        .on('mouseover', function(event, d) {
          this.parentNode.appendChild(this);
          
          const i = data.matrix.flat().indexOf(d);
          const row = Math.floor(i / 2);
          const col = i % 2;
          const classificationType = getClassificationType(row, col);
          
          d3.select(this).select('rect')
            .attr('stroke', 'oklch(0.746 0.16 232.661)')
            .attr('stroke-width', 3);

          const cellRect = this.getBoundingClientRect();

          tooltip
            .style("visibility", "visible")
            .html(`
              <strong>${classificationType}</strong><br/>
              Count: ${d.toLocaleString()}<br/>
              Actual: ${data.labels[row]}<br/>
              Predicted: ${data.labels[col]}
            `)
            .style("left", `${cellRect.left + cellRect.width/2}px`)
            .style("top", `${cellRect.bottom + 20}px`)
            .style("transform", "translate(-50%, 0)");
        })
        .on('mouseout', function() {
          d3.select(this).select('rect')
            .attr('stroke', 'white')
            .attr('stroke-width', 2);
          
          tooltip.style("visibility", "hidden");
        })
        .on('mousemove', function(event) {
          tooltip
            .style("left", `${event.clientX}px`)
            .style("top", `${event.clientY + 20}px`)
            .style("transform", "translate(-50%, 0)");
        });

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
    return () => {
      resizeObserver.disconnect();
      d3.select(containerRef.current).selectAll('.tooltip').remove();
    };
  }, [data]);

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">{title || 'Confusion Matrix'}</h3>
      <div className="max-w-3xl mx-auto">
        <div ref={containerRef} className="w-full aspect-square relative">
          <svg ref={svgRef} className="w-full h-full"></svg>
        </div>
      </div>
    </div>
  );
} 