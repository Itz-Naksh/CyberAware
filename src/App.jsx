import { useEffect, useRef, useState } from 'react';
import { HashRouter, Link, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { articles } from './articles.js';
import { formatDate, readingTime, site } from './site.js';
import globeImg from './globe.svg';
import Illustration from './illustrations.jsx';

const checklist = [
  ['Use a password manager', 'Long, unique passwords for every account.'],
  ['Turn on MFA', 'A second step blocks most account takeovers.'],
  ['Update everything', 'Patches close holes attackers already know about.'],
  ['Back up your data', 'Keep one copy offline. Test your restore.'],
  ['Think before you click', 'Urgent messages are the oldest trick in the book.'],
];

const navItems = [['Home', 'top'], ['About Us', 'about'], ['Services', 'services'], ['Blog', 'blog'], ['Tools', 'tools'], ['Contact', 'contact']];

// Which home-page section is currently under the header.
function useActiveSection(enabled) {
  const [active, setActive] = useState('top');
  useEffect(() => {
    if (!enabled) return;
    const on = () => {
      let cur = 'top';
      for (const [, id] of navItems) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 140) cur = id;
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) cur = navItems[navItems.length - 1][1];
      setActive(cur);
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, [enabled]);
  return enabled ? active : null;
}

function Header() {
  const { pathname } = useLocation();
  const active = useActiveSection(pathname === '/');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('menu-open', open);
    const esc = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [open]);

  return (
    <header className="header">
      <Link to="/" className="logo" state={{ scrollTo: 'top' }} onClick={() => setOpen(false)}>
        {site.logo ? <img src={site.logo} alt="" className="logo-img" /> : <span className="logo-mark">&gt;_</span>}
        <span>{site.name.toUpperCase()}<small>Cyber Security Solutions</small></span>
      </Link>
      <button type="button" className={open ? 'burger open' : 'burger'} aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open} aria-controls="main-nav" onClick={() => setOpen(!open)}>
        <span /><span /><span />
      </button>
      <nav id="main-nav" className={open ? 'open' : ''}>
        {navItems.map(([label, id]) => (
          <Link key={id} to="/" state={{ scrollTo: id, t: Date.now() }} className={active === id ? 'active' : ''}
            aria-current={active === id ? 'true' : undefined} onClick={() => setOpen(false)}>{label}</Link>
        ))}
        <Link to="/" state={{ scrollTo: 'tools', t: Date.now() }} className="nav-cta" onClick={() => setOpen(false)}>Take the Quiz</Link>
      </nav>
    </header>
  );
}

function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > 600);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <button type="button" className={show ? 'to-top show' : 'to-top'} aria-label="Back to top" tabIndex={show ? 0 : -1}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>↑</button>
  );
}

