type ClassValue = string | number | null | false | undefined | ClassValue[];

/**
 * Minimal class joiner. Ply keeps its own so the library ships with zero
 * runtime dependencies. A consumer swapping in `clsx`/`tailwind-merge`
 * only has to change this file.
 */
export function cn(...inputs: ClassValue[]): string {
  const out: string[] = [];
  for (const input of inputs) {
    if (!input) continue;
    if (Array.isArray(input)) {
      const nested = cn(...input);
      if (nested) out.push(nested);
    } else {
      out.push(String(input));
    }
  }
  return out.join(" ");
}
