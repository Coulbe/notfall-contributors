import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { fetchContributionTrends } from "../../services/analyticsService";
import Breadcrumbs from "../common/Breadcrumbs";
import Loader from "../common/Loader";
import ErrorMessage from "../common/ErrorMessage";
import "./analytics.css";

const ContributionTrendsChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const breadcrumbPaths = [
    { label: "Home", to: "/" },
    { label: "Analytics", to: "/analytics" },
    { label: "Contribution Trends", to: "" },
  ];

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetchContributionTrends();
        setData(response);
      } catch (err) {
        setError("Failed to load contribution trends data.");
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  return (
    <div className="analytics-chart">
      <Breadcrumbs paths={breadcrumbPaths} />
      <h1>Contribution Trends</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="contributions" stroke="#8884d8" />
              <Line type="monotone" dataKey="reviews" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default ContributionTrendsChart;
