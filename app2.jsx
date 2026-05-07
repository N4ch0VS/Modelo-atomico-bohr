// Interactive version — drag-to-rotate atom, build-your-atom, model comparison, spectrum simulator
const { useState, useEffect, useRef, useCallback } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "dark"
}/*EDITMODE-END*/;

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-stagger');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function useNavScrolled() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return scrolled;
}

function Nav() {
  const scrolled = useNavScrolled();
  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`} data-screen-label="Nav">
      <div className="nav-brand">Niels<span className="dot">·</span>Bohr</div>
      <div className="nav-links">
        <a href="#bio">Bohr</a>
        <a href="#construye">Construye</a>
        <a href="#compara">Modelos</a>
        <a href="#energia">Energía</a>
        <a href="#espectro">Espectro</a>
      </div>
      <div className="nav-meta">INTERACTIVO — ES</div>
    </nav>
  );
}

function Hero({ accent, theme }) {
  return (
    <section className="hero" data-screen-label="01 Hero">
      <div className="grid-bg" />
      <div className="hero-text">
        <div className="eyebrow reveal">Quimica-ETec · 2026</div>
        <h1 className="display reveal" style={{ transitionDelay: '0.1s' }}>
          EL modelo atómico<br/>
          de <em>Bohr.</em>
        </h1>
        <p className="lede reveal" style={{ marginTop: '40px', transitionDelay: '0.25s' }}>
          Presentacion sobre el modelo atómico de Bohr, su historia, sus postulados, y su legado. Incluye visualizaciones interactivas para explorar el átomo y sus niveles de energía.
        </p>
        <div className="hero-meta reveal-stagger">
          <div className="hero-meta-item">
            <div className="label">Autor</div>
            <div className="value">Niels Bohr</div>
          </div>
          <div className="hero-meta-item">
            <div className="label">Año</div>
            <div className="value">1913</div>
          </div>
          <div className="hero-meta-item">
            <div className="label">Modo</div>
            <div className="value">Interactivo</div>
          </div>
        </div>
      </div>
      <div className="hero-atom-wrap" style={{ position: 'relative' }}>
        <InteractiveAtom
          size={Math.min(560, window.innerWidth * 0.4)}
          accent={accent}
          baseSpeed={1}
          energyLevel={0}
          darkMode={theme === 'dark'}
        />
        <div className="drag-hint">Arrastra para rotar →</div>
      </div>
    </section>
  );
}

function Bio() {
  return (
    <section className="bio" id="bio" data-screen-label="02 Biografia">
      <div className="container">
        <div className="bio-grid">
          <div className="bio-portrait reveal">
            <div className="bio-portrait-corners" />
            <div className="bio-portrait-meta" style={{ width: '100%', height: '100%', padding: 0 }}>
             <div style={{ width: '100%', height: '100%' }}>
               <img src="/uploads/niels bohr.jpg" alt="portrait of Niels Bohr" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
             </div>
            </div>
          </div>
          <div className="bio-content">
            <div className="eyebrow reveal">Sobre el </div>
            <h2 className="title reveal">
              El hombre que pensó<br/>el átomo en <em>capas.</em>
            </h2>
            <p className="body reveal" style={{ marginTop: 32 }}>
              Niels Bohr nació en Copenhague en 1885. Estudió física en la
              Universidad de Copenhague y a los 26 años viajó a Inglaterra
              para trabajar con Ernest Rutherford. Allí encontró el problema
              que lo obsesionaría: si los electrones giraban alrededor del
              núcleo, ¿por qué no caían sobre él?
            </p>
            <p className="body reveal" style={{ marginTop: 20 }}>
              Su respuesta llegó despues en 1913 en tres artículos que cambiarían
              la ciencia. En 1922 recibió el Premio Nobel de Física. Más
              tarde fundaría en Copenhague un instituto que se convertiría
              en uno de los mas importantes de la física del siglo XX.
            </p>
            <div className="bio-facts reveal-stagger">
              <div className="bio-fact">
                <div className="label">Nacimiento</div>
                <div className="value">7 oct. 1885 · Copenhague</div>
              </div>
              <div className="bio-fact">
                <div className="label">Premio Nobel</div>
                <div className="value">Física, 1922</div>
              </div>
              <div className="bio-fact">
                <div className="label">Maestro</div>
                <div className="value">Ernest Rutherford</div>
              </div>
              <div className="bio-fact">
                <div className="label">Legado</div>
                <div className="value">Instituto de Copenhague</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Postulados() {
  const items = [
    { n: '1', title: 'Órbitas ', body: 'Los electrones no pueden estar a cualquier distancia del núcleo. Solo pueden estar en "Capas y dependiendo de la capa pueden haber mas o menos electrones"', tag: 'Cuantización' },
    { n: '2', title: 'Estabilidad ', body: 'Mientras un electrón se mantiene en su órbita asignada, no pierde energía ni cae hacia el núcleo. Es estable.', tag: 'Estado estacionario' },
    { n: '3', title: 'Saltos de energía', body: 'Un electrón puede saltar de un piso a otro — pero solo si recibe o entrega exactamente la energía necesaria. Cuando salta hacia abajo, libera esa diferencia en forma de luz.', tag: 'Emisión y absorción' },
  ];
  return (
    <section className="postulados" id="modelo" data-screen-label="03 Postulados">
      <div className="container">
        <div className="container-narrow" style={{ margin: 0 }}>
          <div className="eyebrow reveal">El modelo</div>
          <h2 className="title reveal">
            Tres ideas <em>sencillas.</em><br/>
            Un cambio de paradigma.
          </h2>
        </div>
        <div className="postulados-grid">
          {items.map((p, i) => (
            <div key={i} className="postulado reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
              <div className="postulado-num">{p.n}</div>
              <div className="postulado-title">{p.title}</div>
              <div className="postulado-body">{p.body}</div>
              <div className="postulado-tag">— {p.tag}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===== BUILD YOUR ATOM =====
function BuildAtom({ accent, theme }) {
  const [shells, setShells] = useState([2, 4, 0, 0]);
  const maxes = [2, 8, 18, 8];
  const total = shells.reduce((a, b) => a + b, 0);

  // Element name lookup based on total electrons (neutral atom)
  const elements = {
    1: ['H', 'Hidrógeno'], 2: ['He', 'Helio'], 3: ['Li', 'Litio'],
    4: ['Be', 'Berilio'], 5: ['B', 'Boro'], 6: ['C', 'Carbono'],
    7: ['N', 'Nitrógeno'], 8: ['O', 'Oxígeno'], 9: ['F', 'Flúor'],
    10: ['Ne', 'Neón'], 11: ['Na', 'Sodio'], 12: ['Mg', 'Magnesio'],
    13: ['Al', 'Aluminio'], 14: ['Si', 'Silicio'], 15: ['P', 'Fósforo'],
    16: ['S', 'Azufre'], 17: ['Cl', 'Cloro'], 18: ['Ar', 'Argón'],
  };
  const el = elements[total] || ['?', 'Configuración personalizada'];

  const update = (i, delta) => {
    setShells((s) => {
      const next = [...s];
      next[i] = Math.max(0, Math.min(maxes[i], next[i] + delta));
      return next;
    });
  };

  return (
    <section className="build" id="construye" data-screen-label="04 Construye">
      <div className="container">
        <div className="container-narrow" style={{ margin: '0 0 64px' }}>
          <div className="eyebrow reveal">Construye tu átomo</div>
          <h2 className="title reveal">
            Añade y quita<br/>
            <em>electrones.</em>
          </h2>
          <p className="body reveal" style={{ marginTop: 24 }}>
            Cada capa tiene un número máximo de electrones que puede
            albergar. Llena las capas en orden y descubre qué elemento
            estás construyendo.
          </p>
        </div>

        <div className="build-grid">
          <div className="reveal" style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <InteractiveAtom
              size={500}
              accent={accent}
              baseSpeed={0.8}
              energyLevel={0}
              electronCounts={shells}
              darkMode={theme === 'dark'}
            />
            <div className="drag-hint">Arrastra el átomo</div>
          </div>

          <div className="reveal">
            {shells.map((count, i) => (
              <div key={i} className="shell-control">
                <div className="shell-info">
                  <div className="shell-dot" />
                  <div>
                    <div className="shell-label">Capa n = {i + 1}</div>
                    <div className="shell-cap">Máx. {maxes[i]} electrones</div>
                  </div>
                </div>
                <div className="shell-buttons">
                  <button className="shell-btn" onClick={() => update(i, -1)} disabled={count === 0}>−</button>
                  <div className="shell-count">{count}</div>
                  <button className="shell-btn" onClick={() => update(i, 1)} disabled={count >= maxes[i]}>+</button>
                </div>
              </div>
            ))}
            <div className="total-electrons">
              <div className="label">Total de electrones</div>
              <div className="value">{total}</div>
            </div>
            <div className="element-name">
              <strong>{el[0]}</strong>{el[1]}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ===== MODELS COMPARISON =====
function ModelGlyph({ kind, accent }) {
  // Simple visual representations (not a real Bohr atom)
  if (kind === 'dalton') {
    return (
      <div style={{
        width: 200, height: 200, borderRadius: '50%',
        background: `radial-gradient(circle at 35% 35%, #fff, ${accent} 50%, ${accent}66 100%)`,
        boxShadow: `0 0 60px ${accent}55`,
      }} />
    );
  }
  if (kind === 'thomson') {
    return (
      <div style={{
        width: 220, height: 220, borderRadius: '50%',
        background: `radial-gradient(circle at 35% 35%, ${accent}88, ${accent}33 70%)`,
        position: 'relative', overflow: 'hidden',
        boxShadow: `0 0 60px ${accent}55`,
      }}>
        {[[60,40],[140,60],[80,120],[150,140],[110,180],[40,150],[170,90],[100,80]].map(([x,y],i)=>(
          <div key={i} style={{
            position: 'absolute', left: x, top: y,
            width: 14, height: 14, borderRadius: '50%',
            background: '#fff', boxShadow: `0 0 12px #fff`,
          }}/>
        ))}
      </div>
    );
  }
  if (kind === 'rutherford') {
    return (
      <div style={{ width: 240, height: 240, position: 'relative' }}>
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          border: `1px dashed ${accent}66`,
        }}/>
        <div style={{
          position: 'absolute', inset: '20%', borderRadius: '50%',
          border: `1px dashed ${accent}66`,
        }}/>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          width: 30, height: 30, marginLeft: -15, marginTop: -15,
          borderRadius: '50%',
          background: `radial-gradient(circle at 35% 35%, #fff, ${accent})`,
          boxShadow: `0 0 24px ${accent}`,
        }}/>
        {[0, 90, 180, 270].map((a,i)=>(
          <div key={i} style={{
            position: 'absolute', top: '50%', left: '50%',
            width: 0, height: 0,
            transform: `rotate(${a}deg) translateX(120px)`,
          }}>
            <div style={{
              width: 10, height: 10, borderRadius: '50%',
              marginLeft: -5, marginTop: -5,
              background: accent,
              boxShadow: `0 0 12px ${accent}`,
            }}/>
          </div>
        ))}
      </div>
    );
  }
  // bohr
  return (
    <InteractiveAtom size={260} accent={accent} baseSpeed={1.2} energyLevel={0} draggable={false} />
  );
}

