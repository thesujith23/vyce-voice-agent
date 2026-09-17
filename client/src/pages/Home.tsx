import { useEffect, useState } from "react";
import {
  ArrowRight, ArrowUpRight, CalendarDays, Check, ChevronDown, Clock3, Globe2,
  Headphones, Menu, MessageCircle, Mic2, Play, ShieldCheck, Sparkles,
  X, Zap,
} from "lucide-react";

const actualWebsite = "https://www.vyce.io/vyce-ai";

const useCases = {
  Support: {
    eyebrow: "CX / Support",
    title: "Every call answered like your best teammate.",
    description: "Vyce handles the repeatable, high-volume conversations so your team can focus on the moments that need a human touch.",
    transcript: [
      ["Caller", "Hey, I need to move my delivery to Friday."],
      ["Vyce", "Absolutely. I found your order. Friday works — I’ll update that now."],
      ["Caller", "Perfect, thank you."],
    ],
    stat: "92%", statLabel: "first-call resolution",
  },
  Sales: {
    eyebrow: "Revenue / Sales",
    title: "Turn intent into momentum, instantly.",
    description: "Qualify leads, answer product questions, and book the next step while interest is still warm — day or night.",
    transcript: [
      ["Prospect", "Can you show me how this works for a 20-person team?"],
      ["Vyce", "I can. The short version: you get coverage without adding another shift. Want me to book a tailored walkthrough?"],
      ["Prospect", "Yes, Thursday afternoon is open."],
    ],
    stat: "3.4×", statLabel: "more qualified conversations",
  },
  Operations: {
    eyebrow: "Ops / Workflow",
    title: "Keep the work moving between calls.",
    description: "Vyce connects the conversation to the action: update records, route requests, and keep everyone aligned without the swivel chair.",
    transcript: [
      ["Caller", "I’m calling about the status of ticket 4821."],
      ["Vyce", "It’s waiting on a parts shipment. I’ve added your note and sent the latest ETA to your email."],
      ["Caller", "That’s exactly what I needed."],
    ],
    stat: "14 hrs", statLabel: "saved per team / week",
  },
} as const;

type UseCase = keyof typeof useCases;

const faqs = [
  ["What can Vyce handle?", "Vyce is built for high-intent, repeatable conversations: customer support, lead qualification, scheduling, status updates, and more. Your team defines the rules and the handoff moments; Vyce handles the conversation."],
  ["Will callers know they’re speaking with AI?", "Yes. Vyce is designed to be transparent, natural, and helpful. It can introduce itself as an AI assistant and hand off to a human whenever the moment calls for it."],
  ["How quickly can we launch?", "Most teams can get a first workflow live in days, not months. Start with one high-volume conversation, learn from the calls, and expand from there."],
  ["Can Vyce connect to our tools?", "Vyce is designed to fit into the systems you already use. Talk to the team about the workflows, tools, and data sources you want to connect."],
];

function LogoMark() {
  return <span className="logo-mark" aria-hidden="true"><span /><span /><span /></span>;
}

