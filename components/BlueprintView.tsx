
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
    <div className="w-full max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
        <div className="text-center md:text-left space-y-2">
          <button onClick={onBack} className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1.5 transition-colors mb-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
            NEW CONCEPT
          </button>
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-white">{blueprint.title}</h2>
          <p className="text-zinc-500 text-sm font-medium tracking-wide">DIRECTOR'S BLUEPRINT • V1</p>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={handleListen}
            disabled={isSynthesizing}
            className="h-11 px-6 rounded-full bg-[#1e1f20] hover:bg-[#2a2b2d] border border-white/5 text-xs font-semibold flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {isSynthesizing ? 'PLAYING...' : 'HEAR AUDIO'}
          </button>
          <button className="h-11 px-8 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-500/20">
            EXPORT FILE
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-12">
          {/* Narrative Section */}
          <section className="bg-[#1e1f20] rounded-[32px] p-10 border border-white/5 shadow-2xl">
            <div className="space-y-10">
              <div className="space-y-4">
                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em]">The Opening Hook</span>
                <p className="text-3xl italic font-medium leading-tight text-white">"{blueprint.hook}"</p>
              </div>
              
              <div className="h-px bg-white/5 w-full" />

              <div className="space-y-4">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Script Transcript</span>
                <div className="text-xl leading-relaxed font-serif text-zinc-300 whitespace-pre-wrap">
                  {blueprint.mainScript}
                </div>
              </div>
            </div>
          </section>

          {/* Visual Sequence */}
          <section className="space-y-6">
            <h3 className="text-lg font-semibold tracking-tight px-2">Visual Sequence Breakdown</h3>
            <div className="space-y-4">
              {blueprint.visualBreakdown.map((scene, i) => (
                <div key={i} className="group bg-[#1e1f20] border border-white/5 rounded-3xl overflow-hidden hover:bg-[#252628] transition-all p-8">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-20 flex flex-col items-center justify-center shrink-0">
                      <span className="text-blue-500 font-bold text-xl tracking-tighter">{scene.time}</span>
                      <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">Mark</span>
                    </div>
                    
                    <div className="flex-1 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.15em]">Visual Metaphor</p>
                          <p className="text-[#e3e3e3] text-base leading-relaxed">{scene.visual}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.15em]">Tech Spec</p>
                          <p className="text-amber-500 font-semibold text-sm uppercase">{scene.camera}</p>
                        </div>
                      </div>
                      <div className="bg-black/20 p-5 rounded-2xl italic text-sm text-zinc-400 border border-white/5">
                        "{scene.script}"
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Workbench */}
        <div className="lg:col-span-4 space-y-8">
          <section className="bg-[#1e1f20] rounded-[32px] p-8 border border-white/5 space-y-8">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-blue-500">Workbench</h3>
            
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Atmosphere Intent</p>
                  <p className="text-sm text-zinc-300 font-serif italic">{blueprint.moodAndColor.vibe}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Directional Lighting</p>
                  <p className="text-sm text-zinc-400">{blueprint.moodAndColor.lighting}</p>
                </div>
                
                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Palette Map</p>
                  <div className="flex gap-2">
                    {blueprint.moodAndColor.palette.map((color, idx) => (
                      <div 
                        key={idx} 
                        className="flex-1 h-10 rounded-xl border border-white/5" 
                        style={{ backgroundColor: color.toLowerCase().includes('#') ? color : color.toLowerCase() }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={handleGenerateMood}
                  disabled={isGeneratingImg}
                  className="w-full h-12 rounded-full bg-white text-black text-xs font-bold uppercase tracking-widest transition-all hover:bg-zinc-200 disabled:opacity-50"
                >
                  {isGeneratingImg ? 'RENDERING...' : 'SIMULATE STILL'}
                </button>

                {moodImageUrl && (
                  <div className="rounded-3xl overflow-hidden border border-white/5 aspect-video shadow-2xl bg-black animate-in zoom-in duration-500">
                    <img src={moodImageUrl} alt="Director Still" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="bg-[#1e1f20] rounded-[32px] p-8 border border-white/5 space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">Motion Synthesis</h3>
            <div className="space-y-4">
              <button 
                onClick={handleGenerateVideoSample}
                disabled={isGeneratingVid}
                className="w-full h-12 rounded-full bg-[#2a2b2d] border border-white/10 text-white text-xs font-bold uppercase tracking-widest hover:bg-[#323336] transition-all disabled:opacity-50"
              >
                {isGeneratingVid ? 'SYNTHESIZING...' : 'START SIMULATION'}
              </button>

              {videoUrl && (
                <div className="rounded-3xl overflow-hidden border border-white/5 aspect-video bg-black shadow-2xl animate-in zoom-in duration-500">
                  <video src={videoUrl} controls className="w-full h-full object-contain" />
                </div>
              )}
            </div>
          </section>

          <div className="px-4 space-y-4 opacity-60">
             <div className="space-y-1">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Rhythmic Pacing</p>
                <div className="flex flex-wrap gap-1.5">
                  {blueprint.transitions.map((t, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-white/5 rounded-full text-[9px] font-semibold text-zinc-400">{t}</span>
                  ))}
                </div>
             </div>
             <div className="space-y-1">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Sound Texture</p>
                <p className="text-xs text-zinc-400 font-serif italic leading-relaxed">{blueprint.musicDirection}</p>
             </div>
          </div>

          <section className="bg-rose-500/5 rounded-[32px] p-8 border border-rose-500/10 space-y-4 text-center">
            <p className="text-[10px] font-bold text-rose-500 uppercase tracking-[0.2em]">Final Beat</p>
            <p className="text-2xl font-medium text-white italic">"{blueprint.endingCTA}"</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default BlueprintView;
