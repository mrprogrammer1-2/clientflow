/**
 * One segment per onboarding step. Completed steps are stamp-green and the
 * first unfinished step is highlighted, so progress reads at a glance.
 */
export function StepTrack({
  total,
  done,
  label,
}: {
  total: number;
  done: number;
  label?: string;
}) {
  const count = Math.max(0, Math.min(total, 24));
  const completed = Math.max(0, Math.min(done, count));

  return (
    <div
      className="track"
      role="img"
      aria-label={label ?? `${completed} of ${total} steps complete`}
    >
      {count === 0 ? (
        <i />
      ) : (
        Array.from({ length: count }, (_, i) => (
          <i
            key={i}
            data-done={i < completed ? "" : undefined}
            data-current={i === completed ? "" : undefined}
          />
        ))
      )}
    </div>
  );
}
