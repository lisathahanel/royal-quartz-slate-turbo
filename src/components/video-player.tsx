import { useEffect, useRef, useState } from "react";
import {
  Maximize,
  Minimize,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";
import type { ContinueEntry } from "@/lib/catalog/library";
import { useLibrary } from "@/lib/catalog/library";
import type { Episode, TitleDetail } from "@/lib/catalog/types";
import { AdSlot } from "@/components/ad-slot";
import { cn } from "@/lib/utils";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function VideoPlayer({ title }: { title: TitleDetail }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const saveProgress = useLibrary((s) => s.saveProgress);
  const continueWatching = useLibrary((s) => s.continueWatching);
  const prior = continueWatching.find(
    (row) => row.kind === title.kind && row.id === title.id,
  );

  const [episodeIndex, setEpisodeIndex] = useState(
    Math.min(prior?.episodeIndex ?? 0, Math.max(0, title.episodes.length - 1)),
  );
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(prior?.currentTime ?? 0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const restored = useRef(false);

  const episode: Episode | undefined = title.episodes[episodeIndex];

  useEffect(() => {
    restored.current = false;
    setError(false);
    setPlaying(false);
  }, [episodeIndex, episode?.url]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.setAttribute("referrerpolicy", "no-referrer");

    const onTime = () => setCurrentTime(video.currentTime);
    const onMeta = () => {
      setDuration(video.duration || 0);
      if (
        !restored.current &&
        prior &&
        prior.episodeIndex === episodeIndex &&
        prior.currentTime > 5
      ) {
        video.currentTime = prior.currentTime;
        restored.current = true;
      }
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onErr = () => setError(true);

    video.addEventListener("timeupdate", onTime);
    video.addEventListener("loadedmetadata", onMeta);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("error", onErr);
    return () => {
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("loadedmetadata", onMeta);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("error", onErr);
    };
  }, [episodeIndex, prior]);

  useEffect(() => {
    const id = window.setInterval(() => {
      const video = videoRef.current;
      if (!video || !episode) return;
      const payload: ContinueEntry = {
        id: title.id,
        kind: title.kind,
        title: title.title,
        image: title.image,
        episodeIndex,
        episodeLabel: episode.label,
        currentTime: video.currentTime,
        duration: video.duration || 0,
        updatedAt: Date.now(),
      };
      saveProgress(payload);
    }, 5000);
    return () => window.clearInterval(id);
  }, [episode, episodeIndex, saveProgress, title]);

  async function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) await video.play();
    else video.pause();
  }

  async function toggleFullscreen() {
    const node = wrapRef.current;
    if (!node) return;
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      setFullscreen(false);
    } else {
      await node.requestFullscreen();
      setFullscreen(true);
    }
  }

  if (!episode) {
    return (
      <div className="rounded-xl bg-card px-6 py-16 text-center text-card-fg">
        <p className="font-display text-xl font-semibold">No stream found</p>
        <p className="mt-2 text-sm text-card-fg/70">
          This title does not have a playable file yet.
        </p>
        {title.sourceUrl !== "#" ? (
          <a
            href={title.sourceUrl}
            className="mt-4 inline-flex h-11 items-center rounded-full bg-primary px-4 text-sm font-medium text-primary-fg"
            rel="noopener noreferrer"
          >
            Open original post
          </a>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        ref={wrapRef}
        className="overflow-hidden rounded-xl bg-ink shadow-[var(--shadow-card)]"
      >
        <div className="relative aspect-video bg-ink">
          <video
            key={episode.url}
            ref={videoRef}
            src={episode.url}
            className="size-full object-contain"
            playsInline
            preload="metadata"
            controls={false}
            poster={title.image || undefined}
          />
          {error ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-ink/80 px-4 text-center text-card-fg">
              <p className="font-medium">This stream could not be loaded.</p>
              {title.sourceUrl !== "#" ? (
                <a
                  href={title.sourceUrl}
                  className="inline-flex h-11 items-center rounded-full bg-primary px-4 text-sm font-medium text-primary-fg"
                  rel="noopener noreferrer"
                >
                  Open original post
                </a>
              ) : null}
            </div>
          ) : null}
          {!playing && !error ? (
            <button
              type="button"
              onClick={() => void togglePlay()}
              className="absolute inset-0 flex items-center justify-center"
              aria-label="Play"
            >
              <span className="flex size-16 items-center justify-center rounded-full bg-primary text-primary-fg shadow-[0_0_24px_rgb(216_184_0_/_0.5)]">
                <Play className="size-7 translate-x-0.5 fill-current" />
              </span>
            </button>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2 bg-card px-3 py-2 text-card-fg">
          <button
            type="button"
            onClick={() => void togglePlay()}
            className="flex size-11 items-center justify-center"
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? (
              <Pause className="size-5" />
            ) : (
              <Play className="size-5 fill-current" />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.5}
            value={currentTime}
            aria-label="Seek"
            onChange={(e) => {
              const next = Number(e.target.value);
              if (videoRef.current) videoRef.current.currentTime = next;
              setCurrentTime(next);
            }}
            className="h-1 min-w-32 flex-1 accent-gold"
          />
          <span className="min-w-20 text-xs tabular-nums text-card-fg/80">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
          <button
            type="button"
            onClick={() => {
              const video = videoRef.current;
              if (!video) return;
              video.muted = !video.muted;
              setMuted(video.muted);
            }}
            className="flex size-11 items-center justify-center"
            aria-label={muted ? "Unmute" : "Mute"}
          >
            {muted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
          </button>
          <button
            type="button"
            onClick={() => void toggleFullscreen()}
            className="flex size-11 items-center justify-center"
            aria-label={fullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {fullscreen ? <Minimize className="size-5" /> : <Maximize className="size-5" />}
          </button>
        </div>
        <div className="border-t border-white/10 px-3 py-4">
          <AdSlot variant="player" />
        </div>
      </div>

      {title.episodes.length > 1 ? (
        <div className="flex flex-wrap gap-2">
          {title.episodes.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setEpisodeIndex(index)}
              className={cn(
                "h-11 min-w-11 rounded-full px-3 text-sm font-medium transition-colors duration-150",
                index === episodeIndex
                  ? "bg-primary text-primary-fg"
                  : "bg-surface text-fg shadow-[var(--shadow-border)] hover:bg-fg/6",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
