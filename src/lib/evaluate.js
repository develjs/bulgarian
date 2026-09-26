function levenshtein(a, b) {
  const m = a.length, n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[m][n];
}

function normalize(str) {
  return (str || "")
    .toLowerCase()
    .replace(/[.,!?;:"'«»()„“]/g, "")
    .trim()
    .replace(/\s+/g, " ");
}

function stripAll(str) {
  return normalize(str).replace(/\s+/g, "");
}

function evaluateAnswer(userValue, answers) {
  const userNorm = normalize(userValue);
  const userStripped = stripAll(userValue);
  if (!userStripped) return { result: "wrong", bestAnswer: answers[0] };

  for (const ans of answers) {
    if (normalize(ans) === userNorm) {
      return { result: "correct", bestAnswer: ans };
    }
  }

  let bestDist = Infinity;
  let bestAnswer = answers[0];
  for (const ans of answers) {
    const ansStripped = stripAll(ans);
    const dist = levenshtein(userStripped, ansStripped);
    if (dist < bestDist) {
      bestDist = dist;
      bestAnswer = ans;
    }
  }
  const ansLen = stripAll(bestAnswer).length || 1;
  if (bestDist / ansLen <= 0.3) {
    return { result: "close", bestAnswer };
  }
  return { result: "wrong", bestAnswer };
}

export { evaluateAnswer };
