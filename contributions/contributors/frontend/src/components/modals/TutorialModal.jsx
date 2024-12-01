import React from 'react';

const TutorialModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Getting Started Tutorial</h2>
        <p>
          Welcome to Notfall Engineers! Here’s how to navigate our platform:
          <ul className="list-disc ml-4 mt-2">
            <li>Explore your dashboard</li>
            <li>Find and manage tasks</li>
            <li>Earn rewards like Notcoins</li>
          </ul>
        </p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default TutorialModal;
