
import { GoogleGenAI, Type, Modality, GenerateContentResponse } from "@google/genai";
import { UserInput, VideoBlueprint } from "../types";

// Helper to get GoogleGenAI instance
export const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
};

/**
 * Generates a cinematic video blueprint using Gemini 3 Pro with thinking mode.
 */
export async function generateBlueprint(input: UserInput): Promise<VideoBlueprint> {
  const ai = getAIClient();
  const prompt = `
    Generate a complete cinematic video blueprint for the following topic:
    Topic: ${input.topic}
    Language: ${input.language}
    Platform: ${input.platform}
    Duration: ${input.duration}
    Tone: ${input.tone}

    The script should be natural, human-like, and emotionally resonant. 
    Provide a detailed shot-by-shot visual breakdown.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      thinkingConfig: { thinkingBudget: 32768 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          hook: { type: Type.STRING },
          mainScript: { type: Type.STRING },
          visualBreakdown: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                time: { type: Type.STRING },
                visual: { type: Type.STRING },
                script: { type: Type.STRING },
                camera: { type: Type.STRING }
              },
              required: ["time", "visual", "script", "camera"]
            }
          },
          cameraGuidelines: { type: Type.STRING },
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
          endingCTA: { type: Type.STRING }
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
export async function generateMoodImage(prompt: string, aspectRatio: string = "16:9", size: "1K" | "2K" | "4K" = "1K"): Promise<string> {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [{ text: `Cinematic high-quality visual representation of: ${prompt}. Cinematic lighting, 8k resolution, professional photography.` }]
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
  const ai = getAIClient();
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: `Cinematic video: ${prompt}. High quality, cinematic camera movement.`,
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
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

/**
 * Text-to-speech for the generated script parts.
 */
export async function synthesizeSpeech(text: string): Promise<void> {
  const ai = getAIClient();
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
