export type DiffToken = {
  value: string;
  type: "equal" | "added" | "removed";
};

export function diffTexts(oldText: string, newText: string): DiffToken[] {
  // Simple word-based diff algorithm
  const oldWords = normalizeAndSplit(oldText);
  const newWords = normalizeAndSplit(newText);

  const result: DiffToken[] = [];
  let i = 0;
  let j = 0;

  while (i < oldWords.length || j < newWords.length) {
    if (i >= oldWords.length) {
      // Rest are additions
      result.push({ value: newWords[j], type: "added" });
      j++;
    } else if (j >= newWords.length) {
      // Rest are removals
      result.push({ value: oldWords[i], type: "removed" });
      i++;
    } else if (oldWords[i] === newWords[j]) {
      // Same word
      result.push({ value: oldWords[i], type: "equal" });
      i++;
      j++;
    } else {
      // Look ahead to find matches
      const oldNext = oldWords.slice(i, i + 5).indexOf(newWords[j]);
      const newNext = newWords.slice(j, j + 5).indexOf(oldWords[i]);

      if (oldNext !== -1 && (newNext === -1 || oldNext < newNext)) {
        // Words were removed from old
        for (let k = 0; k < oldNext; k++) {
          result.push({ value: oldWords[i + k], type: "removed" });
        }
        i += oldNext;
      } else if (newNext !== -1) {
        // Words were added to new
        for (let k = 0; k < newNext; k++) {
          result.push({ value: newWords[j + k], type: "added" });
        }
        j += newNext;
      } else {
        // No match found nearby, treat as replacement
        result.push({ value: oldWords[i], type: "removed" });
        result.push({ value: newWords[j], type: "added" });
        i++;
        j++;
      }
    }
  }

  return result;
}

function normalizeAndSplit(text: string): string[] {
  // Normalize whitespace and split on word boundaries
  return text
    .replace(/\s+/g, " ")
    .trim()
    .split(/\b/)
    .filter((token) => token.length > 0);
}
