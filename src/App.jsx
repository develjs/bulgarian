import { useCallback, useMemo, useState } from "react";
import { TESTS, TEST_CONTENT } from "./data/tests.js";
import { ExercisePage } from "./components/ExercisePage.jsx";
import { FinalPage } from "./components/FinalPage.jsx";
import { HomePage } from "./components/HomePage.jsx";
import { ProgressBar } from "./components/ProgressBar.jsx";

function App() {
  const [activeTestId, setActiveTestId] = useState(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [allState, setAllState] = useState([]);

  const activeTest = TESTS.find((test) => test.id === activeTestId) ?? null;
  const content = activeTestId ? TEST_CONTENT[activeTestId] : null;
  const exercises = content?.EXERCISES ?? [];
  const totalItems = content?.TOTAL_ITEMS ?? 0;

  const totalCorrect = useMemo(() => {
    let sum = 0;
    allState.forEach((page) => page.forEach((item) => { if (item.checked && item.result === "correct") sum += 1; }));
    return sum;
  }, [allState]);

  const isFinal = !!content && pageIndex >= exercises.length;

  const setPageItem = useCallback((itemIndex, patch) => {
    setAllState((prev) => {
      const next = prev.map((p) => p.slice());
      next[pageIndex] = next[pageIndex].slice();
      next[pageIndex][itemIndex] = { ...next[pageIndex][itemIndex], ...patch };
      return next;
    });
  }, [pageIndex]);

  const handleStart = (testId) => {
    const next = TEST_CONTENT[testId];
    if (!next) return;
    setAllState(next.makeEmptyAllState());
    setPageIndex(0);
    setActiveTestId(testId);
  };

  const handleRestart = () => {
    const next = TEST_CONTENT[activeTestId];
    if (!next) return;
    setAllState(next.makeEmptyAllState());
    setPageIndex(0);
  };

  return (
    <div className="app-shell">
      {activeTest && (
        <header className="app-header">
          <div className="container-narrow progress-wrap">
            <ProgressBar total={totalCorrect} allTotal={totalItems} />
          </div>
        </header>
      )}

      <main className="app-main">
        {!activeTest ? (
          <HomePage tests={TESTS} onStart={handleStart} />
        ) : isFinal ? (
          <FinalPage
            totalCorrect={totalCorrect}
            allTotal={totalItems}
            resultText={activeTest.resultText}
            onRestart={handleRestart}
          />
        ) : (
          <ExercisePage
            key={`${activeTestId}-${pageIndex}`}
            exerciseIndex={pageIndex}
            exerciseCount={exercises.length}
            exercise={exercises[pageIndex]}
            pageState={allState[pageIndex]}
            setPageItem={setPageItem}
            onPrev={() => setPageIndex((p) => Math.max(0, p - 1))}
            onNext={() => setPageIndex((p) => p + 1)}
            canGoBack={pageIndex > 0}
            isLast={pageIndex === exercises.length - 1}
            allChecked={allState[pageIndex].every((s) => s.checked)}
          />
        )}
      </main>

      <footer className="app-footer">
        Учене на български език{activeTest ? ` · ${activeTest.title}` : ""}
      </footer>
    </div>
  );
}

export { App };
