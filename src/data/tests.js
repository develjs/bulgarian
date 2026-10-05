import * as uslovieTip1 from "./uslovie-tip-1.js";
import * as glagoliZaDvizhenie from "./glagoli-za-dvizhenie.js";

/* Список видов тестов. Файл заданий называется как id. */

const TESTS = [
  {
    id: "uslovie-tip-1",
    title: "Сложноподчинени изречения (условие тип 1)",
    resultText: "Ето твоя резултат от упражненията за условни изречения.",
  },
  {
    id: "glagoli-za-dvizhenie",
    title: "Глаголи за движение",
    resultText: "Ето твоя резултат от упражненията за глаголи за движение.",
  },
];

const TEST_CONTENT = {
  "uslovie-tip-1": uslovieTip1,
  "glagoli-za-dvizhenie": glagoliZaDvizhenie,
};

export { TESTS, TEST_CONTENT };
