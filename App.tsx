
import React, { useState, useEffect } from 'react';
import { UserInput, VideoBlueprint, Language, Platform, Tone } from './types';
import { generateBlueprint } from './services/geminiService';
import CreatorForm from './components/CreatorForm';
import BlueprintView from './components/BlueprintView';
import ApiKeyModal from './components/ApiKeyModal';
import LiveAssistant from './components/LiveAssistant';

const App: React.FC = () => {
  const [blueprint, setBlueprint] = useState<VideoBlueprint | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkKey = async () => {
      if (typeof window.aistudio !== 'undefined') {
        try {
          const hasKey = await window.aistudio.hasSelectedApiKey();
          if (!hasKey) setShowKeyModal(true);
        } catch (e) {
          console.error("Key selection check failed", e);
        }
      }
    };
    checkKey();
  }, []);

  const handleGenerate = async (input: UserInput) => {
    setIsGenerating(true);
    setError(null);
    try {
      const result = await generateBlueprint(input);
      setBlueprint(result);
    } catch (err: any) {
      console.error("Blueprint generation error:", err);
      const errorMessage = err?.message || String(err);
      if (errorMessage.includes("Requested entity was not found") || errorMessage.includes("404")) {
        setShowKeyModal(true);
        setError("AI model not found. Project requires a paid API key and billing.");
      } else {
        setError("Failed to generate script. Please check your configuration.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const reset = () => {
    setBlueprint(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#131314] text-[#e3e3e3] selection:bg-blue-500/30">
      {/* Navbar */}
      <header className="fixed top-0 z-50 w-full px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={reset}>
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center transition-all group-hover:bg-white/10 border border-white/10">
            <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
            </svg>
          </div>
          <span className="font-semibold text-lg tracking-tight">CineScript</span>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => window.aistudio.openSelectKey()}
            className="text-[11px] font-medium px-4 py-2 rounded-full border border-white/10 hover:bg-white/5 transition-all text-zinc-400 hover:text-white"
          >
            Settings
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center pt-24 pb-12 px-4 max-w-5xl mx-auto w-full">
        {!blueprint ? (
          <div className="w-full flex flex-col items-center justify-center min-h-[70vh] animate-in fade-in duration-1000">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-medium mb-4 tracking-tight">
                Hello, <span className="gemini-gradient font-semibold">Director</span>
              </h2>
              <p className="text-zinc-400 text-lg">
                What story are we telling today?
              </p>
            </div>
            
            <div className="w-full max-w-2xl">
              <CreatorForm onGenerate={handleGenerate} isGenerating={isGenerating} />
              
              {error && (
                <div className="mt-8 p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10 text-rose-400 text-sm flex items-start gap-3 animate-in slide-in-from-top-2">
                  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-semibold mb-1">Configuration Needed</p>
                    <p className="opacity-80">{error}</p>
                    <button onClick={() => window.aistudio.openSelectKey()} className="mt-2 text-blue-400 hover:underline font-medium">Configure Key</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <BlueprintView blueprint={blueprint} onBack={reset} />
        )}
      </main>

      <LiveAssistant />
      {showKeyModal && <ApiKeyModal onClose={() => setShowKeyModal(false)} />}
    </div>
  );
};

export default App;
