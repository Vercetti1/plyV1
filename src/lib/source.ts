import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Reads a source file off disk at render time. The docs therefore display the
 * exact file that produced the live preview above it, impossible to leave
 * stale, unlike a hand-copied snippet.
 *
 * Both readers run only during the prerender pass, since every docs route is
 * statically generated.
 */

const DEMOS_DIR = path.join(process.cwd(), "src", "registry", "demos");
const LIBRARY_DIR = path.join(process.cwd(), "src", "lib", "ply");

/**
 * Rejects anything but plain `dir/file` segments. Validating the input is
 * cheaper and stricter than resolving the path and comparing prefixes: it
 * refuses `..`, absolute paths and backslashes before touching the disk.
 */
const SAFE_RELATIVE = /^[a-z0-9][a-z0-9-]*(\/[a-z0-9][a-z0-9-]*)*\.(tsx|ts)$/;

function assertSafe(relative: string) {
  if (!SAFE_RELATIVE.test(relative)) {
    throw new Error(`Unsafe source path: ${relative}`);
  }
  return relative;
}

export function readDemoSource(id: string) {
  return readFile(path.join(DEMOS_DIR, assertSafe(`${id}.tsx`)), "utf8");
}

export function readLibrarySource(relative: string) {
  return readFile(path.join(LIBRARY_DIR, assertSafe(relative)), "utf8");
}
