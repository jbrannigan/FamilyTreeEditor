import React, { useState, useEffect } from "react";

function TreeNode({ node, path, onFocus, expandedPaths, toggleExpand }) {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedPaths.has(path);

  return (
    <div style={{ marginLeft: "1em" }}>
      <div>
        {hasChildren && (
          <button
            onClick={() => toggleExpand(path)}
            style={{ marginRight: "0.5em" }}
          >
            {isExpanded ? "−" : "+"}
          </button>
        )}
        <span
          style={{ cursor: "pointer", fontWeight: "bold" }}
          onClick={() => onFocus(node)}
        >
          {node.name}
        </span>
      </div>
      {hasChildren && isExpanded && (
        <div>
          {node.children.map((child, index) => (
            <TreeNode
              key={index}
              node={child}
              path={`${path}-${index}`}
              onFocus={onFocus}
              expandedPaths={expandedPaths}
              toggleExpand={toggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Helper to collect all node paths
function getAllPaths(node, path = "0") {
  let paths = [path];
  if (node.children) {
    node.children.forEach((child, index) => {
      const childPath = `${path}-${index}`;
      paths = paths.concat(getAllPaths(child, childPath));
    });
  }
  return paths;
}


function TreeView({ data, focusedNode, onFocus }) {
  const [expandedPaths, setExpandedPaths] = useState(new Set());

  useEffect(() => {
    if (data) {
      const allPaths = getAllPaths(data);
      setExpandedPaths(new Set(allPaths));
    }
  }, [data]);

  const toggleExpand = (path) => {
    setExpandedPaths((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };

  if (!data) return <div>Loading tree...</div>;

  return (
    <div className="tree-view" style={{ padding: "1em", overflowY: "auto" }}>
      <TreeNode
        node={data}
        path="0"
        onFocus={onFocus}
        expandedPaths={expandedPaths}
        toggleExpand={toggleExpand}
      />
    </div>
  );
}

export default TreeView;
