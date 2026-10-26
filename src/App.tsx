import { useEffect, useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { Fund, FundDataFile, FundPrice } from "./types";

const EMPTY: FundDataFile = { updatedAt: null, sourceStatus: "not-configured", funds: [] };
function dateLabel(value: string) {
  return new Intl.DateTimeFormat("et-EE", { day: "2-digit", month: "short" }).format(new Date(value + "T12:00:00"));
}
function money(value: number, currency: string) {
  return new Intl.NumberFormat("et-EE", { style: "currency", currency, maximumFractionDigits: 4 }).format(value);
}
function recent(prices: FundPrice[]) {
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - 6);
  return prices.filter(p => new Date(p.date + "T12:00:00") >= cutoff);
}
function FundChart({ fund }: { fund: Fund }) {
  const prices = useMemo(() => recent(fund.prices), [fund.prices]);
  const first = prices[0];
  const last = prices[prices.length - 1];
  const change = first && last ? ((last.nav / first.nav) - 1) * 100 : null;
  return <article className="fund-card">
    <div className="card-heading">
      <div className="fund-title"><h2>{fund.name}</h2><p>Osaku puhasväärtus · {fund.currency}</p></div>
      {last && <div className="latest"><strong>{money(last.nav, fund.currency)}</strong>{change !== null && <span className={change >= 0 ? "change positive" : "change negative"}>{change >= 0 ? "+" : ""}{change.toLocaleString("et-EE", { maximumFractionDigits: 2 })}% / 6 kuud</span>}</div>}
    </div>
    {prices.length < 2 ? <div className="chart-message">Selle perioodi kohta pole piisavalt ajaloolisi hindu.</div> :
      <div className="chart"><ResponsiveContainer width="100%" height="100%"><LineChart data={prices} margin={{ top: 12, right: 12, bottom: 4, left: 4 }}>
        <CartesianGrid stroke="#e7ebf0" strokeDasharray="3 3" vertical={false}/>
        <XAxis dataKey="date" tickFormatter={dateLabel} minTickGap={28} tick={{ fill: "#687386", fontSize: 11 }} axisLine={false} tickLine={false}/>
        <YAxis domain={["auto", "auto"]} width={72} tick={{ fill: "#687386", fontSize: 11 }} tickFormatter={(v: number) => new Intl.NumberFormat("et-EE", { maximumFractionDigits: 2 }).format(v)} axisLine={false} tickLine={false}/>
        <Tooltip labelFormatter={label => dateLabel(String(label))} formatter={value => [money(Number(value), fund.currency), "NAV"]}/>
        <Line type="monotone" dataKey="nav" stroke="#087f8c" strokeWidth={2} dot={false} activeDot={{ r: 4 }} isAnimationActive={false}/>
      </LineChart></ResponsiveContainer></div>}
    <p className="footnote">{prices.length ? "Periood: " + dateLabel(first.date) + " – " + dateLabel(last.date) : "Andmed pole saadaval"}</p>
  </article>;
}
export default function App() {
  const [data, setData] = useState<FundDataFile>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    fetch(import.meta.env.BASE_URL + "data/funds.json")
      .then(r => { if (!r.ok) throw new Error("load failed"); return r.json() as Promise<FundDataFile>; })
      .then(setData).catch(() => setError(true)).finally(() => setLoading(false));
  }, []);
  const funds = useMemo(() => [...data.funds].sort((a, b) => a.name.localeCompare(b.name, "et")), [data.funds]);
  return <main className="page">
    <header className="site-header">
      <div className="eyebrow"><span className="eyebrow-dot"/> FONDIANDMED</div>
      <h1>Swedbanki fondid,<br/><span>kuue kuu vaates.</span></h1>
      <p className="intro">Kõigi fondide osaku puhasväärtuse (NAV) ajaloolised hinnad ühel lehel. Minimalistlik ülevaade, ilma otsingu ja liigse mürata.</p>
      <div className="header-meta"><span><i className="status-dot"/> Kuue kuu hinnalugu</span><span>{data.updatedAt ? "Andmed uuendatud " + new Date(data.updatedAt).toLocaleString("et-EE") : "Andmete uuendamise aeg pole veel teada"}</span></div>
    </header>
    {loading && <p className="notice">Laadin fondide andmeid…</p>}
    {error && <p className="notice error" role="alert">Fondide andmeid ei saanud laadida. Proovi hiljem uuesti.</p>}
    {!loading && !error && funds.length === 0 && <section className="empty">
      <div className="empty-icon" aria-hidden="true">↗</div>
      <p className="empty-kicker">JÄRGMINE SAMM</p>
      <h2>Andmeallikas vajab ühendamist</h2>
      <p>Lehe kujundus ja graafikute komponent on valmis. Tegelikke kuue kuu hinnagraafikuid ei saa veel näidata, sest fondide loendi ja NAV-ajaloo automaatne import pole ühendatud. Finantsandmete täpsuse hoidmiseks ei kuvata siin näidis- ega väljamõeldud hindu.</p>
      <div className="source-links">
        <a href="https://www.swedbank.ee/private/investor/funds/allFunds" target="_blank" rel="noreferrer"><span>01</span><div><strong>Swedbanki fondide nimekiri</strong><small>Fondide nimed ja saadaval olevad fondid</small></div><b>↗</b></a>
        <a href="https://swedbankrobur.fondlista.se/en/nav" target="_blank" rel="noreferrer"><span>02</span><div><strong>Swedbank Robur NAV ajalugu</strong><small>Ajaloolised osakuhinnad</small></div><b>↗</b></a>
      </div>
    </section>}
    {funds.length > 0 && <><div className="section-label"><span>KÕIK FONDID</span><strong>{funds.length} fondi</strong></div><section className="fund-grid" aria-label="Kõik fondide graafikud">{funds.map(f => <FundChart key={f.id} fund={f}/>)}</section></>}
    <footer><span>NAV = osaku puhasväärtus.</span><span>Andmed on informatiivsed ega ole investeerimissoovitus.</span></footer>
  </main>;
}