function Waveform({ small = false }: { small?: boolean }) {
  const bars = [9, 18, 12, 27, 16, 36, 22, 43, 25, 34, 17, 29, 11, 21, 8];
  return <span className={small ? "waveform waveform-small" : "waveform"} aria-hidden="true">
    {bars.map((height, index) => <i key={index} style={{ height: `${small ? height * .56 : height}px`, animationDelay: `${index * 70}ms` }} />)}
  </span>;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeCase, setActiveCase] = useState<UseCase>("Support");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState("10:00 AM");
  const [demoRequested, setDemoRequested] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const revealNodes = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    const parallaxNodes = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
    let frame = 0;
    const updateParallax = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        const viewportCenter = window.innerHeight / 2;
        parallaxNodes.forEach((node) => {
          const rect = node.getBoundingClientRect();
          const speed = Number(node.dataset.parallax ?? 0.06);
          const offset = (viewportCenter - (rect.top + rect.height / 2)) * speed;
          node.style.setProperty("--parallax-offset", `${offset}px`);
        });
        frame = 0;
      });
    };

    document.documentElement.classList.add("motion-ready");
    revealNodes.forEach((node) => revealObserver.observe(node));
    updateParallax();
    window.addEventListener("scroll", updateParallax, { passive: true });
    window.addEventListener("resize", updateParallax, { passive: true });

    return () => {
      revealObserver.disconnect();
      window.removeEventListener("scroll", updateParallax);
      window.removeEventListener("resize", updateParallax);
      if (frame) window.cancelAnimationFrame(frame);
      document.documentElement.classList.remove("motion-ready");
    };
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };
  const openDemo = () => {
    setDemoRequested(false);
    setDemoOpen(true);
    setMenuOpen(false);
  };
  const demoDays = [
    { weekday: "Tue", date: "22 Sep" },
    { weekday: "Wed", date: "23 Sep" },
    { weekday: "Thu", date: "24 Sep" },
    { weekday: "Fri", date: "25 Sep" },
  ];
  const demoSlots = ["10:00 AM", "11:30 AM", "2:00 PM", "3:30 PM"];
  const current = useCases[activeCase];

  return <div className="site-shell">
    <div className="grain" aria-hidden="true" />
    <div className="scroll-progress" aria-hidden="true" />
    <header className={`site-nav ${scrolled ? "site-nav-scrolled" : ""}`}>
      <div className="nav-inner">
        <a href="#top" className="brand" aria-label="Vyce home"><LogoMark /><span>vyce</span></a>
        <nav className={menuOpen ? "nav-links nav-links-open" : "nav-links"} aria-label="Main navigation">
          <button onClick={() => scrollTo("product")}>Product</button>
          <button onClick={() => scrollTo("use-cases")}>Use cases</button>
          <button onClick={() => scrollTo("pricing")}>Pricing</button>
          <button onClick={() => scrollTo("faq")}>FAQ</button>
          <button className="mobile-nav-cta mobile-nav-demo" onClick={openDemo}><CalendarDays size={15} /> Book a demo <ArrowUpRight size={15} /></button>
          <a className="mobile-nav-cta" href={actualWebsite} target="_blank" rel="noreferrer">Visit vyce.io <ArrowUpRight size={15} /></a>
        </nav>
        <div className="nav-actions"><button className="button button-small button-demo-nav" onClick={openDemo}><CalendarDays size={14} /> Book a demo</button><a className="nav-text-link" href={actualWebsite} target="_blank" rel="noreferrer">Sign in</a><a className="button button-small button-light" href={actualWebsite} target="_blank" rel="noreferrer">Get started <ArrowUpRight size={15} /></a></div>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
      </div>
    </header>

    <main id="top">
      <section className="hero-section">
        <div className="hero-orbit orbit-one" data-parallax="0.035" /><div className="hero-orbit orbit-two" data-parallax="0.06" />
        <div className="hero-inner section-container">
          <div className="hero-copy reveal-up">
            <div className="eyebrow"><span className="eyebrow-dot" /> THE VOICE LAYER FOR MODERN TEAMS</div>
            <h1>Let your work<br /><em>speak</em> for itself.</h1>
            <p className="hero-subtitle">Vyce is the AI voice agent that answers, understands, and gets things done — so every conversation moves your business forward.</p>
            <div className="hero-actions"><a className="button button-primary" href={actualWebsite} target="_blank" rel="noreferrer">Try Vyce free <ArrowUpRight size={17} /></a><button className="button button-hero-demo" onClick={openDemo}><CalendarDays size={16} /> Book a demo</button><button className="text-button" onClick={() => scrollTo("product")}><span className="play-icon"><Play size={12} fill="currentColor" /></span> See how it works</button></div>
            <div className="hero-note"><ShieldCheck size={15} /> No credit card required <span className="note-separator">·</span> Set up in minutes</div>
          </div>
          <div className="hero-visual reveal-up reveal-delay-2">
            <div className="visual-label label-top"><span className="live-dot" /> LIVE VOICE AGENT</div>
            <div className="voice-orb-wrap" data-parallax="0.08"><div className="voice-orb-glow" /><div className="voice-orb"><div className="orb-core"><Waveform /></div><span className="orb-ring ring-a" /><span className="orb-ring ring-b" /><span className="orb-spark spark-a" /><span className="orb-spark spark-b" /></div></div>
            <div className="voice-card"><div className="voice-card-head"><div><span className="card-overline">VYCE / DEMO CALL</span><strong>Onboarding assistant</strong></div><span className="call-time"><Clock3 size={13} /> 00:42</span></div><div className="voice-card-message"><span className="avatar avatar-vyce">V</span><div><span className="message-label">Vyce</span><p>“I’ve got you. Let’s get the next step sorted.”</p></div></div><div className="voice-card-foot"><Waveform small /><span>Listening for intent</span><span className="signal-bars"><i /><i /><i /></span></div></div>
            <div className="floating-chip chip-left"><span className="chip-icon"><Zap size={14} fill="currentColor" /></span><span><b>2.4 sec</b><small>response time</small></span></div><div className="floating-chip chip-right"><span className="chip-icon chip-coral"><Globe2 size={14} /></span><span><b>24 / 7</b><small>always on</small></span></div>
          </div>
        </div>
        <div className="hero-bottom section-container"><span>BUILT FOR THE MOMENTS THAT MATTER</span><div className="scroll-cue"><span /> Scroll to explore</div></div>
      </section>

      <section className="logo-strip section-container" aria-label="Trusted by teams" data-reveal="fade"><span className="logo-strip-label">POWERING THE NEXT<br />GENERATION OF TEAMS</span><div className="customer-logos"><span>northstar</span><span className="logo-serif">arc / studio</span><span className="logo-mono">WAVEFORM</span><span className="logo-serif">Sonder</span><span>rally<span className="logo-dot">.</span></span></div></section>

      <section className="intro-section section-container" id="product" data-reveal="up"><div className="section-kicker"><span>01</span><span className="kicker-line" /><span>THE NEW FRONT DESK</span></div><div className="intro-grid"><h2>Your best people<br />shouldn’t sound <em>busy.</em></h2><div className="intro-copy"><p>Every unanswered call is a missed moment. Vyce gives your business a voice that’s warm, capable, and ready whenever your customers are.</p><button className="arrow-link" onClick={() => scrollTo("use-cases")}>Explore the platform <ArrowRight size={17} /></button></div></div><div className="feature-line-grid"><div className="feature-line-card" data-reveal="up" data-reveal-delay="1"><div className="feature-number">01</div><div className="line-icon"><MessageCircle size={19} /></div><h3>Natural by default</h3><p>Understands the way people actually speak — interruptions, accents, and all.</p></div><div className="feature-line-card" data-reveal="up" data-reveal-delay="2"><div className="feature-number">02</div><div className="line-icon"><Zap size={19} /></div><h3>Fast enough to feel human</h3><p>Low-latency conversations that keep the rhythm natural and the queue moving.</p></div><div className="feature-line-card" data-reveal="up" data-reveal-delay="3"><div className="feature-number">03</div><div className="line-icon"><ArrowUpRight size={19} /></div><h3>Always connected</h3><p>Turns every conversation into the next best action across your workflow.</p></div></div></section>

      <section className="use-case-section" id="use-cases" data-reveal="up"><div className="section-container"><div className="use-case-header"><div><div className="section-kicker light-kicker"><span>02</span><span className="kicker-line" /><span>ONE VOICE. MANY JOBS.</span></div><h2>Make every call<br /><em>count.</em></h2></div><p>From first hello to final handoff, Vyce helps your team do more with every conversation.</p></div><div className="case-tabs" role="tablist" aria-label="Vyce use cases">{(Object.keys(useCases) as UseCase[]).map((item) => <button key={item} role="tab" aria-selected={activeCase === item} className={activeCase === item ? "case-tab active" : "case-tab"} onClick={() => setActiveCase(item)}>{item}<ArrowUpRight size={16} /></button>)}</div><div className="case-panel"><div className="case-story"><div className="eyebrow coral-eyebrow"><span className="eyebrow-dot" /> {current.eyebrow}</div><h3>{current.title}</h3><p>{current.description}</p><div className="case-stat"><strong>{current.stat}</strong><span>{current.statLabel}</span></div></div><div className="transcript-card"><div className="transcript-top"><span className="transcript-label"><span className="live-dot" /> LIVE TRANSCRIPT</span><span>Today, 10:42 AM</span></div><div className="transcript-lines">{current.transcript.map(([speaker, text], index) => <div className={`transcript-line ${speaker === "Vyce" ? "vyce-line" : ""}`} key={`${speaker}-${index}`}><span className={speaker === "Vyce" ? "mini-avatar" : "speaker-mark"}>{speaker === "Vyce" ? "V" : "·"}</span><div><span className="speaker-name">{speaker}</span><p>{text}</p></div></div>)}</div><div className="transcript-bottom"><Waveform small /><span>Conversation clarity <b>98%</b></span><span className="transcript-check"><Check size={13} /> Resolved</span></div></div></div></div></section>

      <section className="bento-section section-container" data-reveal="up"><div className="section-kicker"><span>03</span><span className="kicker-line" /><span>THE VYCE DIFFERENCE</span></div><div className="bento-heading"><h2>Built for <em>real</em><br />conversations.</h2><p>Not a chatbot wearing a phone costume. Vyce is a voice-native teammate that knows when to listen, act, and get out of the way.</p></div><div className="bento-grid"><article className="bento-card bento-large bento-dark" data-parallax="0.035"><div className="bento-card-top"><span className="bento-index">A /</span><Mic2 size={19} /></div><div className="bento-wave-wrap"><div className="bento-wave-glow" /><Waveform /></div><div><h3>Voice with a point of view.</h3><p>Give Vyce your tone, your knowledge, and your rules. The result sounds like your brand — not a script.</p></div></article><article className="bento-card bento-peach"><div className="bento-card-top"><span className="bento-index">B /</span><Headphones size={19} /></div><div className="sound-meter"><span>LISTENING</span><div className="meter-bars">{[24, 38, 18, 51, 29, 44, 19, 36, 25, 48, 15, 32].map((height, i) => <i style={{ height }} key={i} />)}</div><span className="meter-status"><span className="green-dot" /> Signal clear</span></div><h3>Hears the whole picture.</h3><p>Context, sentiment, intent — Vyce catches what matters between the words.</p></article><article className="bento-card bento-lilac"><div className="bento-card-top"><span className="bento-index">C /</span><Sparkles size={19} /></div><div className="sparkle-stack"><span>intent</span><span>context</span><span>action</span><ArrowRight size={17} /></div><h3>Gets better with every call.</h3><p>See patterns across conversations and turn them into your next advantage.</p></article><article className="bento-card bento-outline"><div className="bento-card-top"><span className="bento-index">D /</span><ShieldCheck size={19} /></div><div className="security-badge"><ShieldCheck size={17} /><span>PRIVATE BY DESIGN</span></div><h3>Trust built in.</h3><p>Thoughtful controls and clear handoffs keep your team in charge.</p><div className="bento-link">Explore security <ArrowUpRight size={15} /></div></article></div></section>

      <section className="metrics-section" data-reveal="fade"><div className="section-container metrics-grid"><div><strong>24 / 7</strong><span>coverage without<br />the burnout</span></div><div><strong>2.4<span>s</span></strong><span>average<br />response time</span></div><div><strong>98<span>%</span></strong><span>conversation<br />clarity</span></div><div className="metrics-cta"><span>READY WHEN<br />YOU ARE.</span><button className="metrics-demo-button" onClick={openDemo}>Book a demo <ArrowUpRight size={16} /></button></div></div></section>

      <section className="pricing-section section-container" id="pricing" data-reveal="up"><div className="pricing-heading"><div className="section-kicker"><span>04</span><span className="kicker-line" /><span>SIMPLE, CLEAR, READY</span></div><h2>Start small.<br /><em>Think big.</em></h2><p>Bring your first conversation to life, then scale when you’re ready. Every plan includes a human setup partner.</p></div><div className="pricing-grid"><article className="price-card"><span className="plan-name">STARTER</span><div className="price"><strong>$0</strong><span>/ month</span></div><p>For teams ready to hear what voice AI can do.</p><a className="price-link" href={actualWebsite} target="_blank" rel="noreferrer">Start for free <ArrowRight size={16} /></a><div className="plan-divider" /><ul><li><Check size={15} /> 100 conversation minutes</li><li><Check size={15} /> 1 voice agent</li><li><Check size={15} /> Core integrations</li></ul></article><article className="price-card price-card-featured"><div className="popular-tag">MOST POPULAR</div><span className="plan-name">GROWTH</span><div className="price"><strong>$99</strong><span>/ month</span></div><p>For teams ready to make every call count.</p><a className="price-link" href={actualWebsite} target="_blank" rel="noreferrer">Choose growth <ArrowRight size={16} /></a><div className="plan-divider" /><ul><li><Check size={15} /> 2,000 conversation minutes</li><li><Check size={15} /> Unlimited workflows</li><li><Check size={15} /> Priority support</li></ul></article><article className="price-card"><span className="plan-name">CUSTOM</span><div className="price price-custom"><strong>Let’s talk</strong></div><p>For teams with bigger questions and bigger call volume.</p><button className="price-link price-button" onClick={openDemo}>Book a demo <ArrowRight size={16} /></button><div className="plan-divider" /><ul><li><Check size={15} /> Custom conversation volume</li><li><Check size={15} /> Dedicated success partner</li><li><Check size={15} /> Advanced security controls</li></ul></article></div><p className="pricing-footnote"><ShieldCheck size={14} /> All plans include secure data handling and transparent usage.</p></section>

      <section className="demo-section section-container" data-reveal="up"><div className="demo-card"><div className="demo-orb" data-parallax="0.055" /><div className="demo-copy"><div className="eyebrow"><span className="eyebrow-dot" /> HEAR IT FOR YOURSELF</div><h2>Good conversations<br />start with <em>hello.</em></h2><p>Press play to hear how Vyce turns a simple question into a useful next step.</p><div className="demo-actions"><button className={isPlaying ? "demo-play playing" : "demo-play"} onClick={() => setIsPlaying(!isPlaying)} aria-label={isPlaying ? "Pause demo" : "Play voice demo"}><span>{isPlaying ? "Ⅱ" : <Play size={19} fill="currentColor" />}</span>{isPlaying ? "Playing demo" : "Play 38 sec demo"}</button><button className="demo-secondary" onClick={openDemo}><CalendarDays size={15} /> Book a demo</button></div></div><div className="demo-wave"><Waveform /></div><div className="demo-caption"><span>VYCE / SAMPLE CONVERSATION</span><span>{isPlaying ? "00:18 / 00:38" : "READY TO PLAY"}</span></div></div></section>

      <section className="faq-section section-container" id="faq" data-reveal="up"><div className="faq-heading"><div className="section-kicker"><span>05</span><span className="kicker-line" /><span>GOOD TO KNOW</span></div><h2>Questions,<br /><em>answered.</em></h2></div><div className="faq-list">{faqs.map(([question, answer], index) => <div className={openFaq === index ? "faq-item faq-open" : "faq-item"} key={question}><button onClick={() => setOpenFaq(openFaq === index ? null : index)} aria-expanded={openFaq === index}><span>{question}</span><ChevronDown size={19} /></button><div className="faq-answer"><p>{answer}</p></div></div>)}</div></section>

      <section className="final-cta" data-reveal="fade"><div className="final-cta-noise" /><div className="section-container final-cta-inner"><div className="section-kicker light-kicker"><span>06</span><span className="kicker-line" /><span>YOUR NEXT CONVERSATION</span></div><h2>Make your next<br />hello <em>count.</em></h2><p>Start with one workflow. See what happens when your business is always ready to listen.</p><button className="button button-coral" onClick={openDemo}><CalendarDays size={16} /> Book a demo <ArrowUpRight size={17} /></button><span className="final-note">vyce.io/vyce-ai <span>↗</span></span></div><div className="cta-orbit cta-orbit-one" /><div className="cta-orbit cta-orbit-two" /></section>
    </main>

    <footer className="site-footer"><div className="section-container footer-top"><a href="#top" className="brand"><LogoMark /><span>vyce</span></a><div className="footer-links"><a href="#product">Product</a><a href="#use-cases">Use cases</a><a href="#pricing">Pricing</a><a href="#faq">FAQ</a><button className="footer-demo-button" onClick={openDemo}><CalendarDays size={13} /> Book a demo</button></div><span className="footer-location">BUILT FOR BETTER CALLS<span className="footer-dot" /> 2026</span></div><div className="section-container footer-bottom"><span>© 2026 Vyce AI. All rights reserved.</span><span>Conversations, elevated.</span></div></footer>

    {demoOpen && <div className="demo-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setDemoOpen(false); }}>
      <div className="demo-modal" role="dialog" aria-modal="true" aria-labelledby="demo-modal-title">
        <button className="demo-modal-close" onClick={() => setDemoOpen(false)} aria-label="Close demo calendar"><X size={19} /></button>
        <div className="demo-modal-kicker"><CalendarDays size={15} /> VYCE / BOOK A DEMO</div>
        <h2 id="demo-modal-title">Find a time<br /><em>that works.</em></h2>
        <p className="demo-modal-copy">Choose an available slot for a quick walkthrough with the Vyce team.</p>
        <div className="demo-calendar-label">SEPTEMBER 2026</div>
        <div className="demo-days">{demoDays.map((day, index) => <button key={day.date} className={selectedDay === index ? "demo-day active" : "demo-day"} onClick={() => { setSelectedDay(index); setDemoRequested(false); }}><span>{day.weekday}</span><strong>{day.date.split(" ")[0]}</strong></button>)}</div>
        <div className="demo-calendar-label">AVAILABLE TIMES <span>IST · 30 MIN</span></div>
        <div className="demo-slots">{demoSlots.map((slot) => <button key={slot} className={selectedSlot === slot ? "demo-slot active" : "demo-slot"} onClick={() => { setSelectedSlot(slot); setDemoRequested(false); }}>{slot}</button>)}</div>
        <button className="demo-confirm" onClick={() => setDemoRequested(true)}>{demoRequested ? "Request ready — we’ll be in touch" : `Request ${demoDays[selectedDay].weekday}, ${demoDays[selectedDay].date} at ${selectedSlot}`} <ArrowUpRight size={16} /></button>
        <span className="demo-modal-note"><ShieldCheck size={14} /> No commitment · We’ll confirm by email</span>
      </div>
    </div>}
    <button className="floating-demo-cta" onClick={openDemo}><span className="floating-demo-icon"><CalendarDays size={15} /></span><span>Book a demo</span><ArrowUpRight size={15} /></button>
  </div>;
}

export { actualWebsite };
