import React from "react";

function DownloadButton({ onClick, label }) {
  return <button onClick={onClick}>{label}</button>;
}

export default DownloadButton;