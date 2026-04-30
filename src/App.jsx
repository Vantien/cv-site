import { useState, useEffect, useRef, useCallback } from "react";

/* ─── DATA ─── */
const DATA = {
  name: "Van Tien",
  role: "Développeur Front-End Senior | Vue.js",
  stack: "Vue.js 3 · TypeScript",
  location: "Rennes, France",
  email: "van-tien.nguyen@hotmail.fr",
  phone: "07 70 80 70 88",
  bio: "Après plus de 8 ans d'expérience en développement front-end à Paris, je m'installe à Rennes avec l'envie de m'investir dans de nouveaux projets. Je recherche de nouveaux challenges au sein d'une équipe bienveillante, j'accorde une grande importance à la qualité du code et à l'expérience utilisateur.",
  stats: [
    { label: "Années d'XP", value: "8+" },
    { label: "Stack principal", value: "Vue 3" },
    { label: "Disponibilité", value: "Télétravail" },
  ],
  experiences: [
    {
      id: 1, role: "Développeur Front-End", company: "Accor, Issy-les-Moulineaux",
      period: "12/2021 — 11/2025", color: "#FF6B35",
      highlights: [
        "Migration d'applications web monopage de Vue 2 vers Vue 3, avec modernisation de l'architecture front-end et amélioration de la maintenabilité",
        "Intégration de nouvelles pages du compte client : réservation d'hôtel, fidélité, informations personnelles et souscriptions",
        "Création d'une librairie de composants partagée entre plusieurs applicatifs pour renforcer la mutualisation et la cohérence UI",
        "Écriture de tests unitaires avec Vitest et tests E2E avec Playwright pour valider les parcours utilisateurs critiques",
        "Contribution à la CI/CD : build, tests unitaires, tests e2e, analyse Sonar jusqu'à la phase de déploiement",
      ],
    },
    {
      id: 2, role: "Développeur Front-End", company: "Valtech, Paris",
      period: "04/2021 — 09/2021", color: "#A78BFA",
      highlights: [
        "Intervention sur le site client : correction des problèmes d'affichage et amélioration de l'ergonomie afin d'optimiser l'expérience utilisateur",
      ],
    },
    {
      id: 3, role: "Développeur Front-End", company: "Maisons du Monde, Paris",
      period: "03/2018 — 04/2021", color: "#4ECDC4",
      highlights: [
        "Intégration de nouvelles fonctionnalités pour la marketplace avec connexion aux services Magento : authentification, informations client, historique des commandes",
        "Refonte de la gestion du compte client en Vue.js avec consommation des APIs via un serveur Apollo GraphQL",
        "Contribution à l'évolution du site e-commerce sous Nuxt/Vue.js en méthode Scrum, avec suivi sur GitLab et participation aux revues de code",
        "Création de composants responsives en Vue.js alignés avec le design system Atomic Design, intégrés dans Storybook et Prismic",
      ],
    },
    {
      id: 4, role: "Développeur Fullstack", company: "Sedna System, Suresnes",
      period: "04/2015 — 01/2017", color: "#F59E0B",
      highlights: [
        "Mise à jour d'un progiciel de gestion de bateaux, avec amélioration des fonctionnalités, optimisation des interfaces et évolution de l'expérience utilisateur",
        "Maintenance et évolution de sites WordPress",
        "Support technique aux utilisateurs et rédaction de documentation fonctionnelle et technique",
      ],
    },
  ],
  skills: [
    { name: "Vue.js 3 / Nuxt (Composition API)", level: 95 },
    { name: "TypeScript", level: 88 },
    { name: "HTML5 / CSS3 / Sass / BEM", level: 92 },
    { name: "Webpack / Vite", level: 82 },
    { name: "Storybook / Histoire", level: 85 },
    { name: "Vitest / Playwright (E2E)", level: 80 },
    { name: "REST / GraphQL (Apollo)", level: 78 },
    { name: "GitLab CI/CD / Docker", level: 75 },
  ],
  interests: [
    { emoji: "🧗", label: "Escalade / Voyage" },
    { emoji: "🎮", label: "Jeux vidéos" },
    { emoji: "📺", label: "Séries / Mangas" },
  ],
};

/* ─── SCROLL REVEAL HOOK ─── */
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