// Fades/slides an element in the first time it scrolls into view.
function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) { setShown(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={`reveal ${shown ? 'in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }} {...rest}>
      {children}
    </Tag>
  );
}

// Counts up to a number once it is visible.
function Counter({ to, suffix = '' }) {
  const ref = useRef(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const el = ref.current;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) { setN(to); return; }
    let raf;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (t) => {
        const k = Math.min(1, (t - t0) / 1600);
        setN(Math.round(to * (1 - Math.pow(1 - k, 3))));
        if (k < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [to]);
  return <span ref={ref}>{n}{suffix}</span>;
}

function ReadingProgress() {
  const [w, setW] = useState(0);
  useEffect(() => {
    const on = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setW(h > 0 ? (window.scrollY / h) * 100 : 0);
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return <div className="progress" style={{ width: `${w}%` }} />;
}

// Accent colours per topic: [main, secondary].
const topicColors = {
  Phishing: ['#ff7a59', '#ffc35a'],
  Accounts: ['#19d3a2', '#00d4ff'],
  Malware: ['#ff4d6d', '#c77dff'],
  Network: ['#00d4ff', '#4d7cff'],
  'Social Engineering': ['#c77dff', '#ff7ac6'],
  Basics: ['#7ee081', '#19d3a2'],
};

function Cover({ a, big }) {
  const [c1, c2] = topicColors[a.category] || topicColors.Basics;
  return (
    <div className={big ? 'cover big ph' : 'cover ph'} style={{ '--ill-a': c1, '--ill-b': c2 }}>
      <span className="cover-glow" aria-hidden="true" />
      <Illustration name={a.category} />
      <span className="cover-tag">{a.category}</span>
    </div>
  );
}

function ArticleCard({ a }) {
  return (
    <Link to={`/article/${a.id}`} className="card">
      <Cover a={a} />
      <div className="card-body">
        <h3>{a.title}</h3>
        <p>{a.summary}</p>
        <small className="meta">{formatDate(a.date)} · {readingTime(a.content)} min read</small>
      </div>
    </Link>
  );
}

const icons = {
  headset: <path d="M4 14v-2a8 8 0 0 1 16 0v2M4 14h3v5H4zM17 14h3v5h-3zM20 19c0 2-3 3-6 3" />,
  shield: <path d="M12 3 4 6v6c0 5 3.500 8 8 9 4.500-1 8-4 8-9V6zM9 12l2 2 4-4" />,
  lock: <path d="M6 11h12v9H6zM8 11V8a4 4 0 0 1 8 0v3M12 15v2" />,
  quiz: <path d="M4 5h16v11H9l-5 4zM9.500 8.500a2.500 2.500 0 1 1 3.500 2.300c-.600.300-1 .800-1 1.400M12 14.500v.01" />,
  book: <path d="M4 5c2.500-1 5.500-1 8 .500C14.500 4 17.500 4 20 5v14c-2.500-1-5.500-1-8 .500C9.500 18 6.500 18 4 19zM12 5.500V19.500" />,
  badge: <path d="M12 3l2.500 2 3-.5.800 3 2.700 1.500-1.200 2.800L21 15l-2.700 1.500-.8 3-3-.5L12 21l-2.500-2-3 .5-.8-3L3 15l1.200-2.700L3 9.500 5.700 8l.8-3 3 .5zM9 12l2 2 4-4" />,
};

function Icon({ name }) {
  return (
    <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {icons[name]}
    </svg>
  );
}

const features = [
  ['quiz', 'Phishing Quiz', 'Practise spotting fake emails and messages, with an explanation for every answer.'],
  ['lock', 'Password Checker', 'See how strong a password is and how to improve it, all inside your browser.'],
  ['book', 'Plain-Language Guides', 'Short articles on phishing, ransomware, MFA and Wi-Fi safety, without jargon.'],
  ['shield', 'Free & Private', 'No sign-up, no tracking, nothing stored. Just practical security advice.'],
];

const services = [
  ['training', 'Awareness Training', 'Short, practical lessons that help everyone spot phishing and scams.'],
  ['risk', 'Risk Assessment', 'Find the weak spots in your accounts, devices and processes.'],
  ['incident', 'Incident Guidance', 'Clear steps to contain and recover when something goes wrong.'],
];

const serviceColors = {
  training: ['#ffc35a', '#ff7a59'],
  risk: ['#00d4ff', '#4d7cff'],
  incident: ['#ff4d6d', '#ffc35a'],
};

const COMMON = ['password', '123456', '12345678', 'qwerty', 'abc123', 'letmein', 'welcome', 'admin', 'iloveyou', 'monkey', 'dragon', 'football', 'login', 'passw0rd', 'india123'];

function analyse(pw) {
  if (!pw) return null;
  let pool = 0;
  if (/[a-z]/.test(pw)) pool += 26;
  if (/[A-Z]/.test(pw)) pool += 26;
  if (/\d/.test(pw)) pool += 10;
  if (/[^A-Za-z0-9]/.test(pw)) pool += 32;
  let bits = pw.length * Math.log2(pool || 1);
  const lower = pw.toLowerCase();
  const tips = [];
  if (COMMON.some((c) => lower.includes(c))) { bits = Math.min(bits, 20); tips.push('Contains a very common password or word.'); }
  if (/(.)\1{2,}/.test(pw)) { bits -= 8; tips.push('Avoid repeated characters like "aaa".'); }
  if (/(0123|1234|2345|abcd|qwer)/i.test(pw)) { bits -= 8; tips.push('Avoid simple sequences like "1234" or "qwer".'); }
  if (pw.length < 12) tips.push('Use at least 12 characters. A passphrase of 4+ random words is ideal.');
  if (!/[A-Z]/.test(pw) || !/[a-z]/.test(pw)) tips.push('Mix upper and lower case letters.');
  if (!/\d/.test(pw)) tips.push('Add a number.');
  if (!/[^A-Za-z0-9]/.test(pw)) tips.push('Add a symbol such as ! or #.');
  bits = Math.max(0, bits);
  const secs = Math.pow(2, bits) / 1e10; // 10 billion guesses per second
  const units = [[31557600, 'years'], [86400, 'days'], [3600, 'hours'], [60, 'minutes']];
  let time = 'instantly';
  if (secs >= 1) {
    time = secs >= 31557600 * 1e6 ? 'millions of years' : null;
    if (!time) {
      const [d, name] = units.find(([d]) => secs >= d) || [1, 'seconds'];
      time = `${Math.round(secs / d).toLocaleString()} ${name}`;
    }
  }
  const level = bits < 28 ? 0 : bits < 40 ? 1 : bits < 60 ? 2 : bits < 80 ? 3 : 4;
  return { level, time, tips: tips.slice(0, 4) };
}

const LEVELS = ['Very weak', 'Weak', 'Fair', 'Strong', 'Very strong'];

function PasswordChecker() {
  const [pw, setPw] = useState('');
  const [show, setShow] = useState(false);
  const r = analyse(pw);
  return (
    <div className="checker">
      <div className="checker-row">
        <input type={show ? 'text' : 'password'} value={pw} onChange={(e) => setPw(e.target.value)}
          placeholder="Type a password to test…" autoComplete="off" spellCheck="false" aria-label="Password to test" />
        <button type="button" className="ghost" onClick={() => setShow(!show)}>{show ? 'Hide' : 'Show'}</button>
      </div>
      <div className="meter" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => <span key={i} className={r && i <= r.level ? `on l${r.level}` : ''} />)}
      </div>
      {r ? (
        <>
          <p className="verdict"><strong className={`l${r.level}`}>{LEVELS[r.level]}</strong> · could be cracked in about <strong>{r.time}</strong></p>
          {r.tips.length > 0 && <ul className="tips">{r.tips.map((t) => <li key={t}>{t}</li>)}</ul>}
        </>
      ) : <p className="verdict muted">Strength and tips will appear here.</p>}
      <p className="note">🔒 Checked only in your browser. Nothing is sent or saved. Still, don't type a password you really use.</p>
    </div>
  );
}

const QUIZ = [
  {
    from: 'PayPal Support <security@paypa1-verify.com>',
    subject: 'Your account has been limited!',
    body: 'We noticed unusual activity. Verify your identity within 24 hours or your account will be permanently closed. Click here to verify.',
    phish: true,
    why: 'The sender domain is "paypa1-verify.com" (number 1, not letter l), and it uses urgency and threats to rush you.',
  },
  {
    from: 'GitHub <noreply@github.com>',
    subject: '[GitHub] A new SSH key was added to your account',
    body: 'A new public key was added to your account. If you did this, no action is needed. If not, review your keys in Settings.',
    phish: false,
    why: 'Real domain, no link to click, no request for a password, and it tells you to check your settings yourself.',
  },
  {
    from: 'IT Helpdesk <it-helpdesk@company-support.net>',
    subject: 'Mailbox full: action required',
    body: 'Your mailbox is 99% full. Log in with your email and password on the page below to increase storage immediately.',
    phish: true,
    why: 'Your IT team uses your company domain, not an outside one, and never asks you to type your password into a link.',
  },
  {
    from: 'Your manager (via WhatsApp)',
    subject: 'Urgent favour, keep it quiet',
    body: "I'm in a meeting and can't call. Buy 5 gift cards for a client and send me the codes. I'll pay you back today.",
    phish: true,
    why: 'Classic gift-card scam: secrecy, urgency and an unusual payment method. Call your manager on a number you already know.',
  },
  {
    from: 'Amazon <shipment-tracking@amazon.com>',
    subject: 'Your order has shipped',
    body: 'Your order #402-1183 is on its way. You can track it any time from "Your Orders" in the Amazon app or website.',
    phish: false,
    why: 'Real domain, matches an order you expect, and it points you to the app instead of asking you to log in through a link.',
  },
];

function PhishingQuiz() {
  const [i, setI] = useState(0);
  const [pick, setPick] = useState(null);
  const [score, setScore] = useState(0);
  const done = i >= QUIZ.length;
  const q = QUIZ[i];

  const answer = (phish) => {
    if (pick !== null) return;
    setPick(phish);
    if (phish === q.phish) setScore(score + 1);
  };
  const next = () => { setI(i + 1); setPick(null); };
  const restart = () => { setI(0); setPick(null); setScore(0); };

  if (done) {
    const msg = score === QUIZ.length ? 'Perfect! You would be hard to phish.' : score >= 3 ? 'Good job. Review the ones you missed.' : 'Keep practising. Read our phishing article.';
    return (
      <div className="quiz">
        <p className="quiz-step">Result</p>
        <p className="quiz-score"><strong>{score}</strong> / {QUIZ.length}</p>
        <p>{msg}</p>
        <button type="button" onClick={restart}>Try again</button>
      </div>
    );
  }

  const right = pick !== null && pick === q.phish;
  return (
    <div className="quiz">
      <div className="quiz-top">
        <p className="quiz-step">Message {i + 1} of {QUIZ.length}</p>
        <div className="quiz-bar"><span style={{ width: `${(i / QUIZ.length) * 100}%` }} /></div>
      </div>
      <div className="mail" key={i}>
        <p><span>From:</span> {q.from}</p>
        <p><span>Subject:</span> <strong>{q.subject}</strong></p>
        <p className="mail-body">{q.body}</p>
      </div>
      <div className="quiz-actions">
        <button type="button" className={pick === false ? 'ghost picked' : 'ghost'} disabled={pick !== null} onClick={() => answer(false)}>✓ Looks safe</button>
        <button type="button" className={pick === true ? 'ghost picked' : 'ghost'} disabled={pick !== null} onClick={() => answer(true)}>⚠ Phishing</button>
      </div>
      {pick !== null && (
        <div className={right ? 'feedback ok' : 'feedback bad'} role="status">
          <strong>{right ? 'Correct!' : 'Not quite.'}</strong> This one is {q.phish ? 'phishing' : 'safe'}. {q.why}
          <div><button type="button" onClick={next}>{i + 1 < QUIZ.length ? 'Next message →' : 'See my score'}</button></div>
        </div>
      )}
    </div>
  );
}

const socialIcons = {
  github: 'M12 2a10 10 0 0 0-3.200 19.500c.500.100.700-.200.700-.500v-1.800c-2.800.600-3.400-1.200-3.400-1.200-.500-1.200-1.100-1.500-1.100-1.500-.900-.600.100-.600.100-.600 1 .100 1.500 1 1.500 1 .900 1.500 2.300 1.100 2.900.800.100-.600.300-1.100.600-1.300-2.200-.300-4.600-1.100-4.600-5 0-1.100.400-2 1-2.700-.100-.300-.400-1.300.100-2.700 0 0 .800-.300 2.700 1a9.400 9.400 0 0 1 5 0c1.900-1.300 2.700-1 2.700-1 .500 1.400.200 2.400.100 2.700.600.700 1 1.600 1 2.700 0 3.900-2.300 4.700-4.600 5 .400.300.700.900.700 1.800V21c0 .300.200.600.700.500A10 10 0 0 0 12 2z',
  linkedin: 'M4.500 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM3 9h3v12H3zm6 0h2.900v1.700c.500-.900 1.700-1.900 3.500-1.900 3.500 0 4.100 2.300 4.100 5.300V21h-3v-6c0-1.400 0-3.200-2-3.200s-2.200 1.500-2.200 3.100V21H9z',
  x: 'M17.800 3h3l-6.500 7.500L22 21h-6l-4.700-6.100L5.900 21h-3l7-8L2.500 3h6.100l4.300 5.600zm-1 16.200h1.700L7.700 4.700H5.900z',
  instagram: 'M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm5 5a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm5.500-2.200a1 1 0 1 0 0 2 1 1 0 0 0 0-2z',
  youtube: 'M21.600 7.200a2.500 2.500 0 0 0-1.800-1.800C18.200 5 12 5 12 5s-6.200 0-7.800.400A2.500 2.500 0 0 0 2.400 7.200C2 8.800 2 12 2 12s0 3.200.400 4.800a2.500 2.500 0 0 0 1.800 1.800C5.800 19 12 19 12 19s6.200 0 7.800-.400a2.500 2.500 0 0 0 1.800-1.800C22 15.200 22 12 22 12s0-3.200-.400-4.800zM10 15V9l5.200 3z',
};

function Footer() {
  const links = Object.entries(site.social).filter(([, url]) => url);
  const cats = [...new Set(articles.map((a) => a.category))];
  const to = (id) => ({ scrollTo: id, t: Date.now() });
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="f-brand">
          <Link to="/" className="logo" state={to('top')}>
            {site.logo && <img src={site.logo} alt="" className="logo-img" />}
            <span>{site.name.toUpperCase()}</span>
          </Link>
          <p>{site.tagline} Plain-language cyber security guidance for everyone.</p>
          {links.length > 0 && (
            <div className="socials">
              {links.map(([k, url]) => (
                <a key={k} href={url} target="_blank" rel="noopener noreferrer" aria-label={k}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d={socialIcons[k]} /></svg>
                </a>
              ))}
            </div>
          )}
        </div>
        <div>
          <h4>Quick links</h4>
          {navItems.map(([label, id]) => <Link key={id} to="/" state={to(id)}>{label}</Link>)}
        </div>
        <div>
          <h4>Topics</h4>
          {cats.map((c) => <Link key={c} to="/" state={to('blog')}>{c}</Link>)}
        </div>
        <div>
          <h4>Contact</h4>
          {site.email && <a href={`mailto:${site.email}`}>{site.email}</a>}
          <Link to="/" state={to('contact')}>Send us a message</Link>
          {site.phone && <a href={`tel:${site.phone.replace(/\s/g, '')}`}>{site.phone}</a>}
          {site.location && <span>{site.location}</span>}
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} {site.name}. Awareness only — not a substitute for professional advice.</span>
      </div>
    </footer>
  );
}

// Sends through Formspree when site.formspreeId is set; otherwise opens the visitor's email app addressed to site.email.
function ContactForm() {
  const empty = { name: '', email: '', message: '' };
  const [f, setF] = useState(empty);
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!site.formspreeId) {
      const body = `${f.message}\n\n— ${f.name} (${f.email})`;
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent('Website enquiry from ' + f.name)}&body=${encodeURIComponent(body)}`;
      setStatus('mailto');
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch(`https://formspree.io/f/${site.formspreeId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...f, _subject: `Website enquiry from ${f.name}` }),
      });
      if (!res.ok) throw new Error(res.status);
      setStatus('sent');
      setF(empty);
    } catch {
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <div className="contact sent" role="status">
        <p><strong>✓ Message sent.</strong> Thanks! We'll reply to your email soon.</p>
        <button type="button" className="ghost" onClick={() => setStatus('idle')}>Send another</button>
      </div>
    );
  }
  return (
    <form className="contact" onSubmit={submit}>
      <input required name="name" placeholder="Your name" value={f.name} onChange={set('name')} />
      <input required name="email" type="email" placeholder="Your email" value={f.email} onChange={set('email')} />
      <textarea required name="message" rows="4" placeholder="How can we help?" value={f.message} onChange={set('message')} />
      <button type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Send message'}</button>
      {status === 'mailto' && <p className="form-note" role="status">Your email app should open with this message ready to send. If it didn't, email us at <a href={`mailto:${site.email}`}>{site.email}</a>.</p>}
      {status === 'error' && <p className="form-error" role="alert">Couldn't send right now. Please email us at <a href={`mailto:${site.email}`}>{site.email}</a>.</p>}
    </form>
  );
}

function Home() {
  const [cat, setCat] = useState('All');
  const [q, setQ] = useState('');
  const { state } = useLocation();
  const categories = [...new Set(articles.map((a) => a.category))];
  const needle = q.toLowerCase();
  const list = articles.filter(
    (a) => (cat === 'All' || a.category === cat) &&
      (a.title + ' ' + a.summary + ' ' + a.content).toLowerCase().includes(needle)
  );

  useEffect(() => {
    if (!state?.scrollTo) return;
    if (state.scrollTo === 'top') window.scrollTo({ top: 0, behavior: 'smooth' });
    else document.getElementById(state.scrollTo)?.scrollIntoView({ behavior: 'smooth' });
  }, [state]);

  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <main className="home">
      <section id="top" className="hero">
        <div className="hero-text">
          <p className="prompt">$ secure --your-business</p>
          <p className="eyebrow">WE ARE {site.name}</p>
          <h1>Cyber Security Solutions</h1>
          <p className="lead">Discover comprehensive cyber security guidance tailored to your needs, fortifying your defenses and shielding your organization from evolving threats.</p>
          <div className="hero-cta">
            <button onClick={() => go('services')}>Learn more →</button>
            <button className="ghost" onClick={() => go('contact')}>Contact us</button>
          </div>
        </div>
        <img src={globeImg} alt="" className="hero-globe" />
        <div className="hero-stats">
          <div><strong><Counter to={articles.length} /></strong><span>Awareness Articles</span></div>
          <div><strong><Counter to={categories.length} /></strong><span>Security Topics</span></div>
        </div>
      </section>

      <section className="features">
        {features.map(([ic, t, d], i) => (
          <Reveal key={t} delay={i * 100} className="feature"><span className="ficon"><Icon name={ic} /></span><h3>{t}</h3><p>{d}</p></Reveal>
        ))}
      </section>

      <section id="about" className="block split">
        <Reveal className="split-text">
          <p className="kicker">About us</p>
          <h2>Making cyber security simple</h2>
          <p>{site.name} makes cyber security understandable. We turn complex threats into plain-language advice and simple habits that keep people and organizations safe.</p>
          <ul className="ticks">
            <li>Plain-language guidance, no jargon</li>
            <li>Practical steps you can use today</li>
            <li>Built for individuals and small teams</li>
          </ul>
        </Reveal>
        <Reveal delay={150} className="split-art"><Illustration name="about" /></Reveal>
      </section>

      <section id="services" className="block">
        <p className="kicker">Services</p>
          <h2>What we help with</h2>
        <div className="grid">
          {services.map(([ill, t, d], i) => (
            <Reveal key={t} delay={i * 120} className="svc">
              <div className="cover ph svc-cover" style={{ '--ill-a': serviceColors[ill][0], '--ill-b': serviceColors[ill][1] }}>
                <span className="cover-glow" aria-hidden="true" />
                <Illustration name={ill} />
                <span className="svc-num">0{i + 1}</span>
              </div>
              <div className="svc-body"><h3>{t}</h3><p>{d}</p></div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="blog" className="block">
        <p className="kicker">Blog</p>
          <h2>Latest security guides</h2>
        <div className="filters">
          <div className="chips">
            {['All', ...categories].map((c) => (
              <button key={c} className={c === cat ? 'chip active' : 'chip'} onClick={() => setCat(c)}>{c}</button>
            ))}
          </div>
          <input placeholder="Search articles…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="grid">
          {list.map((a, i) => <Reveal key={a.id} delay={(i % 3) * 100}><ArticleCard a={a} /></Reveal>)}
          {!list.length && <p>No articles match.</p>}
        </div>
      </section>

      <section id="tools" className="block">
        <p className="kicker">Tools</p>
          <h2>Test your security skills</h2>
        <div className="tools-grid">
          <Reveal>
            <h3 className="tool-title">Can you spot the phish?</h3>
            <PhishingQuiz />
          </Reveal>
          <Reveal delay={120}>
            <h3 className="tool-title">Password strength checker</h3>
            <PasswordChecker />
          </Reveal>
        </div>
      </section>

      <section id="checklist" className="checklist">
        <p className="kicker">Checklist</p>
          <h2>5 habits that keep you safe</h2>
        <ol>
          {checklist.map(([t, d]) => (
            <li key={t}><strong>{t}</strong><span>{d}</span></li>
          ))}
        </ol>
      </section>

      <section id="contact" className="block split">
        <Reveal className="split-text">
          <p className="kicker">Contact</p>
          <h2>Let's talk security</h2>
          <p>Questions or want a security check-up? Send us a message.</p>
          <ContactForm />
        </Reveal>
        <Reveal delay={150} className="split-art"><Illustration name="contact" /></Reveal>
      </section>
    </main>
  );
}

function Body({ text }) {
  const inline = (s) =>
    s.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
      part.startsWith('**') && part.endsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : part);
  return text.split(/\n{2,}/).map((block, i) => {
    const lines = block.split('\n');
    if (block.startsWith('## ')) return <h2 key={i}>{block.slice(3)}</h2>;
    if (lines.every((l) => l.startsWith('- '))) {
      return <ul key={i}>{lines.map((l, j) => <li key={j}>{inline(l.slice(2))}</li>)}</ul>;
    }
    return <p key={i}>{inline(block)}</p>;
  });
}

function Article() {
  const { id } = useParams();
  const a = articles.find((x) => x.id === Number(id));

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = a ? `${a.title} — ${site.name}` : site.name;
    return () => { document.title = site.name; };
  }, [a]);

  if (!a) return <main><p>Article not found. <Link to="/">Back to articles</Link></p></main>;
  const more = articles.filter((x) => x.id !== a.id).slice(0, 3);
  return (
    <main className="article">
      <ReadingProgress />
      <Link to="/" className="back">← All articles</Link>
      <small className="tag">{a.category}</small>
      <h1>{a.title}</h1>
      <small className="meta">{formatDate(a.date)} · {readingTime(a.content)} min read</small>
      <Cover a={a} big />
      <div className="prose"><Body text={a.content} /></div>
      <section>
        <p className="kicker">More articles</p>
          <h2 className="more">Keep reading</h2>
        <div className="grid">{more.map((x, i) => <Reveal key={x.id} delay={i * 100}><ArticleCard a={x} /></Reveal>)}</div>
      </section>
    </main>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/article/:id" element={<Article />} />
        <Route path="*" element={<main><p>Page not found. <Link to="/">Back to articles</Link></p></main>} />
      </Routes>
      <Footer />
      <BackToTop />
    </HashRouter>
  );
}
