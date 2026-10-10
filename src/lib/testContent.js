import { expandExerciseItem } from "./blankLine.js";

/* Общая часть модулей тестов: разворот строк заданий, счёт пунктов, пустое состояние. */

function makeEmptyPageState(items) {
  return items.map((item) => ({
    values: item.blanks.map(() => ""),
    checked: false,
    result: null,
    comment: ""
  }));
}

function prepareTest(rawExercises) {
  const EXERCISES = rawExercises.map((exercise) => ({
    ...exercise,
    items: exercise.items.map((item, index) =>
      expandExerciseItem(item, `${exercise.title}, пункт ${index + 1}`)
    )
  }));

  const TOTAL_ITEMS = EXERCISES.reduce((sum, ex) => sum + ex.items.length, 0);

  function makeEmptyAllState() {
    return EXERCISES.map((ex) => makeEmptyPageState(ex.items));
  }

  return { EXERCISES, TOTAL_ITEMS, makeEmptyAllState };
}

export { prepareTest, makeEmptyPageState };
