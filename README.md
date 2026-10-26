# Swedbank Fund Charts

Ühele lehele koondatud Swedbanki fondide kuue kuu NAV-graafikud. Rakendus kasutab Reacti, TypeScripti, Vite'i ja Recharts'i ning sobib staatiliseks majutuseks näiteks Cloudflare Pagesis.

## Hetkeseis

- Minimalistlik, mobiilis kohanduv kaardipaigutus ja hinnagraafikute komponent on olemas.
- Fondide ja ajalooliste NAV-hindade automaatne import ei ole veel ühendatud.
- Rakendus ei näita väljamõeldud hindu: kuni usaldusväärne andmeimport on seadistatud, näidatakse andmeallikate linkidega selgitust.
- Fondide nimekirja allikas: https://www.swedbank.ee/private/investor/funds/allFunds
- NAV-ajaloo allikas: https://swedbankrobur.fondlista.se/en/nav

## Kohalik käivitamine

Vaja on Node.js 22 või uuemat versiooni.

    npm install
    npm run dev

## Kontroll ja build

    npm run typecheck
    npm run build

## Andmete automaatne uuendamine

GitHub Actions käivitab uuendustöövoo iga päev kell 05:17 UTC ja seda saab käivitada ka käsitsi. Skript eeldab normaliseeritud JSON-andmevoogu, mis on määratud repositooriumi Actions variable'ina `SWEDBANK_NORMALIZED_DATA_URL`. Enne selle seadistamist tuleb teostada ja kontrollida ühendus fondiloendi ning NAV-ajaloo tegeliku andmeallikaga ning kontrollida andmete taaskasutamise tingimusi.

Andmevoo kuju:

    {
      "funds": [
        {
          "id": "unique-fund-id",
          "name": "Fund name",
          "currency": "EUR",
          "prices": [
            { "date": "2026-04-20", "nav": 12.34 }
          ]
        }
      ]
    }

## Cloudflare Pages

- Build command: `npm run build`
- Build output directory: `dist`
- Node version: 22

NAV avaldatakse tavaliselt kauplemispäevadel, mitte igal kalendripäeval. Rakendus on informatiivne ega ole investeerimissoovitus.

