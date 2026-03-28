import { useState, useEffect, useRef } from "react";

const GASTO_ANUAL = 229_263_000_000;
const YEAR = 2026;
const START = new Date(`${YEAR}-01-01T00:00:00`).getTime();
const END = new Date(`${YEAR + 1}-01-01T00:00:00`).getTime();
const TOTAL_MS = END - START;
const EUR_PER_MS = GASTO_ANUAL / TOTAL_MS;
const EUR_PER_SEC = EUR_PER_MS * 1000;
const EUR_PER_MIN = EUR_PER_SEC * 60;
const EUR_PER_HOUR = EUR_PER_MIN * 60;
const EUR_PER_DAY = EUR_PER_HOUR * 24;
const EUR_PER_MONTH = GASTO_ANUAL / 12;

const COMPARISONS = [
  { label: "Salarios medios anuales", value: 28_360, icon: "👤" },
  { label: "Viviendas (precio medio)", value: 195_000, icon: "🏠" },
  { label: "Coches eléctricos", value: 35_000, icon: "⚡" },
  { label: "Becas universitarias", value: 3_500, icon: "🎓" },
];

const MEGAPROJECTS = [
  {
    name: "Programa Apolo (NASA)",
    cost: 185_000_000_000,
    icon: "🚀",
    desc: "Llevar al hombre a la Luna (1961–72)",
    source: "~200.000 M$ ajustados ≈ 185.000 M€",
    color: "#f59e0b",
    gradient: "from-amber-500/10 to-orange-500/10",
    borderColor: "rgba(245,158,11,0.2)",
  },
  {
    name: "Rescate bancario español",
    cost: 100_000_000_000,
    icon: "🏦",
    desc: "Reestructuración del sistema financiero (2009–14)",
    source: "~101.500 M€ (FROB + FGD + Sareb)",
    color: "#ef4444",
    gradient: "from-red-500/10 to-rose-500/10",
    borderColor: "rgba(239,68,68,0.2)",
  },
  {
    name: "Proyecto Manhattan",
    cost: 26_000_000_000,
    icon: "☢️",
    desc: "Programa nuclear de EE.UU. (1942–46)",
    source: "~28.000 M$ ajustados ≈ 26.000 M€",
    color: "#22c55e",
    gradient: "from-green-500/10 to-emerald-500/10",
    borderColor: "rgba(34,197,94,0.2)",
  },
  {
    name: "Burj Khalifa",
    cost: 1_400_000_000,
    icon: "🏗️",
    desc: "El edificio más alto del mundo, 828 m (Dubái)",
    source: "~1.500 M$ ≈ 1.400 M€",
    color: "#3b82f6",
    gradient: "from-blue-500/10 to-cyan-500/10",
    borderColor: "rgba(59,130,246,0.2)",
  },
  {
    name: "Nuevo Santiago Bernabéu",
    cost: 1_347_000_000,
    icon: "⚽",
    desc: "Remodelación completa del estadio (2019–26)",
    source: "1.347 M€ (Real Madrid, julio 2025)",
    color: "#a855f7",
    gradient: "from-purple-500/10 to-violet-500/10",
    borderColor: "rgba(168,85,247,0.2)",
  },
];

function formatEur(n) {
  if (n < 0) return "0,00";
  const fixed = n.toFixed(2);
  const [int, dec] = fixed.split(".");
  return `${int.replace(/\B(?=(\d{3})+(?!\d))/g, ".")},${dec}`;
}

function formatCompact(n) {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1).replace(".", ",")} mil M`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1).replace(".", ",")} M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)} mil`;
  return n.toFixed(0);
}

function fmtMultiplier(v) {
  if (v >= 1000) return `${(v / 1000).toFixed(1).replace(".", ",")} mil`;
  if (v >= 100) return Math.floor(v).toLocaleString("es-ES");
  if (v >= 10) return v.toFixed(1).replace(".", ",");
  if (v >= 1) return v.toFixed(1).replace(".", ",");
  return `×${v.toFixed(2).replace(".", ",")}`;
}

