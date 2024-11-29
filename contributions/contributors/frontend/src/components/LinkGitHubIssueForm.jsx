import React, { useState } from "react";

const LinkGitHubIssueForm = ({ taskId, onSubmit }) => {
  const [issueNumber, setIssueNumber] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ issueNumber });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-100 rounded">
      <label className="block text-gray-700 font-bold mb-2">
        GitHub Issue Number:
        <input
          type="text"
          value={issueNumber}
          onChange={(e) => setIssueNumber(e.target.value)}
          className="border p-2 w-full rounded mt-2"
          required
        />
      </label>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
        Link Issue
      </button>
    </form>
  );
};

export default LinkGitHubIssueForm;
