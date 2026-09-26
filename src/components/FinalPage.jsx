function FinalPage({ totalCorrect, allTotal, onRestart }) {
  const pct = Math.round((totalCorrect / allTotal) * 100);
  let emoji = "💪";
  if (pct >= 90) emoji = "🏆";
  else if (pct >= 75) emoji = "🌟";
  else if (pct >= 60) emoji = "👍";

  return (
    <div className="final-wrap">
      <div className="final-emoji">{emoji}</div>
      <h1 className="final-title serif-display">Готово!</h1>
      <p className="final-sub">Ето твоя резултат от упражненията за условни изречения.</p>

      <div className="final-score-card">
        <div className="final-score-number">{totalCorrect} / {allTotal}</div>
        <div className="final-score-pct">{pct}% правилни отговори</div>
      </div>

      <button onClick={onRestart} className="btn btn-restart">
        Започни отново
      </button>
    </div>
  );
}

export { FinalPage };
