const NOTE_FREQUENCIES = [110.0, 146.83, 196.0, 220.0, 293.66, 392.0, 440.0];

let audioContext: AudioContext | null = null;
let masterGain: GainNode | null = null;
let recordDestination: MediaStreamAudioDestinationNode | null = null;

let mediaRecorder: MediaRecorder | null = null;
let recordedChunks: Blob[] = [];
/** Session-only recording kept in RAM until page reload (demo best practice) */
let recordedBlob: Blob | null = null;
let recordingPlayback: HTMLAudioElement | null = null;
let recordingObjectUrl: string | null = null;

function getFrequency(stringIndex: number): number {
  const base = NOTE_FREQUENCIES[stringIndex % NOTE_FREQUENCIES.length];
  const octave = Math.floor(stringIndex / NOTE_FREQUENCIES.length);
  return base * Math.pow(2, octave);
}

function makeDistortionCurve(amount: number): Float32Array {
  const samples = 44100;
  const curve = new Float32Array(samples);
  const deg = Math.PI / 180;

  for (let i = 0; i < samples; i++) {
    const x = (i * 2) / samples - 1;
    curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
  }

  return curve;
}

function ensureAudioGraph(ctx: AudioContext): GainNode {
  if (!masterGain) {
    masterGain = ctx.createGain();
    masterGain.gain.value = 1;
    masterGain.connect(ctx.destination);

    recordDestination = ctx.createMediaStreamDestination();
    masterGain.connect(recordDestination);
  }

  return masterGain;
}

function revokeRecordingObjectUrl(): void {
  if (recordingObjectUrl) {
    URL.revokeObjectURL(recordingObjectUrl);
    recordingObjectUrl = null;
  }
}

function clearSessionRecording(): void {
  stopRecordingPlayback();
  recordedBlob = null;
  recordedChunks = [];
}

export async function initAudio(): Promise<void> {
  if (typeof window === "undefined") return;
  if (!audioContext) {
    audioContext = new AudioContext();
    ensureAudioGraph(audioContext);
  }
  if (audioContext.state === "suspended") {
    await audioContext.resume();
  }
}

export function hasRecording(): boolean {
  return recordedBlob !== null;
}

export function isRecording(): boolean {
  return mediaRecorder?.state === "recording";
}

function electronicBaglamaPluck(
  ctx: AudioContext,
  output: GainNode,
  frequency: number,
  velocity: number,
): void {
  const now = ctx.currentTime;
  const peakGain = Math.min(0.12 + velocity * 0.07, 0.75);

  const bodyOsc = ctx.createOscillator();
  bodyOsc.type = "sawtooth";
  bodyOsc.frequency.setValueAtTime(frequency, now);
  bodyOsc.frequency.exponentialRampToValueAtTime(frequency * 0.98, now + 1.2);

  const shimmerOsc = ctx.createOscillator();
  shimmerOsc.type = "triangle";
  shimmerOsc.frequency.value = frequency * 2;
  shimmerOsc.detune.value = 11;

  const bodyGain = ctx.createGain();
  bodyGain.gain.setValueAtTime(peakGain * 0.85, now);
  bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 2.1);

  const shimmerGain = ctx.createGain();
  shimmerGain.gain.setValueAtTime(peakGain * 0.25, now);
  shimmerGain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

  const bandpass = ctx.createBiquadFilter();
  bandpass.type = "bandpass";
  bandpass.Q.value = 9;
  bandpass.frequency.setValueAtTime(frequency * 4.5, now);
  bandpass.frequency.exponentialRampToValueAtTime(frequency * 1.8, now + 0.35);

  const lowpass = ctx.createBiquadFilter();
  lowpass.type = "lowpass";
  lowpass.frequency.setValueAtTime(3200, now);
  lowpass.frequency.exponentialRampToValueAtTime(900, now + 1.8);

  const shaper = ctx.createWaveShaper();
  shaper.curve = makeDistortionCurve(18) as Float32Array<ArrayBuffer>;
  shaper.oversample = "2x";

  const mixGain = ctx.createGain();
  mixGain.gain.value = 1;

  const delay = ctx.createDelay(0.5);
  delay.delayTime.value = 0.06;
  const delayGain = ctx.createGain();
  delayGain.gain.value = 0.18;

  bodyOsc.connect(bodyGain);
  shimmerOsc.connect(shimmerGain);
  bodyGain.connect(bandpass);
  shimmerGain.connect(bandpass);
  bandpass.connect(shaper);
  shaper.connect(lowpass);
  lowpass.connect(mixGain);
  mixGain.connect(output);
  mixGain.connect(delay);
  delay.connect(delayGain);
  delayGain.connect(output);

  const detune = (Math.random() - 0.5) * velocity * 8;
  bodyOsc.detune.value = detune;
  shimmerOsc.detune.value = detune * 1.5;

  bodyOsc.start(now);
  shimmerOsc.start(now);
  bodyOsc.stop(now + 2.4);
  shimmerOsc.stop(now + 2.4);
}

export async function pluck(stringIndex: number, velocity: number): Promise<void> {
  if (typeof window === "undefined" || velocity <= 0) return;

  await initAudio();
  if (!audioContext || !masterGain) return;

  electronicBaglamaPluck(audioContext, masterGain, getFrequency(stringIndex), velocity);
}

export async function startRecording(): Promise<void> {
  await initAudio();
  if (!recordDestination || !audioContext) return;
  if (mediaRecorder?.state === "recording") return;

  clearSessionRecording();

  const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
    ? "audio/webm;codecs=opus"
    : "audio/webm";

  mediaRecorder = new MediaRecorder(recordDestination.stream, { mimeType });
  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      recordedChunks.push(event.data);
    }
  };
  mediaRecorder.start(250);
}

export async function stopRecording(): Promise<Blob | null> {
  if (!mediaRecorder || mediaRecorder.state !== "recording") {
    return recordedBlob;
  }

  return new Promise((resolve) => {
    const recorder = mediaRecorder;
    if (!recorder) {
      resolve(recordedBlob);
      return;
    }

    recorder.onstop = () => {
      recordedBlob = new Blob(recordedChunks, {
        type: recorder.mimeType || "audio/webm",
      });
      resolve(recordedBlob);
    };

    recorder.requestData();
    recorder.stop();
  });
}

export async function playRecording(): Promise<void> {
  if (!recordedBlob) return;

  stopRecordingPlayback();
  revokeRecordingObjectUrl();

  recordingObjectUrl = URL.createObjectURL(recordedBlob);
  recordingPlayback = new Audio(recordingObjectUrl);

  await new Promise<void>((resolve, reject) => {
    if (!recordingPlayback) {
      resolve();
      return;
    }

    recordingPlayback.onended = () => resolve();
    recordingPlayback.onerror = () => reject(new Error("Playback failed"));
    recordingPlayback.play().catch(reject);
  });
}

export function stopRecordingPlayback(): void {
  if (recordingPlayback) {
    recordingPlayback.pause();
    recordingPlayback.currentTime = 0;
    recordingPlayback = null;
  }
  revokeRecordingObjectUrl();
}

export function uploadRecording(): void {
  if (!recordedBlob) return;

  const extension = recordedBlob.type.includes("webm") ? "webm" : "audio";
  const url = URL.createObjectURL(recordedBlob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `elektrokebab-recording.${extension}`;
  anchor.click();
  URL.revokeObjectURL(url);
}
