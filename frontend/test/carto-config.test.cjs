const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { execFileSync } = require("node:child_process");
const { join } = require("node:path");
const { test } = require("node:test");
const vm = require("node:vm");

const source = readFileSync(
  join(__dirname, "../src/js/basemap-layer.js"),
  "utf8"
);
function style(window) {
  return vm.runInNewContext(`${source}\ngetBaseMapStyle()`, { window });
}

const specialKey = 'test-only-"\\\n&?=#</script>\u2028雪';
test("all CARTO tiles receive one encoded key; satellite stays unchanged", () => {
  const result = style({ CARTO_BASEMAP_API_KEY: specialKey });
  const tiles = result.sources["cartodb-light"].tiles;
  assert.equal(tiles.length, 4);
  for (const tile of tiles) {
    assert.ok(tile.includes("/{z}/{x}/{y}@2x.png?key="));
    const url = new URL(tile);
    assert.equal(url.searchParams.get("key"), specialKey);
    assert.equal([...url.searchParams].length, 1);
    assert.equal(url.hash, "");
  }
  assert.ok(!result.sources.satellite.tiles[0].includes("key="));
  assert.match(result.sources["cartodb-light"].attribution, /CARTO/);
});

test("missing or empty key preserves source-only local startup", () => {
  for (const window of [{}, { CARTO_BASEMAP_API_KEY: "" }]) {
    assert.ok(
      style(window).sources["cartodb-light"].tiles.every(
        (t) => !t.includes("?")
      )
    );
  }
});

test("runtime configuration loads before basemap initialization", () => {
  const html = readFileSync(join(__dirname, "../src/index.html"), "utf8");
  assert.ok(html.indexOf('src="js/runtime-config.js"') >= 0);
  assert.ok(
    html.indexOf('src="js/runtime-config.js"') <
      html.indexOf('src="js/basemap-layer.js"')
  );
});

const image = process.env.CARTO_TEST_IMAGE;
test(
  "container startup safely serializes and replaces runtime keys",
  { skip: !image },
  () => {
    for (const key of [specialKey, "rotated-test-key", ""]) {
      const config = execFileSync(
        "docker",
        [
          "run",
          "--rm",
          "-e",
          `CARTO_BASEMAP_API_KEY=${key}`,
          image,
          "sh",
          "-c",
          "cat /usr/share/nginx/html/js/runtime-config.js; export CARTO_BASEMAP_API_KEY=second-test-key; /docker-entrypoint.sh true >/dev/null; cat /usr/share/nginx/html/js/runtime-config.js",
        ],
        { encoding: "utf8" }
      );
      const lines = config
        .split("\n")
        .filter((l) => l.startsWith("window.CARTO_BASEMAP_API_KEY = "));
      assert.equal(lines.length, 2);
      const context = { window: {} };
      vm.runInNewContext(lines[0], context);
      assert.equal(context.window.CARTO_BASEMAP_API_KEY, key);
      vm.runInNewContext(lines[1], context);
      assert.equal(context.window.CARTO_BASEMAP_API_KEY, "second-test-key");
    }
  }
);
