import React, { useState, useRef } from "react";
import "./ThreeWayToggle.css"; // External CSS (see below)

const OPTIONS = ["No", "In Progress", "Yes"];

export function ThreeWayToggle({ name = "status", initial = 0 }) {
  const [selected, setSelected] = useState(initial);
  const containerRef = useRef(null);

  const handleClick = (index) => {
    setSelected(index);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      setSelected((prev) => Math.max(0, prev - 1));
    } else if (e.key === "ArrowRight") {
      setSelected((prev) => Math.min(2, prev + 1));
    }
  };

  return (
    <div
      className="slider-container"
      data-value={selected}
      role="radiogroup"
      aria-label="Select status"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      ref={containerRef}
    >
      <div className="slider-background" aria-hidden="true" />
      {OPTIONS.map((option, index) => (
        <label
          key={option}
          className={`slider-option ${selected === index ? "active" : ""}`}
          role="radio"
          aria-checked={selected === index}
          tabIndex={-1}
          onClick={() => handleClick(index)}
        >
          {option}
          <input
            type="checkbox"
            name={`${name}_${option.replace(/\s+/g, "_").toLowerCase()}`}
            checked={selected === index}
            readOnly
            hidden
          />
        </label>
      ))}
    </div>
  );
}
