
import React, { useState } from 'react';
import { UserInput, Language, Platform, Tone } from '../types';

interface Props {
  onGenerate: (input: UserInput) => void;
  isGenerating: boolean;
}

const CreatorForm: React.FC<Props> = ({ onGenerate, isGenerating }) => {
  const [input, setInput] = useState<UserInput>({
    topic: '',
    language: Language.ENGLISH,
    platform: Platform.REEL,
    duration: '60s',
    tone: Tone.CINEMATIC
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.topic.trim()) return;
    onGenerate(input);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Video Topic or Concept</label>
        <textarea
          required
          placeholder="e.g. A reflection on solitude in a crowded city..."
          className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all min-h-[120px] resize-none"
          value={input.topic}
          onChange={(e) => setInput({ ...input, topic: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Language</label>
          <select
            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50"
            value={input.language}
            onChange={(e) => setInput({ ...input, language: e.target.value as Language })}
          >
            {Object.values(Language).map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Platform</label>
          <select
            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50"
            value={input.platform}
            onChange={(e) => setInput({ ...input, platform: e.target.value as Platform })}
          >
            {Object.values(Platform).map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Tone / Vibe</label>
          <select
            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50"
            value={input.tone}
            onChange={(e) => setInput({ ...input, tone: e.target.value as Tone })}
          >
            {Object.values(Tone).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Approx. Duration</label>
          <input
            type="text"
            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50"
            value={input.duration}
            onChange={(e) => setInput({ ...input, duration: e.target.value })}
            placeholder="e.g. 15s, 60s, 5m"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isGenerating}
        className="w-full bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-rose-900/20 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 mt-8"
      >
        {isGenerating ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Visualizing Script...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Generate Blueprint
          </>
        )}
      </button>
    </form>
  );
};

export default CreatorForm;
