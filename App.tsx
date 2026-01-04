
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

  // Check for Veo key on mount
  useEffect(() => {
    const checkKey = async () => {
      if (typeof window.aistudio !== 'undefined') {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) {
          setShowKeyModal(true);
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
      console.error(err);
      if (err.message?.includes("Requested entity was not found")) {
        setShowKeyModal(true);
      }
      setError("Failed to generate script. Please check your AI studio billing or try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const reset = () => {
    setBlueprint(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-zinc-100 selection:bg-rose-500 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={reset}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-900/20">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">CineScript <span className="text-rose-500">AI</span></h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-medium">Visionary Creative Assistant</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Workspace</a>
          <a href="#" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Library</a>
          <a href="#" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Assets</a>
        </nav>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowKeyModal(true)}
            className="text-xs px-3 py-1.5 rounded-full border border-white/10 hover:bg-white/5 transition-colors"
          >
            Config API
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-6 md:p-10">
        {!blueprint ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-center mb-12 space-y-4">
              <h2 className="text-4xl md:text-6xl font-serif italic text-white">Think Visually.</h2>
              <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                Turn your raw ideas into ready-to-shoot cinematic blueprints. 
                Scriptwriting, visual breakdown, and technical direction in one click.
              </p>
            </div>
            
            <div className="w-full max-w-2xl bg-zinc-900/40 border border-white/5 rounded-3xl p-8 shadow-2xl backdrop-blur-sm">
              <CreatorForm onGenerate={handleGenerate} isGenerating={isGenerating} />
              {error && (
                <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm rounded-lg flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}
            </div>
          </div>
        ) : (
          <BlueprintView blueprint={blueprint} onBack={reset} />
        )}
      </main>

      {/* Floating Live Assistant Button */}
      {!isGenerating && <LiveAssistant />}

      {showKeyModal && <ApiKeyModal onClose={() => setShowKeyModal(false)} />}
      
      <footer className="w-full py-8 border-t border-white/5 px-6 text-center">
        <p className="text-zinc-600 text-sm">Powered by Gemini 3.0 & Veo 3.1 • Professional Cinema Planning</p>
      </footer>
    </div>
  );
};

export default App;
