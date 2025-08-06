import React, { useState, useRef } from "react";
import TreeEditor from "./TreeEditor";
import TreeView from "./TreeView";
import GraphView from "./GraphView";
import UploadButton from "./UploadButton";
import DownloadButton from "./DownloadButton";
import "./App.css";

function App() {
  const [text, setText] = useState("");
  const [treeData, setTreeData] = useState(null);
  const [focusedNode, setFocusedNode] = useState(null);
  const svgRef = useRef();

  const parseTree = (text) => {
    const lines = text.split("\n");
    const stack = [];
    let root = null;

    for (const line of lines) {
      if (!line.trim()) continue;
      const level = line.search(/\S/);
      const node = { name: line.trim(), children: [] };

      while (stack.length > level) stack.pop();

      if (stack.length === 0) {
        root = node;
      } else {
        stack[stack.length - 1].children.push(node);
      }
      stack.push(node);
    }
    return root;
  };

  const handleTextChange = (newText) => {
    setText(newText);
    const parsed = parseTree(newText);
    setTreeData(parsed);
  };

  const handleFileUpload = (fileContent) => {
    setText(fileContent);
    const parsed = parseTree(fileContent);
    setTreeData(parsed);
  };

  const handleDownload = (content, filename, type = "text/plain") => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

const generateHTML = (node) => {
  if (!node) return "";
  const childrenHTML =
    node.children && node.children.length > 0
      ? `<div class="children" style="margin-left:1em;">${node.children
          .map(generateHTML)
          .join("")}</div>`
      : "";
  return `<div>
    <span class="toggle-btn" style="cursor:pointer;font-weight:bold;">${node.name}</span>
    ${childrenHTML}
  </div>`;
};


const exportAsHTML = () => {
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>McGinty Tree</title>
  <style>
    .toggle-btn { cursor: pointer; font-weight: bold; }
    .children { margin-left: 1em; display: block; }
  </style>
</head>
<body>
  ${generateHTML(treeData)}
  <script>
    document.querySelectorAll('.toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const next = btn.nextElementSibling;
        if (next && next.classList.contains('children')) {
          next.style.display = next.style.display === 'none' ? 'block' : 'none';
        }
      });
    });
  </script>
</body>
</html>`;
  handleDownload(html, "mcginty_tree.html", "text/html");
};


  const exportAsJSON = () => {
    handleDownload(JSON.stringify(treeData, null, 2), "mcginty_tree.json");
  };

  const exportAsSVG = () => {
    const svgElement = svgRef.current;
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mcginty_tree.svg";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="App">
      <h1>McGinty Family Tree Editor</h1>
      <div className="button-bar">
        <UploadButton onFileLoaded={handleFileUpload} />
        <DownloadButton onClick={exportAsJSON} label="Download JSON" />
        <DownloadButton onClick={exportAsHTML} label="Download HTML" />
        <DownloadButton onClick={exportAsSVG} label="Download SVG" />
        {focusedNode && (
          <button onClick={() => setFocusedNode(null)}>Unfocus</button>
        )}
      </div>
      <div className="editor-container">
        <TreeEditor text={text} onTextChange={handleTextChange} />
        <TreeView
          data={treeData}
          focusedNode={focusedNode}
          onFocus={setFocusedNode}
        />
      </div>
      <GraphView data={treeData} focusedNode={focusedNode} svgRef={svgRef} />
    </div>
  );
}

export default App;