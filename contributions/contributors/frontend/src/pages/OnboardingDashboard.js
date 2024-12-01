import React from 'react';
import TutorialModal from '../components/modals/TutorialModal';
import ActivityHeatmap from '../components/analytics/ActivityHeatmap';

const OnboardingDashboard = () => {
  const [isTutorialOpen, setTutorialOpen] = React.useState(true);

  const handleTutorialClose = () => setTutorialOpen(false);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome to Notfall Engineers!</h1>
      <p className="mb-6">
        Let’s get you started with a guided walkthrough of our platform.
      </p>

      <ActivityHeatmap />

      <button
        onClick={() => setTutorialOpen(true)}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Open Tutorial
      </button>

      {isTutorialOpen && <TutorialModal onClose={handleTutorialClose} />}
    </div>
  );
};

export default OnboardingDashboard;
