
import { GoogleGenAI, Type, Modality, GenerateContentResponse } from "@google/genai";
import { UserInput, VideoBlueprint } from "../types";

// Helper to get GoogleGenAI instance
export const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
};

/**
 * Generates a cinematic video blueprint using Gemini 3 Flash with thinking mode.
 * Switched from Pro to Flash for broader initial availability while maintaining quality.
 */
export async function generateBlueprint(input: UserInput): Promise<VideoBlueprint> {
  const ai = getAIClient();
  
  const systemInstruction = `
    You are a cinematic scriptwriter and visual director AI. 
    Your job is to think visually, emotionally, and cinematically.

    CORE BEHAVIOR RULES:
    - Think like a director + storyteller, not a motivational speaker.
    - Avoid cliches, generic motivation, and overused Instagram lines.
    - Prefer raw, honest, slightly uncomfortable truths.
    - Endings should feel open-ended, unresolved, or thought-provoking.
    - Hooks must be abrupt, confrontational, or cut mid-thought. Start in the middle of a sentence or a breath.
    - Limit metaphors to 2–3 per script maximum. Do not over-saturate.
    - Structure: Include one deceptive calm moment before a sudden escalation or shift.
    - Never fully explain a metaphor—stop early and let the visual do the work.
    - Trust silence and negative space over dialogue. Use fewer words than you think you need.
    - Do not include tool UI elements, platform labels (e.g., "Like and Subscribe", "Reel UI"), or generic CTAs.
    - Never explain symbolism or irony explicitly. The viewer (and the director) should feel it, not be told it.
    - Ending visuals must contradict the final line to create cinematic irony.

    LANGUAGE RULES:
    - Support Hindi, English, and Hinglish.
    - Hinglish must feel spoken and imperfect: short fragments, pauses, incomplete thoughts.
    - No polished essay-style language. Sound like someone thinking aloud at 3 AM.

    STRICT FORMATTING:
    - Maintain strict section separation with clear labels.
  `;

  const prompt = `
    Generate a complete cinematic video blueprint for:
    Topic: ${input.topic}
    Language: ${input.language}
    Platform: ${input.platform}
    Duration: ${input.duration}
    Tone: ${input.tone}

    Requirement Checklist:
    1. Abrupt/Cut mid-thought Hook.
    2. One deceptive calm moment before escalation.
    3. Exactly 2-3 metaphors max.
    4. No explicit explanation of symbolism or irony.
    5. Ending visual contradicts the final line.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview", // Switched from Pro to Flash for broader compatibility
    contents: prompt,
    config: {
      systemInstruction,
      thinkingConfig: { thinkingBudget: 24576 }, // Adjusted budget for Flash model
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          hook: { type: Type.STRING, description: "Abrupt or cut mid-thought opening." },
          mainScript: { type: Type.STRING, description: "Minimalist monologue or VO script." },
          visualBreakdown: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                time: { type: Type.STRING },
                visual: { type: Type.STRING },
                script: { type: Type.STRING },
                camera: { type: Type.STRING, description: "Shot type/movement." }
              },
              required: ["time", "visual", "script", "camera"]
            }
          },
          cameraGuidelines: { type: Type.STRING, description: "Camera philosophy focusing on negative space." },
          moodAndColor: {
            type: Type.OBJECT,
            properties: {
              vibe: { type: Type.STRING },
              lighting: { type: Type.STRING },
              palette: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["vibe", "lighting", "palette"]
          },
          transitions: { type: Type.ARRAY, items: { type: Type.STRING } },
          musicDirection: { type: Type.STRING },
          endingCTA: { type: Type.STRING, description: "Final beat. Unresolved/contradictory." }
        },
        required: ["title", "hook", "mainScript", "visualBreakdown", "cameraGuidelines", "moodAndColor", "transitions", "musicDirection", "endingCTA"]
      }
    }
  });

  return JSON.parse(response.text);
}

/**
 * Generates a high-quality image for the mood board using Gemini 3 Pro Image.
 */
export async function generateMoodImage(prompt: string, aspectRatio: string = "1:1", size: "1K" | "2K" | "4K" = "1K"): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' }); // Always new instance right before call
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [{ text: `Cinematic high-quality visual representation of: ${prompt}. Raw atmosphere, professional photography, intentional negative space.` }]
    },
    config: {
      imageConfig: {
        aspectRatio: aspectRatio as any,
        imageSize: size
      }
    }
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No image generated");
}

/**
 * Generates a cinematic video clip using Veo 3.1.
 */
export async function generateVideoClip(prompt: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' }); // Always new instance right before call
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: `Cinematic footage: ${prompt}. High quality, subtle movement, heavy on negative space.`,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '16:9'
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  const res = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  if (!res.ok) throw new Error("Video download failed");
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

/**
 * Text-to-speech for the generated script parts.
 */
export async function synthesizeSpeech(text: string): Promise<void> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' }); // Always new instance right before call
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) return;

  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  const bytes = decodeBase64(base64Audio);
  const audioBuffer = await decodeAudioData(bytes, audioContext, 24000, 1);
  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioContext.destination);
  source.start();
}

// Low-level audio utilities
function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}
