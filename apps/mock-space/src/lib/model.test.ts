import { describe, expect, it } from "vitest";
import {
  appendText,
  backspace,
  commit,
  createBox,
  isDeletable,
  pendingWord,
  setPending,
  strikeRange,
  strikeWordAt,
  type AnswerBox,
} from "./model";

const box = (over: Partial<AnswerBox> = {}): AnswerBox => ({
  id: "b1",
  page: 0,
  xPt: 10,
  yPt: 10,
  wPt: 200,
  fontSizePt: 11,
  text: "",
  struck: [],
  commitIndex: 0,
  ...over,
});

/** Types a string one character at a time, as the editor actually would. */
const type = (b: AnswerBox, s: string) => [...s].reduce(appendText, b);

describe("appendText", () => {
  it("appends at the end", () => {
    expect(type(box(), "hello").text).toBe("hello");
  });

  it("leaves the first word entirely uncommitted", () => {
    expect(type(box(), "hello").commitIndex).toBe(0);
  });

  it("commits everything once a space is typed", () => {
    const b = type(box(), "hello ");
    expect(b.commitIndex).toBe(6);
  });

  it("commits on a newline", () => {
    expect(type(box(), "a\n").commitIndex).toBe(2);
  });

  it("keeps only the trailing word uncommitted", () => {
    const b = type(box(), "hello wor");
    expect(b.commitIndex).toBe(6);
    expect(b.text.slice(b.commitIndex)).toBe("wor");
  });

  it("never moves commitIndex backwards", () => {
    // Blur commits "wor", then more typing must not un-freeze it.
    let b = type(box(), "hello wor");
    b = commit(b);
    expect(b.commitIndex).toBe(9);
    b = type(b, "ld");
    expect(b.commitIndex).toBe(9);
    expect(b.text).toBe("hello world");
  });

  it("handles a multi-character insert (IME / palette)", () => {
    const b = appendText(box({ text: "the " , commitIndex: 4 }), "答え");
    expect(b.text).toBe("the 答え");
    expect(b.commitIndex).toBe(4);
  });

  it("ignores empty inserts", () => {
    const b = box({ text: "x" });
    expect(appendText(b, "")).toBe(b);
  });
});

describe("backspace — the whole deletion guarantee", () => {
  it("deletes inside the pending word", () => {
    const b = backspace(type(box(), "hello"));
    expect(b.text).toBe("hell");
  });

  it("can erase the entire first word", () => {
    let b = type(box(), "hello");
    for (let i = 0; i < 5; i++) b = backspace(b);
    expect(b.text).toBe("");
  });

  it("stops dead at the committing space", () => {
    let b = type(box(), "hello wor");
    for (let i = 0; i < 3; i++) b = backspace(b);
    expect(b.text).toBe("hello ");
    // and further presses do nothing at all
    for (let i = 0; i < 10; i++) b = backspace(b);
    expect(b.text).toBe("hello ");
  });

  it("cannot delete the committing space itself", () => {
    const b = backspace(type(box(), "hello "));
    expect(b.text).toBe("hello ");
  });

  it("does nothing after a blur commit", () => {
    const b = backspace(commit(type(box(), "hello")));
    expect(b.text).toBe("hello");
  });

  it("does nothing on empty text", () => {
    const b = box();
    expect(backspace(b)).toBe(b);
  });

  it("cannot reach text frozen by a strike", () => {
    let b = type(box(), "the mitochondira");
    b = strikeWordAt(b, 6); // strikes "mitochondira", which commits
    b = backspace(b);
    expect(b.text).toBe("the mitochondira");
  });
});

/**
 * `setPending` is the single write the editor makes: the browser owns a textarea
 * holding just the pending word, and its contents land here. That makes the
 * append-only guarantee structural — so these tests pin it against arbitrary,
 * even hostile, input rather than against a list of events we remembered to catch.
 */
