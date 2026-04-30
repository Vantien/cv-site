import { useState, useEffect, useRef, useCallback } from "react";

const SECTIONS = [
  { id: "hero", label: "Accueil" },
  { id: "exp", label: "Expériences" },
  { id: "skills", label: "Compétences" },
  { id: "education", label: "Formation" },
  { id: "interests", label: "Intérêts" },
  { id: "contact", label: "Contact" },
];

/* ─── DATA ─── */
const DATA = {
  name: "Van Tien",
  role: "Développeur Front-End Senior | Vue.js",
  stack: "Vue.js 3 · TypeScript",
  location: "Rennes, France",
  email: "van-tien.nguyen@hotmail.fr",
  phone: "07 70 80 70 88",
  availability: "Full remote · Hybride · Présentiel sur Rennes & alentours",
  bio: "Après plus de 8 ans d'expérience en développement front-end à Paris, je m'installe à Rennes avec l'envie de m'investir dans de nouveaux projets ambitieux. Soucieux de la qualité du code et de l'expérience utilisateur, je recherche une équipe bienveillante où l'exigence technique est une valeur partagée. Disponible en full remote, en hybride, ou en présentiel sur Rennes et ses alentours.",
  techPills: [
    { name: "Vue 3", devicon: "vuejs-plain", color: "#42b883" },
    { name: "TypeScript", devicon: "typescript-plain", color: "#3178C6" },
    { name: "Nuxt.js", devicon: "nuxtjs-plain", color: "#00DC82" },
    { name: "GraphQL", devicon: "graphql-plain", color: "#E10098" },
    { name: "Vite", devicon: "vitejs-plain", color: "#646CFF" },
    { name: "Docker", devicon: "docker-plain", color: "#2496ED" },
  ],
  stats: [
    { label: "Années d'XP", value: "8+" },
    { label: "Stack principal", value: "Vue 3" },
    { label: "Hybride & Remote", value: "Flex" },
  ],
  experiences: [
    {
      id: 1, role: "Développeur Front-End", company: "Accor", location: "Issy-les-Moulineaux",
      period: "12/2021 — 11/2025", color: "#06B6D4",
      highlights: [
        "Migration Vue 2 → Vue 3, modernisation de l'architecture front-end",
        "Intégration pages compte client : réservation hôtel, fidélité, souscriptions",
        "Librairie de composants partagée entre plusieurs applicatifs",
        "Tests unitaires Vitest & E2E Playwright sur les parcours critiques",
        "Contribution CI/CD : build, tests, analyse Sonar, déploiement",
      ],
    },
    {
      id: 2, role: "Développeur Front-End", company: "Valtech", location: "Paris",
      period: "04/2021 — 09/2021", color: "#A78BFA",
      highlights: [
        "Correction des problèmes d'affichage et amélioration de l'ergonomie UX",
      ],
    },
    {
      id: 3, role: "Développeur Front-End", company: "Maisons du Monde", location: "Paris",
      period: "03/2018 — 04/2021", color: "#22D3EE",
      highlights: [
        "Nouvelles fonctionnalités marketplace Magento : auth, compte client, historique commandes",
        "Refonte compte client Vue.js avec Apollo GraphQL",
        "Site e-commerce Nuxt/Vue.js en Scrum, suivi GitLab & revues de code",
        "Composants Atomic Design intégrés dans Storybook et Prismic",
      ],
    },
    {
      id: 4, role: "Développeur Fullstack", company: "Sedna System", location: "Suresnes",
      period: "04/2015 — 01/2017", color: "#F59E0B",
      highlights: [
        "Mise à jour d'un progiciel de gestion de bateaux, UX et fonctionnalités",
        "Maintenance WordPress, support technique et documentation",
      ],
    },
  ],
  skills: [
    { name: "Vue.js 3", devicon: "vuejs-plain", color: "#42b883" },
    { name: "Nuxt.js", devicon: "nuxtjs-plain", color: "#00DC82" },
    { name: "TypeScript", devicon: "typescript-plain", color: "#3178C6" },
    { name: "Sass / BEM", devicon: "sass-plain", color: "#CC6699" },
    { name: "Vite", devicon: "vitejs-plain", color: "#646CFF" },
    { name: "Webpack", devicon: "webpack-plain", color: "#8DD6F9" },
    { name: "Storybook", devicon: "storybook-plain", color: "#FF4785" },
    { name: "GraphQL", devicon: "graphql-plain", color: "#E10098" },
    { name: "Vitest", devicon: null, color: "#6E9F18" },
    { name: "Playwright", devicon: null, color: "#45ba4b" },
    { name: "GitLab CI/CD", devicon: "gitlab-plain", color: "#FC6D26" },
    { name: "Docker", devicon: "docker-plain", color: "#2496ED" },
    { name: "Figma", devicon: "figma-plain", color: "#F24E1E" },
    { name: "ESLint", devicon: "eslint-plain", color: "#4B32C3" },
  ],
  education: [
    {
      degree: "Titre RNCP Concepteur développeur informatique",
      school: "Webitech, Paris",
      period: "09/2015 — 09/2016",
    },
    {
      degree: "Licence Informatique",
      school: "UVSQ — Université de Versailles Saint-Quentin-en-Yvelines",
      period: "09/2014 — 12/2015",
    },
    {
      degree: "DUT Informatique",
      school: "IUT de Belfort-Montbéliard",
      period: "09/2011 — 09/2013",
    },
  ],
  interests: [
    { emoji: "🧗", label: "Escalade / Voyage" },
    { emoji: "🎮", label: "Jeux vidéos" },
    { emoji: "📺", label: "Séries / Mangas" },
  ],
};

