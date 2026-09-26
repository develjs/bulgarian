function ProgressBar({ total, allTotal }) {
  const pct = Math.round((total / allTotal) * 100);
  return (
    <div className="progress-wrap">
      <div className="progress-labels">
        <span>Общ напредък</span>
        <span>{total} / {allTotal}</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export { ProgressBar };
