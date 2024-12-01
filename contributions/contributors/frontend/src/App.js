/**
 * frontend/src/App.js
 * Main React component for the Notfall frontend application.
 */

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import OnboardingDashboard from "./pages/OnboardingDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import TaskDetails from "./pages/TaskDetails";
import ContributorDashboard from "./pages/ContributorDashboard";
import AnalyticsPage from "./pages/AnalyticsPage";
import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<OnboardingDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/tasks/:taskId" element={<TaskDetails />} />
        <Route path="/contributors" element={<ContributorDashboard />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