/* ─── SCROLL REVEAL ─── */
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ─── SCROLL POSITION ─── */
function useScrolled(threshold = 80) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > threshold);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [threshold]);
  return scrolled;
}

/* ─── TOP NAV ─── */
function TopNav({ scrolled, email }) {
  const [hover, setHover] = useState(false);
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
      padding: "0 40px", height: "56px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: scrolled ? "rgba(7,9,14,0.88)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
      opacity: scrolled ? 1 : 0,
      pointerEvents: scrolled ? "auto" : "none",
      transition: "all 0.4s cubic-bezier(0.22,1,0.36,1)",
    }}>
      <span style={{
        fontFamily: "var(--f-display)", fontWeight: 700, fontSize: "15px",
        letterSpacing: "-0.02em", color: "var(--c-text)",
      }}>
        Van Tien <span style={{ color: "var(--c-accent)" }}>NGUYEN</span>
      </span>
      <a
        href={`mailto:${email}`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          padding: "7px 18px", borderRadius: "8px", fontSize: "12px",
          fontFamily: "var(--f-mono)", fontWeight: 600, letterSpacing: "0.02em",
          background: hover ? "var(--c-accent2)" : "var(--c-accent)",
          color: "#07090E", textDecoration: "none", transition: "background 0.2s",
        }}
      >Me contacter →</a>
    </nav>
  );
}

/* ─── TECH PILL ─── */
function TechPill({ pill, delay }) {
  const [hover, setHover] = useState(false);
  return (
    <span
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: "6px",
        padding: "6px 12px", borderRadius: "100px",
        background: hover ? `${pill.color}18` : "var(--c-surface)",
        border: `1px solid ${hover ? pill.color + "55" : "var(--c-border)"}`,
        fontSize: "12px", fontFamily: "var(--f-mono)",
        color: hover ? pill.color : "var(--c-muted)",
        transition: "all 0.25s ease", cursor: "default",
        animation: `fadeUp 0.5s ease ${delay}s both`,
      }}
    >
      <i className={`devicon-${pill.devicon} colored`} style={{ fontSize: "14px" }} />
      {pill.name}
    </span>
  );
}

