
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
    <div className="w-full space-y-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative group">
          <textarea
            required
            placeholder="Type your concept here... (e.g. A noir film about a detective who only talks to ghosts)"
            className="w-full bg-[#1e1f20] border-none rounded-[28px] p-6 pt-7 text-[#e3e3e3] text-lg focus:outline-none focus:ring-1 focus:ring-white/10 transition-all min-h-[160px] resize-none placeholder:text-zinc-500 shadow-xl"
            value={input.topic}
            onChange={(e) => setInput({ ...input, topic: e.target.value })}
          />
          <div className="absolute bottom-4 right-4 flex items-center gap-2">
            <button
              type="submit"
              disabled={isGenerating || !input.topic.trim()}
              className="w-12 h-12 rounded-full bg-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-20 disabled:grayscale disabled:scale-100 shadow-lg"
            >
              {isGenerating ? (
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                <svg className="w-6 h-6 text-black" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-700">
          <select
            className="appearance-none bg-[#1e1f20] hover:bg-[#2a2b2d] border border-white/5 rounded-full px-5 py-2.5 text-xs font-medium text-zinc-400 hover:text-white transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-white/10"
            value={input.language}
            onChange={(e) => setInput({ ...input, language: e.target.value as Language })}
          >
            {Object.values(Language).map(l => <option key={l} value={l}>{l}</option>)}
          </select>

          <select
            className="appearance-none bg-[#1e1f20] hover:bg-[#2a2b2d] border border-white/5 rounded-full px-5 py-2.5 text-xs font-medium text-zinc-400 hover:text-white transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-white/10"
            value={input.platform}
            onChange={(e) => setInput({ ...input, platform: e.target.value as Platform })}
          >
            {Object.values(Platform).map(p => <option key={p} value={p}>{p}</option>)}
          </select>

          <select
            className="appearance-none bg-[#1e1f20] hover:bg-[#2a2b2d] border border-white/5 rounded-full px-5 py-2.5 text-xs font-medium text-zinc-400 hover:text-white transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-white/10"
            value={input.tone}
            onChange={(e) => setInput({ ...input, tone: e.target.value as Tone })}
          >
            {Object.values(Tone).map(t => <option key={t} value={t}>{t}</option>)}
          </select>

          <div className="flex items-center bg-[#1e1f20] border border-white/5 rounded-full px-5 py-2 transition-all">
             <span className="text-[10px] font-bold text-zinc-600 mr-2 uppercase tracking-tighter">Dur:</span>
             <input
                type="text"
                className="bg-transparent text-xs font-medium text-zinc-400 focus:text-white focus:outline-none w-10 text-center"
                value={input.duration}
                onChange={(e) => setInput({ ...input, duration: e.target.value })}
             />
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatorForm;
