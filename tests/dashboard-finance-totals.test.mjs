import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

function loadTypeScriptModule(relativePath, mockedRequire = () => ({})) {
  const source = readFileSync(new URL(relativePath, import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;

  const loadedModule = { exports: {} };
  const fn = new Function("module", "exports", "require", compiled);
  fn(loadedModule, loadedModule.exports, mockedRequire);

  return loadedModule.exports;
}

function loadFinanceHelpers() {
  const dateRanges = loadTypeScriptModule("../lib/date-ranges.ts");

  return loadTypeScriptModule("../lib/finance.ts", (moduleName) => {
    if (moduleName === "@/lib/date-ranges") return dateRanges;
    if (moduleName === "@/lib/supabase") return { supabase: {} };
    return {};
  });
}

test("monthly finance totals include booking and cost periods that overlap the month", () => {
  const { calculateFinancialTotals } = loadFinanceHelpers();

  const subscriptions = [
    { price_snapshot: 100000, start_date: "2026-05-27", end_date: "2026-06-03", status: "booked" },
    { price_snapshot: 89000, start_date: "2026-06-10", end_date: "2026-06-17", status: "completed" },
    { price_snapshot: 50000, start_date: "2026-07-01", end_date: "2026-07-07", status: "booked" },
    { price_snapshot: 25000, start_date: "2026-06-01", end_date: "2026-06-02", status: "cancelled" },
  ];
  const costs = [
    { amount: 558000, period_start: "2026-05-27", period_end: "2026-06-27", status: "paid" },
    { amount: 100000, period_start: "2026-05-01", period_end: "2026-05-31", status: "paid" },
    { amount: 75000, period_start: "2026-06-01", period_end: "2026-06-30", status: "cancelled" },
  ];

  assert.deepEqual(calculateFinancialTotals(subscriptions, costs, "2026-06"), {
    totalRevenue: 189000,
    totalExpense: 558000,
    netProfit: -369000,
  });
});

test("all-time finance totals include all counted bookings and non-cancelled costs", () => {
  const { calculateFinancialTotals } = loadFinanceHelpers();

  const subscriptions = [
    { price_snapshot: 102000, start_date: "2026-05-20", end_date: "2026-05-27", status: "completed" },
    { price_snapshot: 117000, start_date: "2026-05-25", end_date: "2026-06-01", status: "booked" },
    { price_snapshot: 99000, start_date: "2026-06-01", end_date: "2026-06-08", status: "booked" },
    { price_snapshot: 50000, start_date: "2026-06-01", end_date: "2026-06-02", status: "cancelled" },
  ];
  const costs = [
    { amount: 558000, period_start: "2026-05-27", period_end: "2026-06-27", status: "paid" },
    { amount: 75000, period_start: "2026-06-01", period_end: "2026-06-30", status: "cancelled" },
  ];

  assert.deepEqual(calculateFinancialTotals(subscriptions, costs), {
    totalRevenue: 318000,
    totalExpense: 558000,
    netProfit: -240000,
  });
});
