import React from "react";

function GraphView({ data, focusedNode, svgRef }) {
  return (
    <div>
      <h2>Graph View (Placeholder)</h2>
      <svg ref={svgRef} width="400" height="200">
        <text x="10" y="20">Graph rendering not implemented</text>
      </svg>
    </div>
  );
}

export default GraphView;