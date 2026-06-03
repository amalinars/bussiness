import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

function loadDateRangeHelpers() {
  const source = readFileSync(new URL("../lib/date-ranges.ts", import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;

  const loadedModule = { exports: {} };
  const fn = new Function("module", "exports", compiled);
  fn(loadedModule, loadedModule.exports);

  return loadedModule.exports;
}

test("isDateRangeOverlapping includes costs that started before the month and still cover it", () => {
  const { isDateRangeOverlapping } = loadDateRangeHelpers();

  assert.equal(isDateRangeOverlapping("2026-05-25", "2026-06-24", "2026-06-01", "2026-06-30"), true);
});

test("isDateRangeOverlapping excludes costs that ended before the month starts", () => {
  const { isDateRangeOverlapping } = loadDateRangeHelpers();

  assert.equal(isDateRangeOverlapping("2026-05-01", "2026-05-31", "2026-06-01", "2026-06-30"), false);
});

test("isDateInRange only includes payment dates inside the month", () => {
  const { isDateInRange } = loadDateRangeHelpers();

  assert.equal(isDateInRange("2026-05-31", "2026-06-01", "2026-06-30"), false);
  assert.equal(isDateInRange("2026-06-01", "2026-06-01", "2026-06-30"), true);
});

test("getMonthRangeForDateInTimeZone uses the Jakarta calendar month at local month boundaries", () => {
  const { getMonthRangeForDateInTimeZone } = loadDateRangeHelpers();

  assert.deepEqual(getMonthRangeForDateInTimeZone(new Date("2026-05-31T17:30:00.000Z"), "Asia/Jakarta"), {
    monthStart: "2026-06-01",
    monthEnd: "2026-06-30",
  });
});

test("addDaysToDateOnly advances calendar dates without depending on server timezone", () => {
  const { addDaysToDateOnly } = loadDateRangeHelpers();

  assert.equal(addDaysToDateOnly("2026-06-29", 3), "2026-07-02");
});

test("getMonthRangeForMonthKey returns the full selected calendar month", () => {
  const { getMonthRangeForMonthKey } = loadDateRangeHelpers();

  assert.deepEqual(getMonthRangeForMonthKey("2026-06"), {
    monthStart: "2026-06-01",
    monthEnd: "2026-06-30",
  });
});

test("getMonthKeysTouchedByDateRange includes every month touched by a covered period", () => {
  const { getMonthKeysTouchedByDateRange } = loadDateRangeHelpers();

  assert.deepEqual(getMonthKeysTouchedByDateRange("2026-05-27", "2026-07-02"), [
    "2026-05",
    "2026-06",
    "2026-07",
  ]);
});