/* ─── SKILL CARD ─── */
function SkillCard({ skill, index }) {
  const [ref, visible] = useReveal(0.05);
  const [hover, setHover] = useState(false);
  return (
    <div
      ref={ref}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", gap: "10px",
        padding: "22px 12px", borderRadius: "14px", textAlign: "center",
        background: hover ? `${skill.color}10` : "var(--c-surface)",
        border: `1px solid ${hover ? skill.color + "40" : "var(--c-border)"}`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.93)",
        transition: `all 0.45s cubic-bezier(0.22,1,0.36,1) ${index * 0.05}s`,
        cursor: "default",
      }}
    >
      {skill.devicon ? (
        <i
          className={`devicon-${skill.devicon} colored`}
          style={{
            fontSize: "34px",
            transform: hover ? "scale(1.2) translateY(-2px)" : "scale(1)",
            transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1)",
            display: "block",
          }}
        />
      ) : (
        <div style={{
          width: "34px", height: "34px", borderRadius: "10px",
          background: `${skill.color}18`, border: `1px solid ${skill.color}35`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "11px", fontWeight: 700, fontFamily: "var(--f-mono)", color: skill.color,
          transform: hover ? "scale(1.2) translateY(-2px)" : "scale(1)",
          transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1)",
        }}>
          {skill.name.slice(0, 2).toUpperCase()}
        </div>
      )}
      <span style={{
        fontSize: "11px", fontFamily: "var(--f-body)", fontWeight: 500, lineHeight: 1.3,
        color: hover ? "var(--c-text)" : "var(--c-muted)",
        transition: "color 0.2s",
      }}>{skill.name}</span>
    </div>
  );
}