/* ─── ANIMATED SKILL BAR ─── */
function SkillBar({ name, level, delay }) {
  const [ref, visible] = useReveal(0.2);
  return (
    <div ref={ref} style={{ marginBottom: "20px", opacity: visible ? 1 : 0, transform: visible ? "translateX(0)" : "translateX(-30px)", transition: `all 0.5s cubic-bezier(0.22,1,0.36,1) ${delay}s` }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
        <span style={{ fontFamily: "var(--f-body)", fontSize: "14px", color: "var(--c-text)", fontWeight: 500 }}>{name}</span>
        <span style={{ fontFamily: "var(--f-mono)", fontSize: "12px", color: "var(--c-muted)" }}>{level}%</span>
      </div>
      <div style={{ height: "6px", borderRadius: "3px", background: "var(--c-surface)", overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: "3px",
          background: "linear-gradient(90deg, var(--c-accent), var(--c-accent2))",
          width: visible ? `${level}%` : "0%",
          transition: `width 1.2s cubic-bezier(0.22,1,0.36,1) ${delay + 0.3}s`,
        }} />
      </div>
    </div>
  );
}

/* ─── EXPERIENCE CARD ─── */
function ExpCard({ exp, index }) {
  const [ref, visible] = useReveal(0.15);
  const [hover, setHover] = useState(false);
  return (
    <div
      ref={ref}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        padding: "32px",
        borderRadius: "16px",
        background: hover ? "var(--c-surface-hover)" : "var(--c-surface)",
        border: `1px solid ${hover ? exp.color + "44" : "var(--c-border)"}`,
        marginBottom: "20px",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(40px) scale(0.97)",
        transition: `all 0.6s cubic-bezier(0.22,1,0.36,1) ${index * 0.15}s`,
        cursor: "default",
        overflow: "hidden",
      }}
    >
      {/* Color accent bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, width: "4px", height: "100%",
        background: exp.color, borderRadius: "16px 0 0 16px",
        opacity: hover ? 1 : 0.4, transition: "opacity 0.3s",
      }} />
      {/* Glow on hover */}
      <div style={{
        position: "absolute", top: "-50%", right: "-30%", width: "300px", height: "300px",
        borderRadius: "50%", background: `radial-gradient(circle, ${exp.color}08, transparent 70%)`,
        opacity: hover ? 1 : 0, transition: "opacity 0.5s", pointerEvents: "none",
      }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "19px", fontWeight: 600, color: "var(--c-text)", fontFamily: "var(--f-display)" }}>{exp.role}</h3>
            <span style={{ fontFamily: "var(--f-mono)", fontSize: "14px", color: exp.color, fontWeight: 500 }}>{exp.company}</span>
          </div>
          <span style={{
            padding: "4px 12px", borderRadius: "100px", fontSize: "12px",
            fontFamily: "var(--f-mono)", background: exp.color + "15", color: exp.color,
            border: `1px solid ${exp.color}25`, whiteSpace: "nowrap",
          }}>{exp.period}</span>
        </div>
        {exp.highlights.map((h, i) => (
          <div key={i} style={{
            display: "flex", gap: "10px", marginBottom: "8px",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateX(0)" : "translateX(20px)",
            transition: `all 0.4s ease ${0.3 + i * 0.08}s`,
          }}>
            <span style={{ color: exp.color, fontSize: "16px", lineHeight: "24px", flexShrink: 0 }}>›</span>
            <span style={{ fontSize: "14px", color: "var(--c-muted)", lineHeight: "24px" }}>{h}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── FLOATING NAV DOT ─── */
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

/* ─── MAIN ─── */
export default function CVSite() {
  const d = DATA;
  const sections = [
    { id: "hero", label: "Accueil" },
    { id: "exp", label: "Expériences" },
    { id: "skills", label: "Compétences" },
    { id: "interests", label: "Intérêts" },
    { id: "contact", label: "Contact" },
  ];
  const [activeSection, setActiveSection] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouse = useCallback((e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, [handleMouse]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = sections.findIndex((s) => s.id === e.target.id);
            if (idx !== -1) setActiveSection(idx);
          }
        });
      },
      { threshold: 0.35 }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--c-bg)", color: "var(--c-text)", fontFamily: "var(--f-body)", lineHeight: 1.6, position: "relative", overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Newsreader:ital,wght@0,400;0,600;1,400&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />
      <style>{`
        :root {
          --c-bg: #07090E;
          --c-surface: rgba(255,255,255,0.03);
          --c-surface-hover: rgba(255,255,255,0.06);
          --c-border: rgba(255,255,255,0.06);
          --c-text: #F0F2F5;
          --c-muted: #7A8599;
          --c-accent: #FF6B35;
          --c-accent2: #FFB347;
          --f-display: 'Outfit', sans-serif;
          --f-body: 'Outfit', sans-serif;
          --f-serif: 'Newsreader', serif;
          --f-mono: 'IBM Plex Mono', monospace;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scaleIn { from{opacity:0;transform:scale(0.8)} to{opacity:1;transform:scale(1)} }
        @keyframes typewriter { from{width:0} to{width:100%} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes grain {
          0%,100%{transform:translate(0,0)}
          10%{transform:translate(-5%,-10%)}
          30%{transform:translate(3%,-15%)}
          50%{transform:translate(-15%,8%)}
          70%{transform:translate(8%,3%)}
          90%{transform:translate(-10%,12%)}
        }
        ::selection { background: #FF6B3544; color: #fff; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: var(--c-accent); border-radius: 2px; }
      `}</style>

      {/* Grain overlay */}
      <div style={{
        position: "fixed", inset: "-50%", width: "200%", height: "200%",
        background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
        opacity: 0.5, pointerEvents: "none", zIndex: 1000,
        animation: "grain 8s steps(10) infinite",
      }} />

      {/* Cursor glow */}
      <div style={{
        position: "fixed",
        left: mousePos.x - 200, top: mousePos.y - 200,
        width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,107,53,0.06), transparent 70%)",
        pointerEvents: "none", zIndex: 0,
        transition: "left 0.3s ease, top 0.3s ease",
      }} />

      {/* Background orbs */}
      <div style={{ position: "fixed", top: "10%", left: "5%", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,107,53,0.04), transparent)", animation: "float 8s ease-in-out infinite", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: "15%", right: "8%", width: "350px", height: "350px", borderRadius: "50%", background: "radial-gradient(circle, rgba(78,205,196,0.03), transparent)", animation: "float 10s ease-in-out infinite 2s", pointerEvents: "none" }} />

      <NavDots sections={sections} active={activeSection} />

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 32px", position: "relative", zIndex: 1 }}>

        {/* ═══ HERO ═══ */}
        <section id="hero" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", paddingBottom: "60px" }}>
          {/* Status badge */}
          <div style={{ animation: "fadeUp 0.6s ease both", marginBottom: "32px" }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "6px 16px", borderRadius: "100px", fontSize: "12px",
              fontFamily: "var(--f-mono)", background: "rgba(78,205,196,0.1)",
              color: "#4ECDC4", border: "1px solid rgba(78,205,196,0.2)",
            }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4ECDC4", boxShadow: "0 0 8px #4ECDC4", animation: "blink 2s infinite" }} />
              Disponible pour une nouvelle opportunité
            </span>
          </div>

          {/* Name */}
          <h1 style={{
            fontSize: "clamp(48px, 10vw, 88px)", fontFamily: "var(--f-display)", fontWeight: 800,
            letterSpacing: "-0.04em", lineHeight: 1,
            background: "linear-gradient(135deg, var(--c-text) 0%, var(--c-muted) 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            animation: "fadeUp 0.6s ease 0.1s both", marginBottom: "8px",
          }}>
            {d.name}<span style={{ WebkitTextFillColor: "var(--c-accent)" }}>.</span>
          </h1>

          {/* Role */}
          <h2 style={{
            fontSize: "clamp(20px, 3vw, 28px)", fontFamily: "var(--f-serif)", fontWeight: 400,
            fontStyle: "italic", color: "var(--c-muted)", animation: "fadeUp 0.6s ease 0.2s both",
            marginBottom: "12px",
          }}>
            {d.role}
          </h2>

          {/* Stack tag */}
          <div style={{ animation: "fadeUp 0.6s ease 0.3s both", marginBottom: "32px" }}>
            <span style={{
              fontFamily: "var(--f-mono)", fontSize: "15px", color: "var(--c-accent)",
              padding: "2px 0", borderBottom: "1px dashed var(--c-accent)",
            }}>
              {d.stack}
            </span>
          </div>

          {/* Bio */}
          <p style={{
            fontSize: "17px", color: "var(--c-muted)", maxWidth: "520px",
            lineHeight: 1.8, animation: "fadeUp 0.6s ease 0.4s both",
            marginBottom: "48px",
          }}>
            {d.bio}
          </p>

          {/* Stats row */}
          <div style={{
            display: "flex", gap: "40px", flexWrap: "wrap",
            animation: "fadeUp 0.6s ease 0.5s both",
          }}>
            {d.stats.map((s, i) => (
              <div key={i}>
                <div style={{
                  fontSize: "36px", fontFamily: "var(--f-display)", fontWeight: 700,
                  color: "var(--c-text)", lineHeight: 1,
                  background: "linear-gradient(135deg, var(--c-accent), var(--c-accent2))",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                }}>{s.value}</div>
                <div style={{ fontSize: "12px", fontFamily: "var(--f-mono)", color: "var(--c-muted)", marginTop: "4px", textTransform: "uppercase", letterSpacing: "0.12em" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Scroll hint */}
          <div style={{
            position: "absolute", bottom: "32px", left: "50%", transform: "translateX(-50%)",
            display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
            animation: "fadeUp 0.6s ease 0.7s both",
          }}>
            <span style={{ fontSize: "11px", fontFamily: "var(--f-mono)", color: "var(--c-muted)", letterSpacing: "0.15em", textTransform: "uppercase" }}>Scroll</span>
            <div style={{ width: "1px", height: "32px", background: "linear-gradient(to bottom, var(--c-accent), transparent)", animation: "float 2s ease-in-out infinite" }} />
          </div>
        </section>

        {/* ═══ EXPERIENCES ═══ */}
        <section id="exp" style={{ paddingTop: "80px", paddingBottom: "80px" }}>
          <SectionHeader number="01" title="Expériences" subtitle="Parcours professionnel" />
          {d.experiences.map((exp, i) => (
            <ExpCard key={exp.id} exp={exp} index={i} />
          ))}
        </section>

        {/* ═══ SKILLS ═══ */}
        <section id="skills" style={{ paddingTop: "80px", paddingBottom: "80px" }}>
          <SectionHeader number="02" title="Compétences" subtitle="Stack technique" />
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "12px 40px",
            padding: "32px", borderRadius: "16px",
            background: "var(--c-surface)", border: "1px solid var(--c-border)",
          }}>
            {d.skills.map((s, i) => (
              <SkillBar key={s.name} name={s.name} level={s.level} delay={i * 0.08} />
            ))}
          </div>
        </section>

        {/* ═══ INTERESTS ═══ */}
        <section id="interests" style={{ paddingTop: "80px", paddingBottom: "80px" }}>
          <SectionHeader number="03" title="Passions" subtitle="Au-delà du code" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px" }}>
            {d.interests.map((item, i) => (
              <InterestCard key={i} item={item} index={i} />
            ))}
          </div>
        </section>

        {/* ═══ CONTACT ═══ */}
        <section id="contact" style={{ paddingTop: "80px", paddingBottom: "100px" }}>
          <SectionHeader number="04" title="Contact" subtitle="Travaillons ensemble" />
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
        <span style={{ fontFamily: "var(--f-mono)", fontSize: "14px", color: "var(--c-accent)", fontWeight: 500 }}>{number}</span>
        <h2 style={{ fontSize: "clamp(28px, 5vw, 40px)", fontFamily: "var(--f-display)", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--c-text)" }}>{title}</h2>
      </div>
      <p style={{ fontFamily: "var(--f-serif)", fontStyle: "italic", fontSize: "15px", color: "var(--c-muted)", marginLeft: "36px" }}>{subtitle}</p>
    </div>
  );
}

/* ─── INTEREST CARD ─── */
function InterestCard({ item, index }) {
  const [ref, visible] = useReveal(0.2);
  const [hover, setHover] = useState(false);
  return (
    <div
      ref={ref}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: "28px 24px", borderRadius: "16px", textAlign: "center",
        background: hover ? "var(--c-surface-hover)" : "var(--c-surface)",
        border: `1px solid ${hover ? "var(--c-accent)" + "33" : "var(--c-border)"}`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : `translateY(30px) scale(0.95)`,
        transition: `all 0.5s cubic-bezier(0.22,1,0.36,1) ${index * 0.1}s`,
        cursor: "default",
      }}
    >
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
    { icon: "✉", label: data.email, href: `mailto:${data.email}` },
    { icon: "☏", label: data.phone, href: `tel:${data.phone}` },
    { icon: "◈", label: data.location, href: null },
  ];
  return (
    <div ref={ref} style={{
      padding: "40px", borderRadius: "20px",
      background: "linear-gradient(135deg, var(--c-surface), rgba(255,107,53,0.03))",
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
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {links.map((l, i) => (
          <ContactLink key={i} {...l} delay={i * 0.08} visible={visible} />
        ))}
      </div>
    </div>
  );
}

function ContactLink({ icon, label, href, delay, visible }) {
  const [hover, setHover] = useState(false);
  const Tag = href ? "a" : "span";
  return (
    <Tag
      href={href || undefined}
      target={href ? "_blank" : undefined}
      rel={href ? "noopener noreferrer" : undefined}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: "12px",
        fontFamily: "var(--f-mono)", fontSize: "14px",
        color: hover ? "var(--c-accent)" : "var(--c-muted)",
        textDecoration: "none", cursor: href ? "pointer" : "default",
        opacity: visible ? 1 : 0, transform: visible ? "translateX(0)" : "translateX(-20px)",
        transition: `all 0.4s ease ${delay + 0.2}s, color 0.2s`,
      }}
    >
      <span style={{ fontSize: "16px", opacity: 0.6 }}>{icon}</span>
      {label}
      {href && <span style={{ opacity: hover ? 1 : 0, transform: hover ? "translateX(0)" : "translateX(-4px)", transition: "all 0.2s", fontSize: "12px" }}>→</span>}
    </Tag>
  );
}
