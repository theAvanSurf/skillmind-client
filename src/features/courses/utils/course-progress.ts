export function parseDurationToSeconds(duration: string): number {
  const text = duration.toLowerCase();
  const hoursMatch = text.match(/(\d+)\s*h/);
  const minutesMatch = text.match(/(\d+)\s*(m|min|mins|minutes)/);
  const hourWordMatch = text.match(/(\d+)\s*hour/);

  const hours = Number(hoursMatch?.[1] ?? hourWordMatch?.[1] ?? 0);
  const minutes = Number(minutesMatch?.[1] ?? 0);

  const total = hours * 3600 + minutes * 60;
  return total > 0 ? total : 3600;
}

export function resolveStoredProgress(courseId: string, fallbackProgress: number, duration: string) {
  try {
    const percentRaw = localStorage.getItem(`course-progress:${courseId}`);
    const timestampRaw = localStorage.getItem(`vp:course-${courseId}`);
    const durationSeconds = parseDurationToSeconds(duration);

    let storedPercent: number | null = null;
    if (percentRaw) {
      const parsed = Number(percentRaw);
      if (Number.isFinite(parsed) && parsed >= 0) {
        storedPercent = Math.min(100, Math.max(0, parsed));
      }
    }

    let storedTimestamp: number | null = null;
    if (timestampRaw) {
      const parsed = Number(timestampRaw);
      if (Number.isFinite(parsed) && parsed >= 0) {
        storedTimestamp = parsed;
        const percentFromTimestamp = (parsed / durationSeconds) * 100;
        storedPercent =
          storedPercent == null
            ? Math.min(100, Math.max(0, percentFromTimestamp))
            : Math.max(storedPercent, Math.min(100, Math.max(0, percentFromTimestamp)));
      }
    }

    const effectiveProgress = Math.round(Math.max(fallbackProgress, storedPercent ?? 0));
    return { effectiveProgress, storedTimestamp };
  } catch {
    return { effectiveProgress: fallbackProgress, storedTimestamp: null };
  }
}
