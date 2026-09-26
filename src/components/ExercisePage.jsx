import { evaluateAnswer } from "../lib/evaluate.js";
import { randomComment } from "../lib/comments.js";
import { EXERCISES } from "../data/exercises.js";
import { SentenceCard } from "./SentenceCard.jsx";

function ExercisePage({ exerciseIndex, exercise, pageState, setPageItem, onPrev, onNext, canGoBack, isLast, allChecked }) {
  const handleCheckOne = (itemIndex, rawValue) => {
    const item = exercise.items[itemIndex];
    const { result, bestAnswer } = evaluateAnswer(rawValue, item.answers);
    setPageItem(itemIndex, {
      value: rawValue,
      checked: true,
      result,
      comment: randomComment(result),
      correctAnswer: bestAnswer,
      explanation: item.explanation || null,
    });
  };

  const handleChangeOne = (itemIndex, val) => {
    setPageItem(itemIndex, { value: val });
  };

  const handleCheckAll = () => {
    exercise.items.forEach((item, i) => {
      if (!pageState[i].checked) {
        handleCheckOne(i, pageState[i].value);
      }
    });
  };

  const hasUnchecked = pageState.some((s) => !s.checked);

  return (
    <div className="container-narrow page-pad">
      <div className="page-head">
        <div className="page-eyebrow">Упражнение {exerciseIndex + 1} от {EXERCISES.length}</div>
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
            onChange={(val) => handleChangeOne(i, val)}
            onCheck={(val) => handleCheckOne(i, val)}
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
