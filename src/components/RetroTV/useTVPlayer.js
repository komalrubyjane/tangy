import { useState, useRef, useEffect, useCallback } from 'react';
import { FIRST_VIDEO, MIDDLE_VIDEO, PLAYLIST, shufflePlaylist } from './playlist.js';

// ── TV States ──────────────────────────────────────────────────────────────────
export const TV_STATE = {
  BOOTING: 'BOOTING',    // Playing first.mp4
  PLAYING: 'PLAYING',    // Playing a shuffled playlist video
  SWITCHING: 'SWITCHING', // Playing middle.mp4 before channel change
  OFF: 'OFF',            // Powered off
};

export function useTVPlayer() {
  const videoRef = useRef(null);

  // ── Playlist state ──────────────────────────────────────────────────────────
  const [shuffled, setShuffled] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [pendingIndex, setPendingIndex] = useState(null);

  // ── TV state machine ────────────────────────────────────────────────────────
  const [tvState, setTvState] = useState(TV_STATE.OFF);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [knobAngle, setKnobAngle] = useState(0);
  const [isPowered, setIsPowered] = useState(true);

  // ── Initialise on mount ─────────────────────────────────────────────────────
  useEffect(() => {
    const fresh = shufflePlaylist(PLAYLIST);
    setShuffled(fresh);
    setCurrentIndex(0);

    const alreadyBooted = sessionStorage.getItem('tvBooted') === 'true';
    if (alreadyBooted) {
      setTvState(TV_STATE.PLAYING);
    } else {
      setTvState(TV_STATE.BOOTING);
    }
    setIsPowered(true);
  }, []);

  // ── Derived current video source ────────────────────────────────────────────
  const currentVideo = (() => {
    if (tvState === TV_STATE.BOOTING)    return FIRST_VIDEO;
    if (tvState === TV_STATE.SWITCHING)  return MIDDLE_VIDEO;
    if (tvState === TV_STATE.PLAYING)    return shuffled[currentIndex] || null;
    return null;
  })();

  const currentSrc = currentVideo?.url || '';
  const channelNumber = currentIndex + 1;
  const totalVideos = shuffled.length;

  // ── React to video source changes ───────────────────────────────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !currentSrc || tvState === TV_STATE.OFF) return;

    video.src = currentSrc;
    video.muted = isMuted;
    video.volume = volume;
    video.load();
    video.play().catch(() => {});
    setIsPlaying(true);
  }, [currentSrc, tvState]);

  // ── Sync volume / mute changes to DOM ───────────────────────────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = isMuted;
    video.volume = volume;
  }, [isMuted, volume]);

  // ── Video event listeners ───────────────────────────────────────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => setCurrentTime(video.currentTime);
    const onDurationChange = () => setDuration(video.duration || 0);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    const onEnded = () => {
      if (tvState === TV_STATE.BOOTING) {
        sessionStorage.setItem('tvBooted', 'true');
        setCurrentIndex(0);
        setTvState(TV_STATE.PLAYING);
      } else if (tvState === TV_STATE.SWITCHING) {
        const nextIdx = pendingIndex !== null ? pendingIndex : 0;
        setCurrentIndex(nextIdx);
        setPendingIndex(null);
        setTvState(TV_STATE.PLAYING);
      } else if (tvState === TV_STATE.PLAYING) {
        // Auto-advance to next in shuffled list
        setCurrentIndex(prev => (prev + 1) % (shuffled.length || 1));
      }
    };

    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('durationchange', onDurationChange);
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    video.addEventListener('ended', onEnded);

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('durationchange', onDurationChange);
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('ended', onEnded);
    };
  }, [tvState, pendingIndex, shuffled]);

  // ── Controls ────────────────────────────────────────────────────────────────
  const play = useCallback(() => {
    videoRef.current?.play();
  }, []);

  const pause = useCallback(() => {
    videoRef.current?.pause();
  }, []);

  const seek = useCallback((time) => {
    if (videoRef.current) videoRef.current.currentTime = time;
  }, []);

  const changeVolume = useCallback((val) => {
    setVolume(val);
    setIsMuted(val === 0);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      if (videoRef.current) videoRef.current.muted = !prev;
      return !prev;
    });
  }, []);

  const goToChannel = useCallback((nextIdx) => {
    if (tvState !== TV_STATE.PLAYING) return;
    const safeIdx = ((nextIdx % shuffled.length) + shuffled.length) % shuffled.length;
    setPendingIndex(safeIdx);
    setKnobAngle(prev => prev + 36); // rotate knob 36° per channel step
    setTvState(TV_STATE.SWITCHING);
  }, [tvState, shuffled.length]);

  const nextChannel = useCallback(() => {
    goToChannel(currentIndex + 1);
  }, [currentIndex, goToChannel]);

  const prevChannel = useCallback(() => {
    goToChannel(currentIndex - 1);
  }, [currentIndex, goToChannel]);

  const powerOff = useCallback(() => {
    const video = videoRef.current;
    if (video) { video.pause(); video.src = ''; }
    setIsPlaying(false);
    setIsPowered(false);
    setTvState(TV_STATE.OFF);
    sessionStorage.removeItem('tvBooted');
  }, []);

  const powerOn = useCallback(() => {
    const fresh = shufflePlaylist(PLAYLIST);
    setShuffled(fresh);
    setCurrentIndex(0);
    setIsPowered(true);
    setTvState(TV_STATE.BOOTING);
  }, []);

  const togglePower = useCallback(() => {
    if (isPowered) powerOff(); else powerOn();
  }, [isPowered, powerOff, powerOn]);

  const requestFullscreen = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.requestFullscreen) video.requestFullscreen();
    else if (video.webkitRequestFullscreen) video.webkitRequestFullscreen();
  }, []);

  return {
    videoRef,
    tvState,
    isPowered,
    currentVideo,
    currentIndex,
    channelNumber,
    totalVideos,
    isPlaying,
    isMuted,
    volume,
    currentTime,
    duration,
    knobAngle,
    shuffled,
    // controls
    play,
    pause,
    seek,
    changeVolume,
    toggleMute,
    nextChannel,
    prevChannel,
    togglePower,
    requestFullscreen,
  };
}
