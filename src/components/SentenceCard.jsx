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

function BlankControl({ item, blank, value, checked, result, onChange }) {
  const className = `field-base ${item.type === "translate" ? "field-block" : "field-inline"} ${fieldClass(result)}`;
  if (item.type === "select") {
    return (
      <select value={value} disabled={checked} onChange={(e) => onChange(e.target.value)} className={className}>
        <option value="">— избери —</option>
        {item.options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    );
  }
  return (
    <input
      type="text"
      value={value}
      disabled={checked}
      onChange={(e) => onChange(e.target.value)}
      size={item.type === "translate" ? undefined : Math.max(6, (blank.answers[0] || "").length + 2)}
      placeholder={item.type === "translate" ? "Напиши превода тук..." : undefined}
      className={className}
    />
  );
}

function SentenceCard({ index, item, state, onChange, onCheck }) {
  const { values, checked, result, comment, fieldResults } = state;
  const shakeClass = checked && result === "wrong" ? "animate-shake" : "";

  const handleCheck = () => {
    if (checked) return;
    onCheck();
  };

  const blankAt = (fieldIndex) => (
    <BlankControl
      item={item}
      blank={item.blanks[fieldIndex]}
      value={values[fieldIndex] ?? ""}
      checked={checked}
      result={checked ? fieldResults?.[fieldIndex] : null}
      onChange={(val) => onChange(fieldIndex, val)}
    />
  );

  let content;
  if (item.layout === "parallel") {
    content = (
      <div>
        <div className="translate-label">Руски:</div>
        <div className="translate-source">
          {item.ru}
          {item.hint && <span className="hint-text">({item.hint})</span>}
        </div>
        {item.blanks.map((blank) => (
          <BlankControl
            key={blank.index}
            item={item}
            blank={blank}
            value={values[blank.index] ?? ""}
            checked={checked}
            result={checked ? fieldResults?.[blank.index] : null}
            onChange={(val) => onChange(blank.index, val)}
          />
        ))}
      </div>
    );
  } else {
    content = (
      <div className="sentence-text">
        {item.parts.map((part, i) => (
          part.type === "text"
            ? <span key={i}>{part.text}</span>
            : <span key={i}>{blankAt(part.index)}</span>
        ))}
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