describe("setPending", () => {
  it("reports the pending word", () => {
    expect(pendingWord(type(box(), "hello wor"))).toBe("wor");
    expect(pendingWord(type(box(), "hello "))).toBe("");
    expect(pendingWord(box())).toBe("");
  });

  it("rewrites the pending word", () => {
    expect(setPending(type(box(), "hello wor"), "world").text).toBe("hello world");
  });

  it("copies committed text through untouched, whatever it is handed", () => {
    const b = type(box(), "hello wor"); // "hello " is frozen at index 6
    for (const hostile of ["", "X", "ANYTHING AT ALL", "\n\n", "évèrything"]) {
      const next = setPending(b, hostile);
      // Already-frozen text is byte-identical, and the boundary never retreats.
      // It may advance — spaces in the new pending word freeze more, which is
      // exactly what typing a space is supposed to do.
      expect(next.text.slice(0, b.commitIndex)).toBe("hello ");
      expect(next.commitIndex).toBeGreaterThanOrEqual(b.commitIndex);
    }
  });

  it("never moves commitIndex backwards", () => {
    const b = commit(type(box(), "hello world")); // everything frozen
    expect(setPending(b, "").commitIndex).toBe(11);
    expect(setPending(b, "").text).toBe("hello world");
  });

  it("commits through a word break the browser just put in", () => {
    // Typing a space is the browser inserting it into the sink; the word freezes.
    const b = setPending(type(box(), "cafe"), "cafe ");
    expect(b.commitIndex).toBe(5);
    expect(pendingWord(b)).toBe("");
  });

  it("freezes only up to the last break, keeping the remainder pending", () => {
    const b = setPending(box(), "one two three");
    expect(b.commitIndex).toBe(8);
    expect(pendingWord(b)).toBe("three");
  });

  // The macOS accent menu selects the base letter and overwrites it with a plain
  // insertText, so the sink goes "cafe" → "café" and the model simply follows.
  it("carries an accent replacement through", () => {
    expect(setPending(type(box(), "cafe"), "café").text).toBe("café");
  });

  it("leaves an accented letter as erasable as any other pending letter", () => {
    const b = setPending(type(box(), "cafe"), "café");
    expect(backspace(b).text).toBe("caf");
  });

  it("is a no-op when nothing changed", () => {
    const b = type(box(), "hello wor");
    expect(setPending(b, "wor")).toBe(b);
  });
});

describe("strike", () => {
  it("is permanent — striking twice is idempotent, and nothing un-strikes", () => {
    let b = strikeRange(type(box(), "abcdef"), 1, 3);
    b = strikeRange(b, 1, 3);
    expect(b.struck).toEqual([{ start: 1, end: 3 }]);
  });

  it("commits the pending word", () => {
    const b = strikeRange(type(box(), "hello"), 0, 2);
    expect(b.commitIndex).toBe(5);
  });

  it("clamps out-of-range indices", () => {
    const b = strikeRange(type(box(), "abc"), -5, 99);
    expect(b.struck).toEqual([{ start: 0, end: 3 }]);
  });

  it("ignores an empty range", () => {
    const b = type(box(), "abc");
    expect(strikeRange(b, 2, 2).struck).toEqual([]);
  });

  it("strikes a whole word from any index inside it", () => {
    const text = "the mitochondira is";
    for (const i of [4, 9, 15]) {
      expect(strikeWordAt(type(box(), text), i).struck).toEqual([{ start: 4, end: 16 }]);
    }
  });

  it("does nothing when the click lands on whitespace", () => {
    const b = type(box(), "a b");
    expect(strikeWordAt(b, 1).struck).toEqual([]);
  });
});

describe("isDeletable", () => {
  it("allows removing an empty box but never one with text", () => {
    expect(isDeletable(box())).toBe(true);
    expect(isDeletable(box({ text: "a" }))).toBe(false);
    // even if every character has been struck out
    expect(isDeletable(strikeRange(type(box(), "wrong"), 0, 5))).toBe(false);
  });
});

describe("createBox", () => {
  it("starts empty, uncommitted and unstruck", () => {
    const b = createBox(2, 100, 200, 300);
    expect(b).toMatchObject({ page: 2, xPt: 100, yPt: 200, wPt: 300, text: "", commitIndex: 0 });
    expect(b.struck).toEqual([]);
    expect(b.id).toMatch(/^[0-9a-f-]{36}$/);
  });
});
