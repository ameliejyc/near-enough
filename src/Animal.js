import React from "react";
import "./global.css";

export const Animal = ({ animal, imageUrl }) => {
  if (!imageUrl) return null;
  return (
    <div className="animal-container">
      <img src={imageUrl} alt={animal} height="100%" />
    </div>
  );
};
