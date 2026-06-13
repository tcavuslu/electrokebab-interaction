"use client";

import { useCallback, useState } from "react";
import {
  hasRecording,
  playRecording,
  startRecording,
  stopRecording,
  stopRecordingPlayback,
  uploadRecording,
} from "@/lib/baglamaAudio";

const buttonClass =
  "rounded-full bg-[#F5D547] px-4 py-2 font-mono text-base font-semibold uppercase tracking-tight text-[#191926] transition-opacity duration-500 ease-in-out hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-off-black disabled:cursor-not-allowed disabled:opacity-50 md:px-5 md:text-lg xl:text-xl";

export default function RecordControls() {
  const [recording, setRecording] = useState(false);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);

  const handleRecord = useCallback(async () => {
    if (recording) {
      await stopRecording();
      stopRecordingPlayback();
      setRecording(false);
      setPlaying(false);
      setReady(hasRecording());
      return;
    }

    stopRecordingPlayback();
    setPlaying(false);
    setReady(false);
    await startRecording();
    setRecording(true);
  }, [recording]);

  const handlePlay = useCallback(async () => {
    if (!hasRecording()) return;

    if (playing) {
      stopRecordingPlayback();
      setPlaying(false);
      return;
    }

    setPlaying(true);
    await playRecording();
    setPlaying(false);
  }, [playing]);

  const handleUpload = useCallback(() => {
    if (!hasRecording()) return;
    uploadRecording();
  }, []);

  return (
    <div className="pointer-events-auto absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 flex-wrap items-center justify-center gap-4 px-4 md:bottom-6">
      <button
        type="button"
        className={`${buttonClass} ${recording ? "ring-2 ring-off-black" : ""}`}
        aria-label={recording ? "Stop recording" : "Start recording"}
        aria-pressed={recording}
        onClick={handleRecord}
      >
        {recording ? "Stop" : "Record"}
      </button>
      <button
        type="button"
        className={buttonClass}
        aria-label="Play recording"
        disabled={!ready}
        onClick={handlePlay}
      >
        {playing ? "Playing…" : "Play"}
      </button>
      <button
        type="button"
        className={buttonClass}
        aria-label="Upload recorded file"
        disabled={!ready}
        onClick={handleUpload}
      >
        Upload
      </button>
    </div>
  );
}
