// High-fidelity Audio Recording & Processing Utility
// Supports real microphone audio capture, PCM to WAV encoding, live visualizer, and speech recognition

/**
 * Encodes Float32Array PCM samples into a standard 16-bit PCM WAV Blob.
 * Guaranteed to play across all desktop & mobile browsers (iOS Safari, Android Chrome, etc.).
 */
export function encodeWavBlob(channelData: Float32Array, sampleRate: number): Blob {
  const numChannels = 1;
  const bitsPerSample = 16;
  const bytesPerSample = bitsPerSample / 8;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = channelData.length * bytesPerSample;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  // Helper to write ASCII strings
  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  // RIFF header
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true); // Chunk size
  writeString(8, 'WAVE');

  // "fmt " subchunk
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true); // AudioFormat (1 = PCM)
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);

  // "data" subchunk
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);

  // Write 16-bit PCM samples with clipping protection
  let offset = 44;
  for (let i = 0; i < channelData.length; i++) {
    let s = channelData[i];
    s = Math.max(-1, Math.min(1, s)); // Clamp between -1 and 1
    const pcm = s < 0 ? s * 0x8000 : s * 0x7fff;
    view.setInt16(offset, pcm, true);
    offset += 2;
  }

  return new Blob([view], { type: 'audio/wav' });
}

export interface VoiceRecordingResult {
  audioBlob: Blob;
  audioUrl: string;
  durationSeconds: number;
  durationFormatted: string;
  isRealVoice: boolean;
}

export type VolumeListener = (volumePercent: number, frequencies: number[]) => void;

export class RealVoiceRecorder {
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private scriptProcessor: ScriptProcessorNode | null = null;
  private analyser: AnalyserNode | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private gainNode: GainNode | null = null;
  private pcmBuffers: Float32Array[] = [];
  private totalSamples = 0;
  private animFrameId: number | null = null;
  private startTime = 0;
  private isRecording = false;

  public async start(onVolume?: VolumeListener): Promise<boolean> {
    this.pcmBuffers = [];
    this.totalSamples = 0;
    this.isRecording = true;

    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) {
      throw new Error('AudioContext non supporté');
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Microphone non disponible');
    }

