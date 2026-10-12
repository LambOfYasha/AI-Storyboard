import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { fileURLToPath } from "node:url";

test("fresh startup serves the app/scripts and denies hidden files", async () => {
  const child = spawn(process.execPath, [fileURLToPath(new URL("../scripts/serve.mjs", import.meta.url))], {
    env: { ...process.env, PORT: "0" }, stdio: ["ignore", "pipe", "pipe"],
  });
  try {
    const chunk = await Promise.race([
      once(child.stdout, "data").then(([value]) => String(value)),
      once(child, "exit").then(([code]) => { throw Error("Server exited: " + code); }),
      new Promise((_, reject) => setTimeout(() => reject(Error("Startup timed out")), 5000).unref()),
    ]);
    const url = chunk.match(/http:\/\/127\.0\.0\.1:\d+/)?.[0];
    assert.ok(url);
    const response = await fetch(url);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, /project-store\.js/);
    assert.match(html, /app\.js/);
    for (const path of ["/app.js", "/project-store.js"]) {
      const result = await fetch(url + path);
      assert.equal(result.status, 200);
      assert.match(result.headers.get("content-type"), /javascript/);
    }
    assert.equal((await fetch(url + "/.git/config")).status, 403);
  } finally {
    child.kill();
    await once(child, "exit");
  }
});
