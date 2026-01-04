
import React from 'react';

interface Props {
  onClose: () => void;
}

const ApiKeyModal: React.FC<Props> = ({ onClose }) => {
  const handleSelect = async () => {
    if (typeof window.aistudio !== 'undefined') {
      await window.aistudio.openSelectKey();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white">Professional Access</h3>
          <p className="text-zinc-400">
            To use advanced features like <strong>Veo Video Generation</strong> and <strong>High-Resolution Images</strong>, you must select a paid API key from your Google Cloud project.
          </p>
          <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-2xl text-xs text-amber-200 text-left">
            <p className="font-bold mb-1">Requirements:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>API Key from a paid GCP project</li>
              <li>Billing enabled for Gemini API</li>
            </ul>
          </div>
          <div className="pt-6 space-y-3">
            <button 
              onClick={handleSelect}
              className="w-full py-4 rounded-2xl bg-white text-black font-bold hover:bg-zinc-200 transition-all shadow-lg"
            >
              Select Paid API Key
            </button>
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block text-sm text-zinc-500 hover:text-white transition-colors"
            >
              Read Billing Documentation
            </a>
            <button 
              onClick={onClose}
              className="w-full py-3 text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;
