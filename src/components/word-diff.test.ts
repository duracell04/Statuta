import assert from "node:assert/strict";
import test from "node:test";

import { diffTexts, type DiffToken } from "./word-diff";

function reconstructOld(tokens: DiffToken[]): string {
  return tokens
    .filter((token) => token.type !== "added")
    .map((token) => token.value)
    .join("");
}

function reconstructNew(tokens: DiffToken[]): string {
  return tokens
    .filter((token) => token.type !== "removed")
    .map((token) => token.value)
    .join("");
}

test("retains equal text and marks a replacement", () => {
  const oldText = "Members vote in person.";
  const newText = "Members vote online.";
  const tokens = diffTexts(oldText, newText);

  assert.equal(reconstructOld(tokens), oldText);
  assert.equal(reconstructNew(tokens), newText);
  assert.ok(tokens.some((token) => token.type === "removed" && token.value === "in"));
  assert.ok(tokens.some((token) => token.type === "removed" && token.value === "person"));
  assert.ok(tokens.some((token) => token.type === "added" && token.value === "online"));
  assert.deepEqual(tokens.at(-1), { value: ".", type: "equal" });
});

test("marks a middle insertion without disturbing surrounding text", () => {
  assert.deepEqual(diffTexts("one two", "one new two"), [
    { value: "one", type: "equal" },
    { value: " ", type: "equal" },
    { value: "new", type: "added" },
    { value: " ", type: "added" },
    { value: "two", type: "equal" },
  ]);
});

test("marks a middle removal without disturbing surrounding text", () => {
  assert.deepEqual(diffTexts("one old two", "one two"), [
    { value: "one", type: "equal" },
    { value: " ", type: "equal" },
    { value: "old", type: "removed" },
    { value: " ", type: "removed" },
    { value: "two", type: "equal" },
  ]);
});

test("preserves punctuation, Unicode words, line breaks, and repeated whitespace", () => {
  const oldText = "Art. 21:\nMitglieder stimmen  vor Ort.";
  const newText = "Art. 21:\nMitglieder stimmen  vor Ort – oder online.";
  const tokens = diffTexts(oldText, newText);

  assert.equal(reconstructOld(tokens), oldText);
  assert.equal(reconstructNew(tokens), newText);
  assert.ok(tokens.some((token) => token.type === "added" && token.value === "–"));
  assert.ok(tokens.some((token) => token.type === "equal" && token.value === "\n"));
  assert.ok(tokens.some((token) => token.type === "equal" && token.value === "  "));
});

test("uses the full input when repeated words create multiple valid alignments", () => {
  const oldText = "alpha beta gamma alpha delta epsilon";
  const newText = "alpha gamma alpha beta delta epsilon";
  const firstRun = diffTexts(oldText, newText);
  const secondRun = diffTexts(oldText, newText);

  assert.equal(reconstructOld(firstRun), oldText);
  assert.equal(reconstructNew(firstRun), newText);
  assert.deepEqual(secondRun, firstRun);
  assert.ok(firstRun.some((token) => token.type === "removed"));
  assert.ok(firstRun.some((token) => token.type === "added"));
});

test("handles empty and identical text", () => {
  assert.deepEqual(diffTexts("", ""), []);
  assert.deepEqual(diffTexts("", "Statuta"), [{ value: "Statuta", type: "added" }]);
  assert.deepEqual(diffTexts("Statuta", ""), [{ value: "Statuta", type: "removed" }]);
  assert.deepEqual(diffTexts("Art. 14", "Art. 14"), [
    { value: "Art", type: "equal" },
    { value: ".", type: "equal" },
    { value: " ", type: "equal" },
    { value: "14", type: "equal" },
  ]);
});
