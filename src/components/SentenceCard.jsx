function FeedbackIcon({ result }) {
  if (result === "correct") return <span className="icon-correct">✓</span>;
  if (result === "close") return <span className="icon-close">⚠</span>;
  if (result === "wrong") return <span className="icon-wrong">✗</span>;
  return null;
}

function fieldClass(result) {
  if (result === "correct") return "field-correct";
  if (result === "close") return "field-close";
  if (result === "wrong") return "field-wrong";
  return "";
}

function SentenceCard({ index, item, state, onChange, onCheck }) {
  const { value, checked, result, comment } = state;
  const shakeClass = checked && result === "wrong" ? "animate-shake" : "";

  const handleCheck = () => {
    if (checked) return;
    onCheck(value);
  };

  let content;
  if (item.type === "translate") {
    content = (
      <div>
        <div className="translate-label">Руски:</div>
        <div className="translate-source">{item.ru}</div>
        <input
          type="text"
          value={value}
          disabled={checked}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Напиши превода тук..."
          className={`field-base field-block ${fieldClass(result)}`}
        />
      </div>
    );
  } else if (item.type === "select") {
    content = (
      <div className="sentence-text">
        <span>{item.before}</span>
        <select
          value={value}
          disabled={checked}
          onChange={(e) => onChange(e.target.value)}
          className={`field-base field-inline ${fieldClass(result)}`}
        >
          <option value="">— избери —</option>
          {item.options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <span>{item.after}</span>
      </div>
    );
  } else {
    content = (
      <div className="sentence-text">
        <span>{item.before}</span>
        <input
          type="text"
          value={value}
          disabled={checked}
          onChange={(e) => onChange(e.target.value)}
          size={Math.max(6, (item.answers[0] || "").length + 2)}
          className={`field-base field-inline ${fieldClass(result)}`}
        />
        <span>{item.after}</span>
        {item.hint && <span className="hint-text">({item.hint})</span>}
      </div>
    );
  }

  return (
    <div className={`sentence-card ${shakeClass}`}>
      <div className="card-row">
        <div className="card-index">{index + 1}</div>
        <div className="card-body">
          {content}

          {checked && result !== "correct" && (
            <div className="correct-answer-line">
              Правилен отговор: <strong>{state.correctAnswer}</strong>
            </div>
          )}
          {checked && state.explanation && (
            <div className="explanation-line">💡 {state.explanation}</div>
          )}

          <div className="card-footer">
            <div className="feedback-row animate-pop">
              {checked && <FeedbackIcon result={result} />}
              {checked && <span className="feedback-comment">{comment}</span>}
            </div>
            {!checked && (
              <button onClick={handleCheck} className="btn btn-check">
                Провери
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export { SentenceCard };
