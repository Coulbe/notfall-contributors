/**
 * components/ContributorRequestForm.jsx
 * UI for contributors to submit their request.
 */

import React, { useState } from "react";
import axios from "axios";

const ContributorRequestForm = () => {
  const [formData, setFormData] = useState({
    githubUsername: "",
    reason: "",
    areaOfInterest: "",
    experienceLevel: "",
    location: "",
    skills: "",
    pastContributions: "",
    additionalDetails: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/contributor-requests", formData);
      alert("Your request has been submitted!");
    } catch (error) {
      console.error("Error submitting request:", error);
      alert("Failed to submit your request.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Contributor Request Form</h2>
      <input id="githubUsername" placeholder="GitHub Username" onChange={handleChange} required />
      <textarea id="reason" placeholder="Why do you want to contribute?" onChange={handleChange} required />
      <select id="areaOfInterest" onChange={handleChange} required>
        <option value="">Select Area of Interest</option>
        <option value="Backend Development">Backend Development</option>
        <option value="Frontend Development">Frontend Development</option>
        <option value="Documentation">Documentation</option>
        <option value="Testing">Testing</option>
        <option value="UI/UX Design">UI/UX Design</option>
        <option value="Blockchain Integration">Blockchain Integration</option>
        <option value="Other">Other</option>
      </select>
      <select id="experienceLevel" onChange={handleChange} required>
        <option value="">Select Experience Level</option>
        <option value="Beginner">Beginner</option>
        <option value="Intermediate">Intermediate</option>
        <option value="Advanced">Advanced</option>
        <option value="Expert">Expert</option>
      </select>
      <textarea id="skills" placeholder="List your skills" onChange={handleChange} required />
      <textarea id="pastContributions" placeholder="Your past contributions" onChange={handleChange} />
      <textarea id="additionalDetails" placeholder="Additional details" onChange={handleChange} />
      <button type="submit">Submit</button>
    </form>
  );
};

export default ContributorRequestForm;