    // Request actual microphone stream with voice-enhancement flags
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });

    this.mediaStream = stream;
    const ctx = new AudioContextClass();
    this.audioContext = ctx;

    // IMPORTANT: Some browsers/contexts suspend AudioContext by default until user interaction.
    // The start() method is called on click, so this should resume properly, but we explicitly ensure it.
    if (ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch (err) {
        console.warn("Failed to resume AudioContext:", err);
      }
    }

    const source = ctx.createMediaStreamSource(stream);
    this.sourceNode = source;

    // Analyser for real-time visualization & volume meter
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 64;
    analyser.smoothingTimeConstant = 0.5;
    this.analyser = analyser;
    source.connect(analyser);

    // ScriptProcessor to collect PCM audio samples
    const bufferSize = 4096;
    const processor = ctx.createScriptProcessor(bufferSize, 1, 1);
    this.scriptProcessor = processor;

    processor.onaudioprocess = (e) => {
      if (!this.isRecording) return;
      const inputData = e.inputBuffer.getChannelData(0);
      const copy = new Float32Array(inputData.length);
      copy.set(inputData);
      this.pcmBuffers.push(copy);
      this.totalSamples += inputData.length;
    };

    // Mute gain node so user doesn't hear echo of their own microphone
    const gain = ctx.createGain();
    gain.gain.value = 0;
    this.gainNode = gain;

    source.connect(processor);
    processor.connect(gain);
    gain.connect(ctx.destination);

    this.startTime = Date.now();

    // Start volume/frequency polling loop
    if (onVolume) {
      const freqData = new Uint8Array(analyser.frequencyBinCount);
      const pollVolume = () => {
        if (!this.isRecording || !this.analyser) return;
        this.analyser.getByteFrequencyData(freqData);

        let sum = 0;
        const normFrequencies: number[] = [];
        for (let i = 0; i < freqData.length; i++) {
          sum += freqData[i];
          normFrequencies.push(Math.round((freqData[i] / 255) * 100));
        }

        const avg = freqData.length > 0 ? sum / freqData.length : 0;
        const volumePercent = Math.min(100, Math.round((avg / 128) * 100));

        onVolume(volumePercent, normFrequencies);
        this.animFrameId = requestAnimationFrame(pollVolume);
      };

      pollVolume();
    }

    return true;
  }

  public async stop(): Promise<VoiceRecordingResult> {
    this.isRecording = false;

    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }

    const elapsedMs = Math.max(500, Date.now() - this.startTime);
    const durationSeconds = Math.max(1, Math.round(elapsedMs / 1000));
    const sampleRate = this.audioContext?.sampleRate || 44100;

    // Concatenate all PCM chunks
    const merged = new Float32Array(this.totalSamples);
    let offset = 0;
    for (const chunk of this.pcmBuffers) {
      merged.set(chunk, offset);
      offset += chunk.length;
    }

    // Cleanup audio resources
    this.cleanupNodes();

    // Encode to standard WAV
    const blob = encodeWavBlob(merged, sampleRate);
    const audioUrl = URL.createObjectURL(blob);

    const minutes = Math.floor(durationSeconds / 60);
    const secs = durationSeconds % 60;
    const durationFormatted = `${minutes}:${String(secs).padStart(2, '0')}`;

    return {
      audioBlob: blob,
      audioUrl,
      durationSeconds,
      durationFormatted,
      isRealVoice: true,
    };
  }

  public cancel(): void {
    this.isRecording = false;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    this.cleanupNodes();
    this.pcmBuffers = [];
    this.totalSamples = 0;
  }

  private cleanupNodes(): void {
    try {
      if (this.sourceNode) {
        this.sourceNode.disconnect();
        this.sourceNode = null;
      }
      if (this.scriptProcessor) {
        this.scriptProcessor.disconnect();
        this.scriptProcessor = null;
      }
      if (this.analyser) {
        this.analyser.disconnect();
        this.analyser = null;
      }
      if (this.gainNode) {
        this.gainNode.disconnect();
        this.gainNode = null;
      }
      if (this.mediaStream) {
        this.mediaStream.getTracks().forEach((track) => track.stop());
        this.mediaStream = null;
      }
      if (this.audioContext && this.audioContext.state !== 'closed') {
        this.audioContext.close().catch(() => {});
        this.audioContext = null;
      }
    } catch {
      // Ignored
    }
  }
}

/**
 * Generates an audible spoken/harmonic voice sample WAV when microphone hardware
 * permission is blocked in an iframe sandbox, ensuring the user can still test voice messages with real audio.
 */
export function generateDemoVoiceWav(durationSeconds = 3, pitchHz = 260): { blob: Blob; url: string } {
  const sampleRate = 44100;
  const numSamples = sampleRate * durationSeconds;
  const buffer = new Float32Array(numSamples);

  // Synthesize human-like vocal formant tones with syllables
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    // Envelope (soft start and end)
    const env = Math.sin((Math.PI * t) / durationSeconds);
    // Syllabic modulation (vocal cadence)
    const cadence = 0.5 + 0.5 * Math.sin(2 * Math.PI * 4 * t);
    // Formant blend (f0 fundamental + f1 formant + f2 formant)
    const f0 = Math.sin(2 * Math.PI * pitchHz * t);
    const f1 = 0.6 * Math.sin(2 * Math.PI * (pitchHz * 2.2) * t);
    const f2 = 0.3 * Math.sin(2 * Math.PI * (pitchHz * 3.4) * t);

    buffer[i] = env * cadence * 0.4 * (f0 + f1 + f2);
  }

  const blob = encodeWavBlob(buffer, sampleRate);
  const url = URL.createObjectURL(blob);
  return { blob, url };
}

/**
 * Real Speech Recognition (Speech-to-text dictation)
 */
export class VoiceDictation {
  private recognition: any = null;
  public isSupported: boolean = false;

  constructor(language: string = 'fr-FR') {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRec) {
      this.isSupported = true;
      try {
        this.recognition = new SpeechRec();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = language === 'en' ? 'en-US' : 'fr-FR';
      } catch {
        this.isSupported = false;
      }
    }
  }

  public start(
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (err: any) => void
  ) {
    if (!this.recognition) return;
    this.recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      onResult(finalTranscript || interimTranscript, !!finalTranscript);
    };

    this.recognition.onerror = (e: any) => {
      onError(e);
    };

    try {
      this.recognition.start();
    } catch {
      // Already running
    }
  }

  public stop() {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // Ignored
      }
    }
  }
}
