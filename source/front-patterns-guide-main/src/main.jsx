import React from "react";
import { createRoot } from "react-dom/client";
import FrontGuide from "./FrontGuide.jsx";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <FrontGuide />
  </React.StrictMode>
);
