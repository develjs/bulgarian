import { gradeItem } from "../lib/evaluate.js";
import { randomComment } from "../lib/comments.js";
import { SentenceCard } from "./SentenceCard.jsx";

function ExercisePage({ exerciseIndex, exerciseCount, exercise, pageState, setPageItem, onPrev, onNext, canGoBack, isLast, allChecked }) {
  const handleCheckOne = (itemIndex) => {
    const item = exercise.items[itemIndex];
    const current = pageState[itemIndex];
    if (current.checked) return;
    const graded = gradeItem(item.blanks, current.values);
    setPageItem(itemIndex, {
      checked: true,
      result: graded.result,
      fieldResults: graded.fieldResults,
      comment: randomComment(graded.result),
      correctAnswer: graded.correctAnswer,
      explanation: item.explanation || null,
    });
  };

  const handleChangeOne = (itemIndex, fieldIndex, val) => {
    const values = pageState[itemIndex].values.slice();
    values[fieldIndex] = val;
    setPageItem(itemIndex, { values });
  };

  const handleCheckAll = () => {
    pageState.forEach((state, i) => {
      if (!state.checked) handleCheckOne(i);
    });
  };

  const hasUnchecked = pageState.some((s) => !s.checked);

  return (
    <div className="container-narrow page-pad">
      <div className="page-head">
        <div className="page-eyebrow">Упражнение {exerciseIndex + 1} от {exerciseCount}</div>
        <h1 className="page-title serif-display">{exercise.title}</h1>
        <p className="page-subtitle">{exercise.subtitle}</p>
      </div>

      <div className="card-list">
        {exercise.items.map((item, i) => (
          <SentenceCard
            key={i}
            index={i}
            item={item}
            state={pageState[i]}
            onChange={(fieldIndex, val) => handleChangeOne(i, fieldIndex, val)}
            onCheck={() => handleCheckOne(i)}
          />
        ))}
      </div>

      {hasUnchecked && (
        <button onClick={handleCheckAll} className="btn btn-check-all">
          Провери всичко
        </button>
      )}

      <div className="nav-row">
        <button
          onClick={onPrev}
          disabled={!canGoBack}
          className={`btn btn-back ${!canGoBack ? "hidden-btn" : ""}`}
        >
          ← Назад
        </button>

        {allChecked && (
          <button onClick={onNext} className="btn btn-next animate-pop">
            {isLast ? "Завърши →" : "Следващо упражнение →"}
          </button>
        )}
      </div>
    </div>
  );
}

export { ExercisePage };
