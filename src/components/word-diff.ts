export type DiffToken = {
  readonly value: string;
  readonly type: "equal" | "added" | "removed";
};

/**
 * Produces a deterministic word-level diff without normalizing either input.
 * Removing `added` tokens reconstructs the old text; removing `removed` tokens
 * reconstructs the new text.
 */
export function diffTexts(oldText: string, newText: string): DiffToken[] {
  const oldTokens = tokenize(oldText);
  const newTokens = tokenize(newText);
  const commonSuffixLengths = buildCommonSuffixLengths(oldTokens, newTokens);
  const result: DiffToken[] = [];
  let oldIndex = 0;
  let newIndex = 0;

  while (oldIndex < oldTokens.length || newIndex < newTokens.length) {
    if (
      oldIndex < oldTokens.length &&
      newIndex < newTokens.length &&
      oldTokens[oldIndex] === newTokens[newIndex]
    ) {
      result.push({ value: oldTokens[oldIndex], type: "equal" });
      oldIndex += 1;
      newIndex += 1;
      continue;
    }

    const lengthAfterRemoval = commonSuffixLengths[oldIndex + 1]?.[newIndex] ?? 0;
    const lengthAfterAddition = commonSuffixLengths[oldIndex]?.[newIndex + 1] ?? 0;

    // Prefer a removal when both paths retain an equally long subsequence.
    // This makes replacements consistently render old text before new text.
    if (oldIndex < oldTokens.length && lengthAfterRemoval >= lengthAfterAddition) {
      result.push({ value: oldTokens[oldIndex], type: "removed" });
      oldIndex += 1;
    } else if (newIndex < newTokens.length) {
      result.push({ value: newTokens[newIndex], type: "added" });
      newIndex += 1;
    }
  }

  return result;
}

function tokenize(text: string): string[] {
  return text.match(/\s+|[\p{L}\p{M}\p{N}]+(?:['’][\p{L}\p{M}\p{N}]+)*|[^\s]/gu) ?? [];
}

function buildCommonSuffixLengths(oldTokens: string[], newTokens: string[]): number[][] {
  const lengths = Array.from({ length: oldTokens.length + 1 }, () =>
    Array<number>(newTokens.length + 1).fill(0),
  );

  for (let oldIndex = oldTokens.length - 1; oldIndex >= 0; oldIndex -= 1) {
    for (let newIndex = newTokens.length - 1; newIndex >= 0; newIndex -= 1) {
      lengths[oldIndex][newIndex] =
        oldTokens[oldIndex] === newTokens[newIndex]
          ? lengths[oldIndex + 1][newIndex + 1] + 1
          : Math.max(lengths[oldIndex + 1][newIndex], lengths[oldIndex][newIndex + 1]);
    }
  }

  return lengths;
}
