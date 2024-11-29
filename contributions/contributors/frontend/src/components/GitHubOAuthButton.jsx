import React from "react";

const GitHubOAuthButton = ({ onClick }) => {
  return (
    <button
      className="bg-black text-white px-4 py-2 rounded shadow hover:bg-gray-800"
      onClick={onClick}
    >
      Connect with GitHub
    </button>
  );
};

export default GitHubOAuthButton;
