# Swedbank Fund Charts

A lightweight public website displaying every configured fund's six-month NAV history on one page.

## Stack

- React + TypeScript + Vite
- Recharts
- JSON data files
- Node.js + TypeScript update script
- GitHub Actions daily workflow
- Cloudflare Pages static hosting

## Status

The initial frontend scaffold is in place. The actual Swedbank data-source adapter has not yet been implemented. The app intentionally displays an empty state rather than fabricated financial prices. Before publishing real data, verify source endpoints, data completeness, access terms and permission to republish data.

The update script expects a normalized JSON feed configured using the repository Actions variable SWEDBANK_NORMALIZED_DATA_URL. The feed shape is an object with a funds array; each fund has id, name, currency and prices, where each price has an ISO date and numeric nav value. If the variable is unset, the update job safely skips data updates.

## Local development

Requires Node.js 22 or later.

    npm install
    npm run dev

## Build

    npm run typecheck
    npm run build

## Daily update

GitHub Actions runs daily at 05:17 UTC and can also be started manually in the Actions tab. Configure SWEDBANK_NORMALIZED_DATA_URL only after the actual source adapter and its permitted use have been verified.

## Cloudflare Pages

Import this repository into Cloudflare Pages. Use framework preset Vite, build command npm run build, and output directory dist. No always-on backend or Pages Functions are required for the static frontend.

NAV is generally published on dealing days, not every calendar day. This website is informational and is not investment advice.