/* ─── EXPERIENCE CARD ─── */
function ExpCard({ exp, index }) {
  const [ref, visible] = useReveal(0.1);
  const [hover, setHover] = useState(false);
  return (
    <div
      ref={ref}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative", padding: "26px 28px 26px 28px", borderRadius: "16px",
        background: hover ? "var(--c-surface-hover)" : "var(--c-surface)",
        border: `1px solid ${hover ? exp.color + "44" : "var(--c-border)"}`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(32px) scale(0.97)",
        transition: `all 0.6s cubic-bezier(0.22,1,0.36,1) ${index * 0.12}s`,
        cursor: "default", overflow: "hidden",
      }}
    >
      <div style={{
        position: "absolute", top: 0, left: 0, width: "3px", height: "100%",
        background: exp.color, borderRadius: "16px 0 0 16px",
        opacity: hover ? 1 : 0.5, transition: "opacity 0.3s",
      }} />
      <div style={{
        position: "absolute", top: "-40%", right: "-20%", width: "280px", height: "280px",
        borderRadius: "50%", background: `radial-gradient(circle, ${exp.color}08, transparent 70%)`,
        opacity: hover ? 1 : 0, transition: "opacity 0.5s", pointerEvents: "none",
      }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px", marginBottom: "14px" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: "var(--c-text)", fontFamily: "var(--f-display)" }}>{exp.role}</h3>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "3px" }}>
              <span style={{ fontFamily: "var(--f-mono)", fontSize: "13px", color: exp.color, fontWeight: 500 }}>{exp.company}</span>
              <span style={{ fontSize: "11px", color: "var(--c-muted)", fontFamily: "var(--f-mono)" }}>· {exp.location}</span>
            </div>
          </div>
          <span style={{
            padding: "3px 10px", borderRadius: "100px", fontSize: "11px",
            fontFamily: "var(--f-mono)", background: exp.color + "12", color: exp.color,
            border: `1px solid ${exp.color}25`, whiteSpace: "nowrap",
          }}>{exp.period}</span>
        </div>
        {exp.highlights.map((h, i) => (
          <div key={i} style={{
            display: "flex", gap: "10px", marginBottom: "6px",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateX(0)" : "translateX(16px)",
            transition: `all 0.4s ease ${0.25 + i * 0.07}s`,
          }}>
            <span style={{ color: exp.color, fontSize: "13px", lineHeight: "22px", flexShrink: 0 }}>›</span>
            <span style={{ fontSize: "13px", color: "var(--c-muted)", lineHeight: "22px" }}>{h}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── NAV DOTS ─── */
function NavDots({ sections, active }) {
  return (
    <div style={{
      position: "fixed", right: "24px", top: "50%", transform: "translateY(-50%)",
      display: "flex", flexDirection: "column", gap: "12px", zIndex: 100,
    }}>
      {sections.map((s, i) => (
        <a key={s.id} href={`#${s.id}`} title={s.label} style={{ textDecoration: "none" }}
          onClick={(e) => { e.preventDefault(); document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" }); }}>
          <div style={{
            width: active === i ? "24px" : "8px", height: "8px", borderRadius: "4px",
            background: active === i ? "var(--c-accent)" : "var(--c-muted)",
            opacity: active === i ? 1 : 0.35,
            transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)",
            boxShadow: active === i ? "0 0 12px var(--c-accent)" : "none",
          }} />
        </a>
      ))}
    </div>
  );
}

/* ─── COPY BUTTON ─── */
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => false);
  };
  return (
    <button onClick={handleCopy} style={{
      padding: "3px 10px", borderRadius: "6px", fontSize: "11px",
      fontFamily: "var(--f-mono)", cursor: "pointer", marginLeft: "10px",
      background: copied ? "rgba(6,182,212,0.12)" : "var(--c-surface)",
      color: copied ? "var(--c-accent)" : "var(--c-muted)",
      border: `1px solid ${copied ? "rgba(6,182,212,0.3)" : "rgba(255,255,255,0.06)"}`,
      transition: "all 0.2s ease",
    }}>{copied ? "✓ Copié" : "Copier"}</button>
  );
}

/* ─── MAIN ─── */
export default function CVSite() {
  const d = DATA;
  const [activeSection, setActiveSection] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const scrolled = useScrolled(80);

  const handleMouse = useCallback((e) => setMousePos({ x: e.clientX, y: e.clientY }), []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, [handleMouse]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = SECTIONS.findIndex((s) => s.id === e.target.id);
            if (idx !== -1) setActiveSection(idx);
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
    );
    SECTIONS.forEach((s) => { const el = document.getElementById(s.id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--c-bg)", color: "var(--c-text)", fontFamily: "var(--f-body)", lineHeight: 1.6, position: "relative", overflow: "hidden" }}>

      <TopNav scrolled={scrolled} email={d.email} />

      {/* Grain */}
      <div style={{
        position: "fixed", inset: "-50%", width: "200%", height: "200%",
        background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
        opacity: 0.5, pointerEvents: "none", zIndex: 1000, animation: "grain 8s steps(10) infinite",
      }} />

      {/* Cursor glow */}
      <div style={{
        position: "fixed", left: mousePos.x - 200, top: mousePos.y - 200,
        width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(6,182,212,0.06), transparent 70%)",
        pointerEvents: "none", zIndex: 0, transition: "left 0.3s ease, top 0.3s ease",
      }} />

      {/* Orbs */}
      <div style={{ position: "fixed", top: "10%", left: "5%", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(6,182,212,0.04), transparent)", animation: "float 8s ease-in-out infinite", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: "15%", right: "8%", width: "350px", height: "350px", borderRadius: "50%", background: "radial-gradient(circle, rgba(34,211,238,0.03), transparent)", animation: "float 10s ease-in-out infinite 2s", pointerEvents: "none" }} />

      <NavDots sections={SECTIONS} active={activeSection} />

      <div style={{ maxWidth: "820px", margin: "0 auto", padding: "0 32px", position: "relative", zIndex: 1 }}>

        {/* ═══ HERO ═══ */}
        <section id="hero" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative" }}>

          <div style={{ animation: "fadeUp 0.6s ease both", marginBottom: "28px" }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "6px 16px", borderRadius: "100px", fontSize: "12px",
              fontFamily: "var(--f-mono)", background: "rgba(6,182,212,0.1)",
              color: "#06B6D4", border: "1px solid rgba(6,182,212,0.2)",
            }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#06B6D4", boxShadow: "0 0 8px #06B6D4", animation: "blink 2s infinite" }} />
              Disponible pour une nouvelle opportunité
            </span>
          </div>

          <h1 style={{
            fontSize: "clamp(36px, 7vw, 64px)", fontFamily: "var(--f-display)", fontWeight: 800,
            letterSpacing: "-0.04em", lineHeight: 1,
            background: "linear-gradient(135deg, var(--c-text) 0%, var(--c-muted) 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            animation: "fadeUp 0.6s ease 0.1s both", marginBottom: "6px",
          }}>
            {d.name}<span style={{ WebkitTextFillColor: "var(--c-accent)" }}>.</span>
          </h1>

          <h2 style={{
            fontSize: "clamp(17px, 2.5vw, 22px)", fontFamily: "var(--f-serif)", fontWeight: 400,
            fontStyle: "italic", color: "var(--c-muted)", animation: "fadeUp 0.6s ease 0.2s both", marginBottom: "10px",
          }}>{d.role}</h2>

          <div style={{ animation: "fadeUp 0.6s ease 0.3s both", marginBottom: "28px" }}>
            <span style={{ fontFamily: "var(--f-mono)", fontSize: "14px", color: "var(--c-accent)", padding: "2px 0", borderBottom: "1px dashed var(--c-accent)" }}>
              {d.stack}
            </span>
          </div>

          <p style={{
            fontSize: "15px", color: "var(--c-muted)", maxWidth: "520px",
            lineHeight: 1.85, animation: "fadeUp 0.6s ease 0.4s both", marginBottom: "32px",
          }}>{d.bio}</p>

          {/* Tech pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "48px" }}>
            {d.techPills.map((pill, i) => (
              <TechPill key={pill.name} pill={pill} delay={0.5 + i * 0.07} />
            ))}
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: "40px", flexWrap: "wrap", animation: "fadeUp 0.6s ease 0.95s both" }}>
            {d.stats.map((s, i) => (
              <div key={i}>
                <div style={{
                  fontSize: "30px", fontFamily: "var(--f-display)", fontWeight: 700, lineHeight: 1,
                  background: "linear-gradient(135deg, var(--c-accent), var(--c-accent2))",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                }}>{s.value}</div>
                <div style={{ fontSize: "11px", fontFamily: "var(--f-mono)", color: "var(--c-muted)", marginTop: "4px", textTransform: "uppercase", letterSpacing: "0.12em" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Scroll hint */}
          <div style={{
            marginTop: "auto", paddingTop: "48px", paddingBottom: "32px",
            display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
            animation: "fadeUp 0.6s ease 1.1s both",
          }}>
            <span style={{ fontSize: "10px", fontFamily: "var(--f-mono)", color: "var(--c-muted)", letterSpacing: "0.15em", textTransform: "uppercase" }}>Scroll</span>
            <div style={{ width: "1px", height: "28px", background: "linear-gradient(to bottom, var(--c-accent), transparent)", animation: "float 2s ease-in-out infinite" }} />
          </div>
        </section>

        {/* ═══ EXPÉRIENCES ═══ */}
        <section id="exp" style={{ paddingTop: "80px", paddingBottom: "80px" }}>
          <SectionHeader number="01" title="Expériences" subtitle="Parcours professionnel" />
          <div>
            {d.experiences.map((exp, i) => (
              <div key={exp.id} style={{ display: "flex", alignItems: "flex-start" }}>
                {/* Timeline */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "32px", flexShrink: 0, paddingTop: "28px" }}>
                  <div style={{
                    width: "10px", height: "10px", borderRadius: "50%", flexShrink: 0,
                    background: exp.color, boxShadow: `0 0 10px ${exp.color}90`,
                    border: "2px solid #07090E",
                  }} />
                  {i < d.experiences.length - 1 && (
                    <div style={{
                      width: "2px", flex: 1, marginTop: "6px", minHeight: "32px",
                      background: `linear-gradient(to bottom, ${exp.color}35, rgba(6,182,212,0.04))`,
                    }} />
                  )}
                </div>
                {/* Card */}
                <div style={{ flex: 1, paddingBottom: i < d.experiences.length - 1 ? "20px" : 0 }}>
                  <ExpCard exp={exp} index={i} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ COMPÉTENCES ═══ */}
        <section id="skills" style={{ paddingTop: "80px", paddingBottom: "80px" }}>
          <SectionHeader number="02" title="Compétences" subtitle="Stack technique" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: "12px" }}>
            {d.skills.map((s, i) => (
              <SkillCard key={s.name} skill={s} index={i} />
            ))}
          </div>
        </section>

        {/* ═══ FORMATION ═══ */}
        <section id="education" style={{ paddingTop: "80px", paddingBottom: "80px" }}>
          <SectionHeader number="03" title="Formation" subtitle="Diplômes & parcours académique" />
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {d.education.map((edu, i) => (
              <EducationCard key={i} edu={edu} index={i} />
            ))}
          </div>
        </section>

        {/* ═══ PASSIONS ═══ */}
        <section id="interests" style={{ paddingTop: "80px", paddingBottom: "80px" }}>
          <SectionHeader number="04" title="Passions" subtitle="Au-delà du code" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px" }}>
            {d.interests.map((item, i) => (
              <InterestCard key={i} item={item} index={i} />
            ))}
          </div>
        </section>

        {/* ═══ CONTACT ═══ */}
        <section id="contact" style={{ paddingTop: "80px", paddingBottom: "100px" }}>
          <SectionHeader number="05" title="Contact" subtitle="Travaillons ensemble" />
          <ContactBlock data={d} />
        </section>
      </div>
    </div>
  );
}

/* ─── SECTION HEADER ─── */
function SectionHeader({ number, title, subtitle }) {
  const [ref, visible] = useReveal(0.2);
  return (
    <div ref={ref} style={{ marginBottom: "40px", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: "all 0.5s ease" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "4px" }}>
        <span style={{ fontFamily: "var(--f-mono)", fontSize: "13px", color: "var(--c-accent)", fontWeight: 500 }}>{number}</span>
        <h2 style={{ fontSize: "clamp(26px, 4vw, 38px)", fontFamily: "var(--f-display)", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--c-text)" }}>{title}</h2>
      </div>
      <p style={{ fontFamily: "var(--f-serif)", fontStyle: "italic", fontSize: "14px", color: "var(--c-muted)", marginLeft: "34px" }}>{subtitle}</p>
    </div>
  );
}

/* ─── EDUCATION CARD ─── */
function EducationCard({ edu, index }) {
  const [ref, visible] = useReveal(0.15);
  return (
    <div ref={ref} style={{
      display: "flex", justifyContent: "space-between", alignItems: "flex-start",
      flexWrap: "wrap", gap: "8px", padding: "20px 24px", borderRadius: "12px",
      background: "var(--c-surface)", border: "1px solid var(--c-border)",
      opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)",
      transition: `all 0.5s cubic-bezier(0.22,1,0.36,1) ${index * 0.12}s`,
    }}>
      <div>
        <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--c-text)", fontFamily: "var(--f-display)", marginBottom: "4px" }}>{edu.degree}</div>
        <div style={{ fontSize: "12px", fontFamily: "var(--f-mono)", color: "var(--c-muted)" }}>{edu.school}</div>
      </div>
      <span style={{
        padding: "3px 10px", borderRadius: "100px", fontSize: "11px", whiteSpace: "nowrap",
        fontFamily: "var(--f-mono)", background: "rgba(6,182,212,0.08)",
        color: "var(--c-accent)", border: "1px solid rgba(6,182,212,0.15)",
      }}>{edu.period}</span>
    </div>
  );
}

/* ─── INTEREST CARD ─── */
function InterestCard({ item, index }) {
  const [ref, visible] = useReveal(0.2);
  const [hover, setHover] = useState(false);
  return (
    <div ref={ref} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        padding: "28px 24px", borderRadius: "16px", textAlign: "center",
        background: hover ? "var(--c-surface-hover)" : "var(--c-surface)",
        border: `1px solid ${hover ? "rgba(6,182,212,0.3)" : "var(--c-border)"}`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(30px) scale(0.95)",
        transition: `all 0.5s cubic-bezier(0.22,1,0.36,1) ${index * 0.1}s`,
        cursor: "default",
      }}>
      <div style={{
        fontSize: "32px", marginBottom: "12px",
        transform: hover ? "scale(1.2) rotate(-5deg)" : "scale(1)",
        transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1)",
      }}>{item.emoji}</div>
      <div style={{ fontFamily: "var(--f-body)", fontSize: "14px", color: "var(--c-text)", fontWeight: 500 }}>{item.label}</div>
    </div>
  );
}

