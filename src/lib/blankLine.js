// «Ако имам време, ще {напиша|напиша писмо} писмо. [пиша]»
// «Если у меня будет время, я напишу письмо. {Ако имам време, ще напиша писмо.} [пиша]»
// Подсказка [скобки] стоит до или после перевода. Пробелы снаружи {} внутри фразы остаются.

function tokenize(text) {
  const tokens = [];
  let buf = "";
  const pushText = () => {
    if (buf.length) {
      tokens.push({ type: "text", value: buf });
      buf = "";
    }
  };

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch !== "{" && ch !== "[") {
      if (ch === "}" || ch === "]") throw new Error(`Лишняя скобка: ${text}`);
      buf += ch;
      continue;
    }

    pushText();
    const close = ch === "{" ? "}" : "]";
    const end = text.indexOf(close, i + 1);
    if (end < 0) throw new Error(`Нет «${close}»: ${text}`);
    const inner = text.slice(i + 1, end);
    if (/[{}\[\]]/.test(inner)) throw new Error(`В скобках лишняя скобка: ${text}`);

    if (ch === "{") {
      const answers = inner.split("|").map((part) => part.trim()).filter(Boolean);
      if (answers.length === 0) throw new Error(`В пропуске нет ответа: ${text}`);
      tokens.push({ type: "field", answers });
    } else {
      const hint = inner.trim();
      if (!hint) throw new Error(`Пустая подсказка: ${text}`);
      tokens.push({ type: "hint", value: hint });
    }
    i = end;
  }

  pushText();
  return tokens;
}

function detachHints(tokens) {
  const copy = tokens.map((token) => (
    token.type === "text" ? { ...token } : token
  ));
  for (let i = 0; i < copy.length; i++) {
    if (copy[i].type !== "hint") continue;
    const prev = copy[i - 1];
    const next = copy[i + 1];
    if (prev && prev.type === "text") prev.value = prev.value.replace(/\s+$/, "");
    if (next && next.type === "text") next.value = next.value.replace(/^\s+/, "");
    if (prev?.type === "text" && next?.type === "text" && prev.value && next.value) {
      prev.value += " ";
    }
  }
  return copy.filter((token) => token.type !== "hint" && !(token.type === "text" && token.value === ""));
}

function textOf(tokens) {
  return tokens.filter((token) => token.type === "text").map((token) => token.value).join("");
}

function fieldKind(tokens, index) {
  const before = textOf(tokens.slice(0, index)).trimEnd();
  const after = textOf(tokens.slice(index + 1)).trim();
  if (/[.?!]$/.test(before) && after === "") return "translation";
  return "inline";
}

function parseExerciseLine(text) {
  if (typeof text !== "string" || text.trim() === "") {
    throw new Error("Пустая строка упражнения");
  }

  const tokens = tokenize(text);
  const hints = tokens.filter((token) => token.type === "hint");
  if (hints.length > 1) throw new Error(`Подсказка одна: ${text}`);
  const body = detachHints(tokens);

  const fieldIndexes = [];
  body.forEach((token, index) => {
    if (token.type === "field") fieldIndexes.push(index);
  });
  if (fieldIndexes.length === 0) throw new Error(`Нет поля {…}: ${text}`);

  const kinds = fieldIndexes.map((index) => fieldKind(body, index));
  if (kinds.includes("inline") && kinds.includes("translation")) {
    throw new Error(`В одной строке поля одного типа: ${text}`);
  }

  const hint = hints[0]?.value;
  if (kinds[0] === "translation") {
    const ru = textOf(body.slice(0, fieldIndexes[0])).trimEnd();
    if (!ru) throw new Error(`Нет фразы перед переводом: ${text}`);
    const blanks = fieldIndexes.map((index, i) => ({
      type: "blank",
      answers: body[index].answers,
      index: i
    }));
    const parsed = { layout: "parallel", ru, blanks };
    if (hint) parsed.hint = hint;
    return parsed;
  }

  const parts = [];
  let blankCount = 0;
  for (const token of body) {
    if (token.type === "hint") continue;
    if (token.type === "text") {
      const last = parts[parts.length - 1];
      if (last && last.type === "text") last.text += token.value;
      else parts.push({ type: "text", text: token.value });
    } else {
      parts.push({ type: "blank", answers: token.answers, index: blankCount++ });
    }
  }

  const parsed = {
    layout: "inline",
    parts,
    blanks: parts.filter((part) => part.type === "blank")
  };
  if (hint) parsed.hint = hint;
  return parsed;
}

function expandExerciseItem(item, where = "пункт") {
  if (item.type !== "input" && item.type !== "select" && item.type !== "translate") {
    throw new Error(`Неизвестный тип «${item.type}» (${where})`);
  }
  if (typeof item.text !== "string") throw new Error(`Нет строки text (${where})`);

  const parsed = parseExerciseLine(item.text);
  if (item.type === "translate" && parsed.layout !== "parallel") {
    throw new Error(`Перевод пишется после предложения: ${item.text}`);
  }
  if (item.type === "input" && parsed.layout === "parallel") {
    throw new Error(`Поле после предложения — это перевод (${where})`);
  }
  if (item.type === "select") {
    if (!Array.isArray(item.options) || item.options.length === 0) {
      throw new Error(`Нет options (${where})`);
    }
    for (const blank of parsed.blanks) {
      for (const answer of blank.answers) {
        if (!item.options.includes(answer)) {
          throw new Error(`Ответ «${answer}» не входит в options (${where})`);
        }
      }
    }
  }

  const { text, ...rest } = item;
  return { ...rest, ...parsed };
}

export { parseExerciseLine, expandExerciseItem };
