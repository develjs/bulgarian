import { useCallback, useMemo, useState } from "react";
import { EXERCISES, TOTAL_ITEMS, makeEmptyAllState } from "./data/exercises.js";
import { ExercisePage } from "./components/ExercisePage.jsx";
import { FinalPage } from "./components/FinalPage.jsx";
import { ProgressBar } from "./components/ProgressBar.jsx";

function App() {
  const [pageIndex, setPageIndex] = useState(0);
  const [allState, setAllState] = useState(() => makeEmptyAllState());

  const totalCorrect = useMemo(() => {
    let sum = 0;
    allState.forEach((page) => page.forEach((item) => { if (item.checked && item.result === "correct") sum += 1; }));
    return sum;
  }, [allState]);

  const isFinal = pageIndex >= EXERCISES.length;

  const setPageItem = useCallback((itemIndex, patch) => {
    setAllState((prev) => {
      const next = prev.map((p) => p.slice());
      next[pageIndex] = next[pageIndex].slice();
      next[pageIndex][itemIndex] = { ...next[pageIndex][itemIndex], ...patch };
      return next;
    });
  }, [pageIndex]);

  const handleRestart = () => {
    setAllState(makeEmptyAllState());
    setPageIndex(0);
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="container-narrow progress-wrap">
          <ProgressBar total={totalCorrect} allTotal={TOTAL_ITEMS} />
        </div>
      </header>

      <main className="app-main">
        {isFinal ? (
          <FinalPage totalCorrect={totalCorrect} allTotal={TOTAL_ITEMS} onRestart={handleRestart} />
        ) : (
          <ExercisePage
            key={pageIndex}
            exerciseIndex={pageIndex}
            exercise={EXERCISES[pageIndex]}
            pageState={allState[pageIndex]}
            setPageItem={setPageItem}
            onPrev={() => setPageIndex((p) => Math.max(0, p - 1))}
            onNext={() => setPageIndex((p) => p + 1)}
            canGoBack={pageIndex > 0}
            isLast={pageIndex === EXERCISES.length - 1}
            allChecked={allState[pageIndex].every((s) => s.checked)}
          />
        )}
      </main>

      <footer className="app-footer">
        Учене на български език · Сложноподчинени изречения (условие тип 1)
      </footer>
    </div>
  );
}

export { App };
