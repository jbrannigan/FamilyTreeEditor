import React from "react";

function UploadButton({ onFileLoaded }) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onFileLoaded(reader.result);
    };
    reader.readAsText(file);
  };

  return <input type="file" accept=".txt" onChange={handleFileChange} />;
}

export default UploadButton;