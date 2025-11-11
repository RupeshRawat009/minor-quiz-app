import React from "react";

const DifficultySelector = ({ onSelect }) => {
  const levels = ["Easy", "Medium", "Hard"];

  return (
    <div className="difficulty-container">
      <h2>Select Difficulty Level</h2>
      <ul>
        {levels.map((level) => (
          <li key={level} onClick={() => onSelect(level)}>
            {level}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DifficultySelector;
