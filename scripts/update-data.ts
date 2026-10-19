// This updater accepts a verified, permitted normalized JSON feed. The real Swedbank source adapter is not yet implemented.
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
type Fund = { id: string; name: string; currency: string; prices: { date: string; nav: number }[] };
const url = process.env.SWEDBANK_NORMALIZED_DATA_URL;
if (!url) { console.log("Skipped: SWEDBANK_NORMALIZED_DATA_URL is not configured. No sample prices will be published."); process.exit(0); }
const response = await fetch(url, { headers: { accept: "application/json" } });
if (!response.ok) throw new Error("Source returned HTTP " + response.status);
const input = await response.json() as { funds?: Fund[] };
if (!Array.isArray(input.funds)) throw new Error("Invalid feed: expected a funds array.");
const ids = new Set<string>();
const funds = input.funds.map(f => { if (!f.id || !f.name || !f.currency || !Array.isArray(f.prices)) throw new Error("Invalid fund record."); if (ids.has(f.id)) throw new Error("Duplicate fund id: " + f.id); ids.add(f.id); const dates = new Set<string>(); const prices = f.prices.map(p => { if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(p.date) || !Number.isFinite(p.nav) || p.nav <= 0) throw new Error("Invalid price for " + f.id); if (dates.has(p.date)) throw new Error("Duplicate price date for " + f.id); dates.add(p.date); return p; }).sort((a,b) => a.date.localeCompare(b.date)); return { id:f.id,name:f.name,currency:f.currency,prices }; });
const output = JSON.stringify({ updatedAt:new Date().toISOString(),sourceStatus:"configured",funds },null,2) + "\\n";
const dest = resolve("public/data/funds.json"); const temp = dest + ".tmp"; await mkdir(dirname(dest),{recursive:true}); await writeFile(temp,output,"utf8"); await rename(temp,dest); console.log("Updated " + funds.length + " funds.");