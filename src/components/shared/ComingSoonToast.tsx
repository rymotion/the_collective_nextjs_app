'use client';

import { useEffect } from 'react';

interface ComingSoonToastProps {
  message: string;
  onClose: () => void;
}

export default function ComingSoonToast({ message, onClose }: ComingSoonToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-4 right-4 max-w-sm bg-surface border border-white/10 rounded-lg shadow-xl p-4 z-50 animate-slide-up">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
          <span className="text-lg">🚀</span>
        </div>
        <div className="flex-1">
          <h4 className="font-semibold mb-1">Coming Soon!</h4>
          <p className="text-sm text-muted">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-muted hover:text-foreground transition-colors"
          aria-label="Close"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
