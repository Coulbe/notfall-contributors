import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { fetchTokenDistribution } from "../../services/analyticsService";
import Breadcrumbs from "../common/Breadcrumbs";
import Loader from "../common/Loader";
import ErrorMessage from "../common/ErrorMessage";
import AnalyticsLegend from "./AnalyticsLegend";
import "./analytics.css";

const TokenDistributionChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A020F0"];

  const breadcrumbPaths = [
    { label: "Home", to: "/" },
    { label: "Analytics", to: "/analytics" },
    { label: "Token Distribution Chart", to: "" },
  ];

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetchTokenDistribution();
        setData(response);
      } catch (err) {
        setError("Failed to load token distribution data.");
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  return (
    <div className="analytics-chart">
      <Breadcrumbs paths={breadcrumbPaths} />
      <h1>Token Distribution Chart</h1>
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
          <AnalyticsLegend data={data} />
        </div>
      )}
    </div>
  );
};

export default TokenDistributionChart;
