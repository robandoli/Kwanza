"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const rootDir = path.join(__dirname, "../../..");

function htmlFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(dir, entry.name);
    return entry.isDirectory() ? htmlFiles(entryPath) : entry.name.endsWith(".html") ? [entryPath] : [];
  });
}

test("a política de scripts bloqueia código inline e permite os scripts necessários", () => {
  const headers = fs.readFileSync(path.join(rootDir, "static/_headers"), "utf8");
  const policy = headers.match(/^\s*Content-Security-Policy:\s*(.+)$/m)?.[1];
  assert.ok(policy, "Content-Security-Policy não encontrada");

  const scriptPolicy = policy.split(";").find((directive) => directive.trim().startsWith("script-src "));
  assert.ok(scriptPolicy, "script-src não encontrado");
  assert.match(scriptPolicy, /'self'/);
  assert.match(scriptPolicy, /https:\/\/www\.googletagmanager\.com/);
  assert.doesNotMatch(scriptPolicy, /'unsafe-inline'|'unsafe-eval'/);

  const connectPolicy = policy.split(";").find((directive) => directive.trim().startsWith("connect-src "));
  assert.ok(connectPolicy, "connect-src não encontrado");
  assert.match(connectPolicy, /https:\/\/\*\.google-analytics\.com/);
  assert.match(connectPolicy, /https:\/\/\*\.google\.com/);
});

test("templates próprios não usam scripts inline executáveis", () => {
  for (const filePath of htmlFiles(path.join(rootDir, "layouts"))) {
    const content = fs.readFileSync(filePath, "utf8");
    const scripts = content.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi);

    for (const [, attributes, body] of scripts) {
      if (/\btype\s*=\s*["']application\/ld\+json["']/i.test(attributes)) continue;
      assert.match(attributes, /\bsrc\s*=/i, `${filePath} contém script executável inline`);
      assert.equal(body.trim(), "", `${filePath} contém código dentro de uma tag de script`);
    }
  }
});
