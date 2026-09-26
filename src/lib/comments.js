const CORRECT_COMMENTS = ["Отлично!", "Перфектно!", "Браво!", "Супер!", "Точно така!", "Много добре!", "Великолепно!", "Ти си звезда!", "Продължавай така!", "Чудесно!"];
const CLOSE_COMMENTS = ["Почти!", "Близо!", "Малко повече!", "Добър опит!", "Почти перфектно!", "Не се отказвай!", "Много близо!", "Само малко поправка!", "Добре си!", "Още малко!"];
const WRONG_COMMENTS = ["Не се притеснявай!", "Ще стане!", "Дръж се!", "Учиш се!", "Няма проблем!", "Следващия път!", "Практиката прави майстора!", "Напред!", "Не се предавай!", "Всеки греши!"];

function randomComment(result) {
  const list = result === "correct" ? CORRECT_COMMENTS : result === "close" ? CLOSE_COMMENTS : WRONG_COMMENTS;
  return list[Math.floor(Math.random() * list.length)];
}

export { randomComment };
