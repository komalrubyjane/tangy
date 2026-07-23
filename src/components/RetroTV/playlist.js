// ─── PLAYLIST ──────────────────────────────────────────────────────────────────
// Dynamically discovers all .mp4 files in /public/background-video/
// Vite resolves these at build time so no server-side filesystem access is needed.

const rawGlob = import.meta.glob('/public/background-video/*.mp4', {
  query: '?url',
  import: 'default',
  eager: true,
});

// Convert to an array of { filename, url } objects
const allVideoEntries = Object.entries(rawGlob).map(([path, url]) => ({
  filename: path.split('/').pop().replace('.mp4', ''),
  url,
  path,
}));

// ── Special videos ──
export const FIRST_VIDEO = allVideoEntries.find(v => v.filename === 'first') || null;
export const MIDDLE_VIDEO = allVideoEntries.find(v => v.filename === 'middle') || null;

// ── Playlist = everything except first.mp4 and middle.mp4 ──
export const PLAYLIST = allVideoEntries.filter(
  v => v.filename !== 'first' && v.filename !== 'middle'
);

// Fisher-Yates shuffle — returns a new shuffled array every call
export function shufflePlaylist(arr) {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Derive a human-readable title from filename
export function toTitle(filename) {
  if (!filename) return 'Untitled';
  // "Video-22402" → "Video 22402", "Fresh-from-archives" → "Fresh From Archives"
  return filename
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}
