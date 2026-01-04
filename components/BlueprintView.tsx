
import React, { useState } from 'react';
import { VideoBlueprint } from '../types';
import { synthesizeSpeech, generateMoodImage, generateVideoClip } from '../services/geminiService';

interface Props {
  blueprint: VideoBlueprint;
  onBack: () => void;
}

const BlueprintView: React.FC<Props> = ({ blueprint, onBack }) => {
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [moodImageUrl, setMoodImageUrl] = useState<string | null>(null);
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isGeneratingVid, setIsGeneratingVid] = useState(false);

  const handleListen = async () => {
    setIsSynthesizing(true);
    try {
      await synthesizeSpeech(blueprint.mainScript);
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleGenerateMood = async () => {
    setIsGeneratingImg(true);
    try {
      const url = await generateMoodImage(blueprint.moodAndColor.vibe);
      setMoodImageUrl(url);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingImg(false);
    }
  };

  const handleGenerateVideoSample = async () => {
    setIsGeneratingVid(true);
    try {
      const url = await generateVideoClip(blueprint.visualBreakdown[0].visual);
      setVideoUrl(url);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingVid(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
        <div className="space-y-2">
          <button onClick={onBack} className="text-sm text-zinc-500 hover:text-white flex items-center gap-2 mb-4 group transition-colors">
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Editor
          </button>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white">{blueprint.title}</h2>
          <p className="text-zinc-500 uppercase tracking-[0.3em] text-[10px] font-bold">Production Blueprint • V1.0</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleListen}
            disabled={isSynthesizing}
            className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <svg className="w-5 h-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M12 18.75V5.25L5.25 10H3a.75.75 0 00-.75.75v2.5c0 .414.336.75.75.75h2.25L12 18.75z" />
            </svg>
            {isSynthesizing ? 'Synthesizing...' : 'Listen to Script'}
          </button>
          <button className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center gap-2 transition-all shadow-lg shadow-rose-900/20">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Shotlist
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Script & Mood */}
        <div className="lg:col-span-2 space-y-10">
          <section className="bg-zinc-900/50 rounded-3xl p-8 border border-white/5">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-rose-500">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              The Hook & Narrative
            </h3>
            <div className="space-y-6">
              <div className="bg-rose-500/10 border-l-4 border-rose-500 p-4 rounded-r-xl">
                <p className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-1">Hook (First 3s)</p>
                <p className="text-lg italic text-zinc-200">"{blueprint.hook}"</p>
              </div>
              <div className="space-y-4">
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Main Script</p>
                <div className="text-xl leading-relaxed font-serif text-zinc-300 whitespace-pre-wrap">
                  {blueprint.mainScript}
                </div>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Visual Breakdown
            </h3>
            <div className="space-y-4">
              {blueprint.visualBreakdown.map((scene, i) => (
                <div key={i} className="group bg-zinc-900/30 border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-all">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-32 bg-zinc-800/50 p-4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/5">
                      <span className="text-rose-500 font-bold text-lg">{scene.time}</span>
                      <span className="text-[10px] text-zinc-500 font-bold uppercase">Timeline</span>
                    </div>
                    <div className="p-6 flex-1 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Visual Direction</p>
                          <p className="text-zinc-200">{scene.visual}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Shot Type</p>
                          <p className="text-amber-500 font-medium text-sm">{scene.camera}</p>
                        </div>
                      </div>
                      <div className="bg-black/20 p-3 rounded-xl border border-white/5 italic text-sm text-zinc-400">
                        {scene.script}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Direction & AI Visuals */}
        <div className="space-y-8">
          <section className="bg-zinc-900/50 rounded-3xl p-6 border border-white/5 space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              Mood Board
            </h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-black/40 rounded-2xl border border-white/5 space-y-3">
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Theme & Vibe</p>
                <p className="text-sm text-zinc-300">{blueprint.moodAndColor.vibe}</p>
                
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest pt-2">Color Palette</p>
                <div className="flex gap-2">
                  {blueprint.moodAndColor.palette.map((color, idx) => (
                    <div 
                      key={idx} 
                      className="w-full h-8 rounded-md border border-white/10" 
                      style={{ backgroundColor: color.toLowerCase() }}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={handleGenerateMood}
                  disabled={isGeneratingImg}
                  className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isGeneratingImg ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : 'Generate AI Mood Image'}
                </button>

                {moodImageUrl && (
                  <div className="rounded-2xl overflow-hidden border border-white/10 aspect-video group relative">
                    <img src={moodImageUrl} alt="AI Mood Board" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="bg-zinc-900/50 rounded-3xl p-6 border border-white/5 space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              AI Video Preview
            </h3>
            <p className="text-xs text-zinc-500">Generate a 720p cinematic clip using Veo 3.1 based on Scene 1.</p>
            
            <div className="space-y-4">
              <button 
                onClick={handleGenerateVideoSample}
                disabled={isGeneratingVid}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-rose-600/20 to-amber-600/20 border border-rose-500/30 text-xs font-bold uppercase tracking-widest hover:from-rose-600/30 hover:to-amber-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isGeneratingVid ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Directing Scene 1...
                  </>
                ) : 'Generate Veo Preview'}
              </button>

              {videoUrl && (
                <div className="rounded-2xl overflow-hidden border border-white/10 aspect-video bg-black">
                  <video src={videoUrl} controls className="w-full h-full object-contain" />
                </div>
              )}
            </div>
          </section>

          <section className="bg-zinc-900/50 rounded-3xl p-6 border border-white/5 space-y-4">
            <h3 className="text-lg font-bold">Sound Design</h3>
            <p className="text-sm text-zinc-400">{blueprint.musicDirection}</p>
          </section>

          <section className="bg-rose-600/10 rounded-3xl p-6 border border-rose-500/20 space-y-2">
            <p className="text-xs font-bold text-rose-500 uppercase tracking-widest">Ending CTA</p>
            <p className="text-lg font-bold text-white italic">"{blueprint.endingCTA}"</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default BlueprintView;
