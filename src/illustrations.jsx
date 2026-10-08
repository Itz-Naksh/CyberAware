// Animated SVG illustrations, one per topic. Colours come from CSS (.ill) so they follow the theme.
const art = {
  Phishing: (
    <>
      <rect className="ill-fill" x="40" y="70" width="140" height="92" rx="10" />
      <path className="ill-stroke" d="M40 80l70 52 70-52" />
      <g className="ill-bob">
        <path className="ill-accent" d="M150 20v34a14 14 0 1 1-14-14" />
        <circle className="ill-dot" cx="136" cy="40" r="4" />
      </g>
    </>
  ),
  Accounts: (
    <>
      <rect className="ill-fill" x="62" y="82" width="96" height="76" rx="10" />
      <path className="ill-accent" d="M80 82V62a30 30 0 0 1 60 0v20" />
      <circle className="ill-dot ill-pulse" cx="110" cy="116" r="9" />
      <path className="ill-stroke" d="M110 124v16" />
      <g className="ill-dots">
        <circle cx="84" cy="176" r="4" /><circle cx="104" cy="176" r="4" /><circle cx="124" cy="176" r="4" /><circle cx="144" cy="176" r="4" />
      </g>
    </>
  ),
  Malware: (
    <>
      <path className="ill-fill" d="M110 24l62 22v50c0 40-26 66-62 78-36-12-62-38-62-78V46z" />
      <g className="ill-bob" transform="translate(110 100)">
        <ellipse className="ill-accent" rx="16" ry="20" />
        <path className="ill-accent" d="M-16-4h-14M16-4h14M-16 8h-14M16 8h14M-8-20l-8-12M8-20l8-12" />
      </g>
      <path className="ill-scan" d="M62 100h96" />
    </>
  ),
  Network: (
    <>
      <rect className="ill-fill" x="50" y="126" width="120" height="36" rx="8" />
      <circle className="ill-dot" cx="72" cy="144" r="4" /><circle className="ill-dot ill-pulse" cx="92" cy="144" r="4" />
      <path className="ill-stroke" d="M110 126V102" />
      <path className="ill-accent ill-wave w1" d="M84 84a36 36 0 0 1 52 0" />
      <path className="ill-accent ill-wave w2" d="M68 66a60 60 0 0 1 84 0" />
      <path className="ill-accent ill-wave w3" d="M52 48a84 84 0 0 1 116 0" />
    </>
  ),
  'Social Engineering': (
    <>
      <circle className="ill-fill" cx="86" cy="104" r="26" />
      <path className="ill-fill" d="M38 178c4-30 24-44 48-44s44 14 48 44z" />
      <g className="ill-bob">
        <rect className="ill-accent" x="112" y="38" width="76" height="46" rx="12" />
        <path className="ill-accent" d="M126 84l-4 18 22-18" />
        <circle className="ill-dot" cx="132" cy="61" r="4" /><circle className="ill-dot" cx="150" cy="61" r="4" /><circle className="ill-dot" cx="168" cy="61" r="4" />
      </g>
    </>
  ),
  Basics: (
    <>
      <path className="ill-fill" d="M110 24l62 22v50c0 40-26 66-62 78-36-12-62-38-62-78V46z" />
      <path className="ill-accent ill-draw" d="M80 100l22 22 40-44" />
    </>
  ),
  about: (
    <>
      <circle className="ill-ring" cx="110" cy="100" r="74" />
      <path className="ill-fill" d="M110 44l44 16v36c0 28-18 46-44 54-26-8-44-26-44-54V60z" />
      <circle className="ill-dot ill-pulse" cx="110" cy="92" r="9" />
      <path className="ill-accent" d="M110 101v22" />
    </>
  ),
  contact: (
    <>
      <path className="ill-trail" d="M18 178C44 176 52 150 62 132S72 108 82 100" />
      <g className="ill-fly">
        <path className="ill-fill" d="M196 34L66 88l44 16z" />
        <path className="ill-fill" d="M196 34l-86 70 14 46 22-30z" />
        <path className="ill-accent" d="M196 34L110 104M124 150l-14-46" />
      </g>
      <g className="ill-bob">
        <rect className="ill-fill" x="18" y="40" width="70" height="44" rx="12" />
        <path className="ill-fill" d="M34 84l-6 16 20-16" />
        <circle className="ill-dot typing t1" cx="38" cy="62" r="4" />
        <circle className="ill-dot typing t2" cx="53" cy="62" r="4" />
        <circle className="ill-dot typing t3" cx="68" cy="62" r="4" />
      </g>
      <g className="ill-bob" style={{ animationDelay: '1.200s' }}>
        <circle className="ill-fill" cx="176" cy="150" r="18" />
        <text x="176" y="157" textAnchor="middle" className="ill-at">@</text>
      </g>
    </>
  ),
  training: (
    <>
      <rect className="ill-fill" x="34" y="38" width="152" height="104" rx="10" />
      <path className="ill-stroke" d="M92 166h36M110 142v24" />
      <path className="ill-stroke" d="M50 122h120" opacity=".35" />
      <path className="ill-accent ill-draw" d="M54 112l26-24 20 14 30-34 22 12" />
      <circle className="ill-dot ill-pulse" cx="152" cy="80" r="5" />
      <g className="ill-bob">
        <circle className="ill-fill" cx="176" cy="44" r="20" />
        <path className="ill-accent" d="M168 44l6 6 11-12" />
      </g>
      <path className="ill-dot" d="M46 52l12 7-12 7z" />
    </>
  ),
  risk: (
    <>
      <circle className="ill-fill" cx="110" cy="100" r="78" />
      <circle className="ill-stroke" cx="110" cy="100" r="52" opacity=".45" />
      <circle className="ill-stroke" cx="110" cy="100" r="26" opacity=".45" />
      <path className="ill-stroke" d="M32 100h156M110 22v156" opacity=".25" />
      <g className="ill-sweep">
        <path d="M110 100L110 22A78 78 0 0 1 177 61Z" fill="url(#sweep)" />
        <path className="ill-accent" d="M110 100V22" />
      </g>
      <circle className="ill-blip b1" cx="146" cy="70" r="6" />
      <circle className="ill-blip b2" cx="80" cy="132" r="5" />
      <circle className="ill-blip b3" cx="138" cy="140" r="4" />
      <defs>
        <linearGradient id="sweep" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="var(--b)" stopOpacity=".55" /><stop offset="1" stopColor="var(--b)" stopOpacity="0" />
        </linearGradient>
      </defs>
    </>
  ),
  incident: (
    <>
      <circle className="ill-ring-out r1" cx="110" cy="100" r="40" />
      <circle className="ill-ring-out r2" cx="110" cy="100" r="40" />
      <path className="ill-fill" d="M110 30l60 22v46c0 38-25 62-60 74-35-12-60-36-60-74V52z" />
      <path className="ill-accent" d="M110 64l30 52H80z" />
      <path className="ill-stroke ill-pulse" d="M110 82v16" />
      <circle className="ill-dot" cx="110" cy="106" r="3.500" />
      <path className="ill-dot ill-bob" d="M168 30l-12 22h10l-8 20 20-28h-11l9-14z" />
    </>
  ),
};

export default function Illustration({ name, className = '' }) {
  return (
    <svg className={`ill ${className}`} viewBox="0 0 220 200" role="img" aria-label={`${name} illustration`}>
      {art[name] || art.Basics}
    </svg>
  );
}