function Compare({ accent, theme }) {
  const [active, setActive] = useState(3);
  const models = [
    {
      year: '1803', name: 'Dalton',
      title: 'La esfera sólida.',
      key: 'El átomo es indivisible. Una bola maciza, indestructible.',
      body: 'Dalton imaginó al átomo como la unidad mínima de la materia: una pequeña esfera sólida y compacta. No tenía interior. No tenía partes. Era simplemente la pieza más pequeña posible.',
      kind: 'dalton',
    },
    {
      year: '1904', name: 'Thomson',
      title: 'Nube.',
      key: 'Una nube positiva con electrones esparcidos como pasas en un postre.',
      body: 'Thomson descubrió el electrón y propuso que los átomos eran nubes de carga positiva con electrones incrustados en su interior. Era la primera vez que el átomo tenía una estructura interna.',
      kind: 'thomson',
    },
    {
      year: '1911', name: 'Rutherford',
      title: 'El sistema solar.',
      key: 'Un núcleo diminuto en el centro, electrones girando alrededor.',
      body: 'Rutherford disparó partículas a una lámina de oro y descubrió que el átomo era casi todo vacío: una mota densa en el centro y electrones lejanos. Pero su modelo no explicaba por qué los electrones no caían al núcleo.',
      kind: 'rutherford',
    },
    {
      year: '1913', name: 'Bohr',
      title: 'Las órbitas en pisos.',
      key: 'Electrones en niveles fijos. Saltan entre ellos emitiendo luz.',
      body: 'Bohr resolvió la paradoja: los electrones solo pueden estar en ciertas órbitas permitidas. Mientras estén ahí, son estables. Cuando saltan entre niveles, absorben o emiten energía en cantidades exactas. Por primera vez, el átomo era cuantizado.',
      kind: 'bohr',
    },
  ];
  const m = models[active];

  return (
    <section className="compare" id="compara" data-screen-label="05 Modelos">
      <div className="container">
        <div className="container-narrow" style={{ margin: 0 }}>
          <div className="eyebrow reveal">Línea de modelos</div>
          <h2 className="title reveal">
            Diferentes<br/>
             <em>modelos</em>
          </h2>
          <p className="body reveal" style={{ marginTop: 24 }}>
            Cada generación de físicos heredó el átomo de la anterior y le
            añadió una capa de detalle. Haz click en cada modelo para verlos
            evolucionar.
          </p>
        </div>

        <div className="compare-tabs reveal">
          {models.map((mm, i) => (
            <button
              key={i}
              className={`compare-tab ${active === i ? 'active' : ''}`}
              onClick={() => setActive(i)}
            >
              <div className="year">{mm.year}</div>
              <div className="name">{mm.name}</div>
            </button>
          ))}
        </div>

        <div className="compare-stage">
          <div className="compare-viz" key={active}>
            <ModelGlyph kind={m.kind} accent={accent} />
          </div>
          <div className="compare-content" key={`c${active}`}>
            <h3>{m.title}</h3>
            <div className="key-idea">"{m.key}"</div>
            <p>{m.body}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ===== ENERGY (with electron-click trigger) =====
function Energy({ accent, theme }) {
  const [level, setLevel] = useState(0);
  const labels = [
    { n: 0, label: 'Estado base', desc: 'El electrón descansa en su nivel más bajo. Estable, sin emitir luz.' },
    { n: 1, label: 'Excitado · n=2', desc: 'El átomo absorbió energía. El electrón saltó al segundo piso.' },
    { n: 2, label: 'Excitado · n=3', desc: 'Más energía, salto mayor. Al regresar liberará un fotón mayor.' },
    { n: 3, label: 'Excitado · n=4', desc: 'Salto al cuarto nivel. Cada caída produce luz de un color específico.' },
  ];

  return (
    <section className="energy" id="energia" data-screen-label="06 Energia">
      <div className="container">
        <div className="energy-grid">
          <div className="energy-stage reveal" style={{ position: 'relative' }}>
            <InteractiveAtom
              size={520}
              accent={accent}
              baseSpeed={1.4}
              energyLevel={level}
              darkMode={theme === 'dark'}
              onElectronClick={(shell) => setLevel(shell)}
            />
            <div className="drag-hint">Arrastra · Clic en electrón</div>
          </div>
          <div>
            <div className="eyebrow reveal">Niveles de energía</div>
            <h2 className="title reveal">
              Cuando un electrón<br/><em>salta.</em>
            </h2>
            <p className="body reveal" style={{ marginTop: 24 }}>
              Haz click en cualquier electrón del átomo — o usa los botones —
              para excitarlo a ese nivel. Verás el flash de energía y el
              cambio de estado.
            </p>
            <div className="energy-controls reveal">
              {labels.map((l) => (
                <button key={l.n} className={`energy-btn ${level === l.n ? 'active' : ''}`} onClick={() => setLevel(l.n)}>
                  n={l.n + 1}
                </button>
              ))}
            </div>
            <div className="leap-explainer reveal">
              <div className="label">{labels[level].label}</div>
              <p key={level}>{labels[level].desc}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ===== SPECTRUM SIMULATOR =====
function Spectrum({ accent }) {
  // Hydrogen Balmer-like visible lines (illustrative, not precise)
  const lines = [
    { pos: 12, color: '#a855f7', name: 'Violeta', from: 'n=6 → n=2', desc: 'El salto más grande del visible. Muy alta energía, casi ultravioleta.' },
    { pos: 22, color: '#6366f1', name: 'Índigo', from: 'n=5 → n=2', desc: 'Una línea profunda. Característica del hidrógeno frío.' },
    { pos: 35, color: '#06b6d4', name: 'Cian', from: 'n=4 → n=2', desc: 'El segundo salto del electrón hacia el segundo piso.' },
    { pos: 78, color: '#ef4444', name: 'Rojo H-alfa', from: 'n=3 → n=2', desc: 'La línea más famosa del hidrógeno. Tiñe de rojo las nebulosas del cosmos.' },
  ];
  const [active, setActive] = useState(3);

  return (
    <section className="spectrum" id="espectro" data-screen-label="07 Espectro">
      <div className="container">
        <div className="spectrum-grid">
          <div>
            <div className="eyebrow reveal">Simulador</div>
            <h2 className="title reveal">
              Cada salto,<br/>
              un <em>color.</em>
            </h2>
            <p className="body reveal" style={{ marginTop: 24 }}>
              Cuando un electrón cae de un nivel alto al segundo, emite luz
              visible. Cada salto produce un color exacto. Esta es la huella
              dactilar del hidrógeno — la misma que ves en las estrellas.
            </p>
            <p className="body reveal" style={{ marginTop: 16, fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '0.05em', color: 'var(--fg-faint)' }}>
              Haz click en una línea del espectro →
            </p>
          </div>

          <div className="reveal">
            <div className="spectrum-bar">
              {/* Continuous gradient */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(90deg, #2a0033 0%, #4f00ff 15%, #00aaff 35%, #00ff88 50%, #ffee00 65%, #ff7700 80%, #cc0000 100%)',
                opacity: 0.08,
              }} />
              {lines.map((l, i) => (
                <div
                  key={i}
                  className="spectrum-line"
                  onClick={() => setActive(i)}
                  style={{
                    left: `${l.pos}%`,
                    background: l.color,
                    color: l.color,
                    width: active === i ? 4 : 2,
                    opacity: active === i ? 1 : 0.7,
                  }}
                />
              ))}
              {/* Tick marks */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                height: 8,
                background: 'linear-gradient(90deg, transparent, transparent 9.9%, var(--line) 9.9%, var(--line) 10%, transparent 10%, transparent 19.9%, var(--line) 19.9%, var(--line) 20%, transparent 20%, transparent 29.9%, var(--line) 29.9%, var(--line) 30%, transparent 30%, transparent 39.9%, var(--line) 39.9%, var(--line) 40%, transparent 40%, transparent 49.9%, var(--line) 49.9%, var(--line) 50%, transparent 50%, transparent 59.9%, var(--line) 59.9%, var(--line) 60%, transparent 60%, transparent 69.9%, var(--line) 69.9%, var(--line) 70%, transparent 70%, transparent 79.9%, var(--line) 79.9%, var(--line) 80%, transparent 80%, transparent 89.9%, var(--line) 89.9%, var(--line) 90%, transparent 90%)',
              }} />
            </div>
            <div className="spectrum-info" key={active}>
              <div className="label" style={{ color: lines[active].color }}>
                {lines[active].name} · {lines[active].from}
              </div>
              <div className="desc">{lines[active].desc}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Legacy() {
  const cards = [
    { n: '01 / Espectroscopía', title: 'Leer la luz de las estrellas.', body: 'El modelo explicó por qué cada elemento emite luz en patrones únicos. Hoy podemos saber de qué está hecha una estrella a millones de años luz simplemente analizando su luz.' },
    { n: '02 / Tabla periódica', title: 'Por qué los elementos se parecen.', body: 'Las "capas" de Bohr explicaron por qué ciertos elementos comparten propiedades químicas. La tabla periódica dejó de ser una lista para convertirse en un mapa.' },
    { n: '03 / Tecnología moderna', title: 'De los láseres a los LEDs.', body: 'Cada vez que un LED enciende, un electrón salta entre niveles según las reglas de Bohr. Las pantallas, los láseres, la fibra óptica — todo descansa sobre esta idea.' },
    { n: '04 / La ruta a lo cuántico', title: 'El primer paso del salto.', body: 'Aunque hoy sabemos que los átomos son más extraños de lo que Bohr imaginaba, su modelo fue el puente: la primera vez que la física aceptó que el mundo, a escala pequeña, funciona en saltos.' },
  ];
  return (
    <section className="legacy" id="legado" data-screen-label="09 Legado">
      <div className="container">
        <div className="container-narrow" style={{ margin: 0 }}>
          <div className="eyebrow reveal">Legado</div>
          <h2 className="title reveal">
            Lo que el modelo<br/>nos <em>regaló.</em>
          </h2>
        </div>
        <div className="legacy-grid">
          {cards.map((c, i) => (
            <div key={i} className="legacy-card reveal" style={{ transitionDelay: `${i * 0.08}s` }}>
              <div className="accent-mark" />
              <div className="num">{c.n}</div>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-mark">Niels<em>Bohr</em></div>
          <div className="footer-meta">
            Quimica 3E <br/>
            <br/>Juan Ignacio Calderon<br/>
            Delfina Garcia<br/>
            Lautaro andres militello<br/>2026<br/>
          </div>
        </div>
      </div>
    </footer>
  );
}

function TweaksUI() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', t.theme);
  }, [t.theme]);
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Apariencia">
        <TweakRadio
          label="Tema"
          value={t.theme}
          onChange={(v) => setTweak('theme', v)}
          options={['dark', 'light']}
        />
      </TweakSection>
    </TweaksPanel>
  );
}

function App() {
  useReveal();
  const [theme, setTheme] = useState(TWEAK_DEFAULTS.theme);
  useEffect(() => {
    const obs = new MutationObserver(() => {
      const t = document.documentElement.getAttribute('data-theme') || 'dark';
      setTheme(t);
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    document.documentElement.setAttribute('data-theme', TWEAK_DEFAULTS.theme);
    return () => obs.disconnect();
  }, []);
  const accent = theme === 'dark' ? '#c4b5fd' : '#6d5fbf';
  return (
    <>
      <Nav />
      <Hero accent={accent} theme={theme} />
      <Bio />
      <Postulados />
      <BuildAtom accent={accent} theme={theme} />
      <Energy accent={accent} theme={theme} />
      <Spectrum accent={accent} />
      <Compare accent={accent} theme={theme} />
      <Legacy />
      <Footer />
      <TweaksUI />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('app')).render(<App />);
