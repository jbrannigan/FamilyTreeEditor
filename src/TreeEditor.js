import React from "react";

function TreeEditor({ text, onTextChange }) {
  const handleChange = (e) => {
    onTextChange(e.target.value);
  };

  return (
    <div className="tree-editor">
      <h2>Tree Text Editor</h2>
      <textarea value={text} onChange={handleChange} />
    </div>
  );
}

export default TreeEditor;