import React from "react";
import PropTypes from "prop-types";
import "./analytics.css";

const AnalyticsLegend = ({ data }) => {
  return (
    <div className="analytics-legend">
      <h2>Legend</h2>
      <ul>
        {data.map((entry, index) => (
          <li key={index}>
            <span
              className="legend-color"
              style={{ backgroundColor: entry.color || "#8884d8" }}
            ></span>
            {entry.name}: {entry.value}
          </li>
        ))}
      </ul>
    </div>
  );
};

AnalyticsLegend.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      color: PropTypes.string,
    })
  ).isRequired,
};

export default AnalyticsLegend;
