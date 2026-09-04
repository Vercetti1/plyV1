import { createHighlighter, type Highlighter } from "shiki";

let highlighterPromise: Promise<Highlighter> | null = null;

/**
 * Shiki loads a WASM regex engine and a full TextMate grammar, far too heavy
 * to do per code block. One module-scoped promise means the highlighter is
 * created once per server process and shared by every request.
 */
function getHighlighter() {
  highlighterPromise ??= createHighlighter({
    themes: ["github-light", "github-dark-default"],
    langs: ["tsx", "typescript", "bash", "css", "json"],
  });
  return highlighterPromise;
}

export type CodeLang = "tsx" | "typescript" | "bash" | "css" | "json";

/**
 * Highlights to HTML carrying *both* themes as CSS custom properties, so
 * switching light/dark is a CSS change with no re-highlight and no flash.
 */
export async function highlight(code: string, lang: CodeLang = "tsx") {
  const highlighter = await getHighlighter();
  return highlighter.codeToHtml(code.trim(), {
    lang,
    themes: { light: "github-light", dark: "github-dark-default" },
    defaultColor: false,
    cssVariablePrefix: "--shiki-",
  });
}
