// src/components/common/Breadcrumbs.jsx
import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import "./Breadcrumbs.css";

const Breadcrumbs = ({ paths }) => {
  return (
    <nav className="breadcrumbs" aria-label="breadcrumb">
      <ol>
        {paths.map((path, index) => (
          <li key={index} className={index === paths.length - 1 ? "active" : ""}>
            {index === paths.length - 1 ? (
              path.label
            ) : (
              <Link to={path.to}>{path.label}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

Breadcrumbs.propTypes = {
  paths: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      to: PropTypes.string,
    })
  ).isRequired,
};

export default Breadcrumbs;
