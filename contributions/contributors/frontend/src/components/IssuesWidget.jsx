/**
 * components/IssuesWidget.jsx
 * Displays GitHub issues with options to add comments or update labels.
 */

import React, { useState, useEffect } from "react";
import { getOpenIssues, addCommentToIssue, updateIssueLabels } from "../services/githubIssueService";

const IssuesWidget = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const issuesList = await getOpenIssues();
        setIssues(issuesList);
      } catch (error) {
        console.error("Failed to fetch issues:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  const handleAddComment = async (issueNumber) => {
    const comment = prompt("Enter your comment:");
    if (!comment) return;

    try {
      await addCommentToIssue(issueNumber, comment);
      alert("Comment added successfully.");
    } catch (error) {
      alert("Failed to add comment.");
    }
  };

  const handleUpdateLabels = async (issueNumber) => {
    const labels = prompt("Enter labels, comma-separated:");
    if (!labels) return;

    try {
      await updateIssueLabels(issueNumber, labels.split(","));
      alert("Labels updated successfully.");
    } catch (error) {
      alert("Failed to update labels.");
    }
  };

  if (loading) return <p>Loading issues...</p>;

  return (
    <div>
      <h3>Open GitHub Issues</h3>
      <ul>
        {issues.map((issue) => (
          <li key={issue.id}>
            <a href={issue.html_url} target="_blank" rel="noopener noreferrer">
              {issue.title}
            </a>
            <button onClick={() => handleAddComment(issue.number)}>Add Comment</button>
            <button onClick={() => handleUpdateLabels(issue.number)}>Update Labels</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IssuesWidget;
