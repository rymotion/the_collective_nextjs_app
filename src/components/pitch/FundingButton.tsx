'use client';

import { useState } from 'react';
import ComingSoonToast from '../shared/ComingSoonToast';

interface FundingButtonProps {
  projectId: string;
  projectTitle: string;
}

export default function FundingButton({ projectId, projectTitle }: FundingButtonProps) {
  const [showToast, setShowToast] = useState(false);

  const handleContribute = () => {
    setShowToast(true);
  };

  return (
    <>
      <button onClick={handleContribute} className="btn btn-primary w-full">
        💰 Contribute to This Project
      </button>

      {showToast && (
        <ComingSoonToast
          message="Funding contributions are coming soon! Sign up to be notified when we launch."
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
}