function DigitGroup({ value, prevValue }) {
  const chars = value.split("");
  const prevChars = (prevValue || value).split("");
  return (
    <span style={{ display: "inline-flex" }}>
      {chars.map((ch, i) => {
        const changed = prevChars[i] !== ch;
        return (
          <span key={`${i}-${ch}`} style={{
            display: "inline-block",
            transition: ch === "." || ch === "," ? "none" : "transform 0.15s ease-out",
            transform: changed ? "translateY(-2px)" : "translateY(0)",
            fontVariantNumeric: "tabular-nums",
          }}>{ch}</span>
        );
      })}
    </span>
  );
}

function MegaCard({ project }) {
  const perDay = EUR_PER_DAY / project.cost;
  const perMonth = EUR_PER_MONTH / project.cost;
  const perYear = GASTO_ANUAL / project.cost;

  return (
    <div style={{
      background: "rgba(15,23,42,0.5)", borderRadius: "16px",
      border: `1px solid ${project.borderColor}`, padding: "20px",
      backdropFilter: "blur(10px)",
      position: "relative", overflow: "hidden",
    }}>
      {/* Subtle glow */}
      <div style={{
        position: "absolute", top: "-20px", right: "-20px",
        width: "100px", height: "100px", borderRadius: "50%",
        background: `radial-gradient(circle, ${project.color}15 0%, transparent 70%)`,
        filter: "blur(20px)", pointerEvents: "none",
      }} />

      <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", marginBottom: "16px", position: "relative" }}>
        <div style={{
          fontSize: "30px", width: "48px", height: "48px",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: `${project.color}12`, borderRadius: "12px",
          border: `1px solid ${project.color}25`, flexShrink: 0,
        }}>{project.icon}</div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: "15px", fontWeight: 700, color: "#e2e8f0" }}>{project.name}</div>
          <div style={{ fontSize: "11px", color: "#64748b", marginTop: "3px" }}>{project.desc}</div>
          <div style={{
            fontSize: "10px", color: "#475569", marginTop: "3px",
            fontFamily: "'JetBrains Mono', monospace",
          }}>{project.source}</div>
        </div>
      </div>

      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px",
        position: "relative",
      }}>
        {[
          { label: "1 día", val: perDay },
          { label: "1 mes", val: perMonth },
          { label: "1 año", val: perYear },
        ].map((item, idx) => (
          <div key={item.label} style={{
            textAlign: "center", padding: "12px 8px",
            background: "rgba(255,255,255,0.02)", borderRadius: "10px",
            border: "1px solid rgba(255,255,255,0.04)",
          }}>
            <div style={{
              fontSize: "9px", color: "#64748b", fontWeight: 600,
              textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px",
            }}>{item.label}</div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
              fontSize: item.val >= 100 ? "20px" : "18px",
              color: project.color, lineHeight: 1.2,
            }}>
              {item.val < 1 ? `${(item.val * 100).toFixed(0)}%` : fmtMultiplier(item.val)}
            </div>
            <div style={{ fontSize: "9px", color: "#475569", marginTop: "3px" }}>
              {item.val < 1 ? "de uno" : item.val < 2 ? "vez" : "veces"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PensionCounter() {
  const [currentEur, setCurrentEur] = useState(0);
  const [prevFormatted, setPrevFormatted] = useState("");
  const [progress, setProgress] = useState(0);
  const rafRef = useRef();
  const prevRef = useRef("");

  useEffect(() => {
    let last = 0;
    const tick = (ts) => {
      if (ts - last > 40) {
        const now = Date.now();
        const elapsed = Math.max(0, Math.min(now - START, TOTAL_MS));
        const eur = elapsed * EUR_PER_MS;
        const pct = (elapsed / TOTAL_MS) * 100;
        const formatted = formatEur(eur);
        setPrevFormatted(prevRef.current);
        prevRef.current = formatted;
        setCurrentEur(eur);
        setProgress(pct);
        last = ts;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const formatted = formatEur(currentEur);
  const dayOfYear = Math.floor((Date.now() - START) / 86400000) + 1;
  const daysInYear = Math.round(TOTAL_MS / 86400000);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(170deg, #0a0e17 0%, #0d1525 40%, #111d35 100%)",
      color: "#e8edf5", fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
      position: "relative", overflow: "hidden",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet" />

      <div style={{
        position: "fixed", inset: 0, opacity: 0.03,
        backgroundImage: "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
        backgroundSize: "60px 60px", pointerEvents: "none",
      }} />
      <div style={{
        position: "fixed", top: "20%", left: "50%", transform: "translateX(-50%)",
        width: "600px", height: "400px", borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(59,130,246,0.08) 0%, transparent 70%)",
        pointerEvents: "none", filter: "blur(40px)",
      }} />

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "12px" }}>
          <div style={{
            display: "inline-block", padding: "6px 16px", borderRadius: "20px",
            background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.2)",
            fontSize: "12px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "#60a5fa",
          }}>🇪🇸 Gasto en pensiones públicas · España {YEAR}</div>
        </div>

        <h1 style={{
          textAlign: "center", fontSize: "clamp(18px, 4vw, 26px)", fontWeight: 700,
          margin: "16px 0 8px", lineHeight: 1.3,
          background: "linear-gradient(135deg, #e8edf5 30%, #94a3b8)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>Contador en tiempo real</h1>
        <p style={{
          textAlign: "center", fontSize: "13px", color: "#64748b", margin: "0 0 32px",
          maxWidth: "500px", marginLeft: "auto", marginRight: "auto",
        }}>Del 1 de enero al 31 de diciembre. Estimación: {formatCompact(GASTO_ANUAL)} € anuales (proyección IVIE).</p>

        {/* Main counter */}
        <div style={{
          background: "rgba(15,23,42,0.6)", borderRadius: "20px",
          border: "1px solid rgba(59,130,246,0.15)",
          padding: "40px 24px 32px", textAlign: "center",
          backdropFilter: "blur(20px)",
          boxShadow: "0 0 80px rgba(59,130,246,0.06), inset 0 1px 0 rgba(255,255,255,0.04)",
        }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
            fontSize: "clamp(28px, 8vw, 56px)", lineHeight: 1.1,
            letterSpacing: "-0.02em", color: "#f1f5f9",
            textShadow: "0 0 40px rgba(59,130,246,0.3)",
          }}>
            <DigitGroup value={formatted} prevValue={prevFormatted} />
            <span style={{ fontSize: "0.45em", color: "#60a5fa", marginLeft: "8px", fontWeight: 600 }}>€</span>
          </div>
          <div style={{ fontSize: "12px", color: "#475569", marginTop: "16px", fontFamily: "'JetBrains Mono', monospace" }}>
            Día {dayOfYear} de {daysInYear}
          </div>
          <div style={{ marginTop: "16px", height: "4px", borderRadius: "2px", background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: "2px", width: `${progress}%`,
              background: "linear-gradient(90deg, #3b82f6, #60a5fa)",
              transition: "width 0.5s linear", boxShadow: "0 0 12px rgba(59,130,246,0.5)",
            }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#475569", marginTop: "6px", fontFamily: "'JetBrains Mono', monospace" }}>
            <span>1 ene</span><span>{progress.toFixed(2)}%</span><span>31 dic</span>
          </div>
        </div>

        {/* Speed */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px", marginTop: "20px" }}>
          {[
            { label: "Por segundo", value: EUR_PER_SEC },
            { label: "Por minuto", value: EUR_PER_MIN },
            { label: "Por hora", value: EUR_PER_HOUR },
            { label: "Por día", value: EUR_PER_DAY },
          ].map((s) => (
            <div key={s.label} style={{
              background: "rgba(15,23,42,0.5)", borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.06)", padding: "16px",
            }}>
              <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "6px", fontWeight: 500 }}>{s.label}</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, fontSize: "15px", color: "#cbd5e1" }}>
                {formatCompact(s.value)} €
              </div>
            </div>
          ))}
        </div>

        {/* Equivalences */}
        <div style={{ marginTop: "32px" }}>
          <h2 style={{ fontSize: "14px", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "14px" }}>
            Equivalencia acumulada
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
            {COMPARISONS.map((c) => (
              <div key={c.label} style={{
                background: "rgba(15,23,42,0.4)", borderRadius: "14px",
                border: "1px solid rgba(255,255,255,0.05)", padding: "18px",
                display: "flex", flexDirection: "column", gap: "8px",
              }}>
                <div style={{ fontSize: "24px" }}>{c.icon}</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: "22px", color: "#e2e8f0" }}>
                  {Math.floor(currentEur / c.value).toLocaleString("es-ES")}
                </div>
                <div style={{ fontSize: "12px", color: "#64748b", lineHeight: 1.3 }}>
                  {c.label}<br />
                  <span style={{ fontSize: "10px", color: "#475569" }}>({formatCompact(c.value)} €/ud.)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MEGA-PROJECTS */}
        <div style={{ marginTop: "44px" }}>
          <h2 style={{ fontSize: "14px", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "4px" }}>
            A escala de megaproyectos
          </h2>
          <p style={{ fontSize: "12px", color: "#475569", marginBottom: "18px", lineHeight: 1.5 }}>
            ¿Cuántas veces se podrían financiar estos hitos históricos con lo que España gasta en pensiones en un día, un mes o un año?
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {MEGAPROJECTS.map((p) => <MegaCard key={p.name} project={p} />)}
          </div>

          {/* Big summary */}
          <div style={{
            marginTop: "18px", padding: "22px 20px", borderRadius: "16px",
            background: "linear-gradient(135deg, rgba(59,130,246,0.06), rgba(168,85,247,0.06), rgba(245,158,11,0.06))",
            border: "1px solid rgba(99,102,241,0.12)",
          }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "10px" }}>
              La escala en perspectiva
            </div>
            <div style={{ fontSize: "13px", color: "#94a3b8", lineHeight: 1.8 }}>
              Con el gasto anual en pensiones de España se podrían financiar{" "}
              <strong style={{ color: "#f59e0b" }}>{(GASTO_ANUAL / 185_000_000_000).toFixed(1).replace(".",",")} programas Apolo</strong> para ir a la Luna,{" "}
              <strong style={{ color: "#ef4444" }}>{(GASTO_ANUAL / 100_000_000_000).toFixed(1).replace(".",",")} rescates bancarios</strong> como el de 2012,{" "}
              <strong style={{ color: "#22c55e" }}>{(GASTO_ANUAL / 26_000_000_000).toFixed(1).replace(".",",")} Proyectos Manhattan</strong>,{" "}
              <strong style={{ color: "#3b82f6" }}>{Math.floor(GASTO_ANUAL / 1_400_000_000)} Burj Khalifas</strong> o{" "}
              <strong style={{ color: "#a855f7" }}>{Math.floor(GASTO_ANUAL / 1_347_000_000)} estadios Bernabéu</strong>.
              <br /><br />
              Dicho de otro modo: <strong style={{ color: "#e2e8f0" }}>cada 53 minutos</strong> se gasta el equivalente a un Bernabéu.
              Cada <strong style={{ color: "#e2e8f0" }}>{Math.round(1_400_000_000 / EUR_PER_HOUR)} minutos</strong>, un Burj Khalifa.
              Y en apenas <strong style={{ color: "#e2e8f0" }}>{(26_000_000_000 / EUR_PER_DAY).toFixed(1).replace(".",",")} días</strong> se cubre todo el Proyecto Manhattan.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: "40px", paddingTop: "20px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          fontSize: "10px", color: "#374151", textAlign: "center", lineHeight: 1.7,
        }}>
          Estimación basada en la proyección del IVIE para 2026 (229.263 M€ en pensiones públicas totales).
          Incluye contributivas, no contributivas y clases pasivas. Interpolación lineal.
          <br />
          Costes: Programa Apolo ~200.000 M$ ajustados (NASA/Wikipedia); Rescate bancario ~101.500 M€ (Banco de España/FROB/Tribunal de Cuentas);
          Proyecto Manhattan ~28.000 M$ ajustados (Wikipedia); Burj Khalifa ~1.500 M$ (Sotheby's); Bernabéu 1.347 M€ (Real Madrid, jul. 2025).
          <br />
          Fuente pensiones: IVIE, Ministerio de Inclusión y Seguridad Social.
        </div>
      </div>
    </div>
  );
}
