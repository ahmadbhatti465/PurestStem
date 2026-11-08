import { Fragment, type CSSProperties } from "react";

interface AnimatedTextProps {
  text: string;
  /** "load" plays on page load, "scroll" plays as it scrolls into view. */
  mode?: "load" | "scroll";
  /** Words shown in the accent color, matched exactly. */
  accent?: string[];
  accentClassName?: string;
}

/** Splits text into words that slide up from behind a mask, one after another. */
export function AnimatedText({
  text,
  mode = "load",
  accent = [],
  accentClassName = "text-green-200",
}: AnimatedTextProps) {
  const words = text.split(" ");

  return (
    <>
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <span className="word">
            <span
              className={`${mode === "load" ? "word-in" : "word-scroll"} ${accent.includes(word) ? accentClassName : ""}`}
              style={{ "--i": index } as CSSProperties}
            >
              {word}
            </span>
          </span>
          {index < words.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </>
  );
}
