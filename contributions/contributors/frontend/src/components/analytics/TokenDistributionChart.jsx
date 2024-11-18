import React, { useState, useEffect } from "react";
import { fetchTokenDistribution } from "../../services/analyticsService";
import Breadcrumbs from "../common/Breadcrumbs";
import Loader from "../common/Loader";
import ErrorMessage from "../common/ErrorMessage";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "./analytics.css";

const TokenDistributionChart = () => {
  // State variables
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Breadcrumb paths
  const breadcrumbPaths = [
    { label: "Home", to: "/" },
    { label: "Analytics", to: "/analytics" },
    { label: "Token Distribution Chart", to: "" },
  ];

  // Colors for chart slices
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A020F0"];

  // Fetch token distribution data on mount
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetchTokenDistribution();
        setData(response);
      } catch (err) {
        setError("Failed to load token distribution data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  return (
    <div className="token-distribution-chart">
      <Breadcrumbs paths={breadcrumbPaths} />
      <h1>Token Distribution Chart</h1>

      {/* Conditional Rendering: Loading, Error, or Chart */}
      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={150}
                fill="#8884d8"
                label
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default TokenDistributionChart;