/* ─── CONTACT BLOCK ─── */
function ContactBlock({ data }) {
  const [ref, visible] = useReveal(0.2);
  const links = [
    { icon: "✉", label: data.email, href: `mailto:${data.email}`, copyable: true },
    { icon: "☏", label: data.phone, href: `tel:${data.phone}`, copyable: false },
    { icon: "◈", label: data.location, href: null, copyable: false },
    { icon: "◎", label: data.availability, href: null, copyable: false },
  ];
  return (
    <div ref={ref} style={{
      padding: "40px", borderRadius: "20px",
      background: "linear-gradient(135deg, var(--c-surface), rgba(6,182,212,0.03))",
      border: "1px solid var(--c-border)",
      opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(30px)",
      transition: "all 0.6s ease",
    }}>
      <p style={{
        fontFamily: "var(--f-serif)", fontStyle: "italic", fontSize: "22px",
        color: "var(--c-text)", lineHeight: 1.6, marginBottom: "32px", maxWidth: "400px",
      }}>
        Envie de collaborer ?<br />
        <span style={{ color: "var(--c-accent)" }}>Discutons-en.</span>
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {links.map((l, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center" }}>
            <ContactLink {...l} delay={i * 0.08} visible={visible} />
            {l.copyable && <CopyButton text={l.label} />}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── CONTACT LINK ─── */
function ContactLink({ icon, label, href, delay, visible }) {
  const [hover, setHover] = useState(false);
  const Tag = href ? "a" : "span";
  return (
    <Tag
      href={href || undefined}
      target={href && !href.startsWith("mailto:") && !href.startsWith("tel:") ? "_blank" : undefined}
      rel={href && !href.startsWith("mailto:") && !href.startsWith("tel:") ? "noopener noreferrer" : undefined}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: "12px",
        fontFamily: "var(--f-mono)", fontSize: "13px",
        color: hover ? "var(--c-accent)" : "var(--c-muted)",
        textDecoration: "none", cursor: href ? "pointer" : "default",
        opacity: visible ? 1 : 0, transform: visible ? "translateX(0)" : "translateX(-20px)",
        transition: `all 0.4s ease ${delay + 0.2}s, color 0.2s`,
      }}
    >
      <span style={{ fontSize: "15px", opacity: 0.6 }}>{icon}</span>
      {label}
      {href && <span style={{ opacity: hover ? 1 : 0, transform: hover ? "translateX(0)" : "translateX(-4px)", transition: "all 0.2s", fontSize: "11px" }}>→</span>}
    </Tag>
  );
}
