// 3D Bohr atom — solid orbital rings in perspective
// Pure CSS 3D transforms, no WebGL needed.
// Dramatic version: glow, particle trails, energy flash on level change.

function BohrAtom({
  size = 520,
  accent = '#c4b5fd',
  speed = 1,
  tilt = 65,
  energyLevel = 0,
  darkMode = true,
  glow = true,
}) {
  const orbits = [
    { r: 0.20, electrons: 2, dur: 5,  phase: 0  },
    { r: 0.32, electrons: 4, dur: 9,  phase: 30 },
    { r: 0.44, electrons: 6, dur: 13, phase: 60 },
    { r: 0.56, electrons: 4, dur: 18, phase: 90 },
  ];

  const nucleusSize = size * 0.13;
  const fg = darkMode ? '#f5f3ee' : '#0a0a14';

  // Flash overlay when energyLevel changes
  const [flash, setFlash] = React.useState(0);
  const prev = React.useRef(energyLevel);
  React.useEffect(() => {
    if (prev.current !== energyLevel) {
      setFlash((f) => f + 1);
      prev.current = energyLevel;
    }
  }, [energyLevel]);

  return (
    <div
      className="bohr-atom"
      style={{
        width: size,
        height: size,
        position: 'relative',
        perspective: size * 2.5,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Ambient halo behind everything */}
      <div
        style={{
          position: 'absolute',
          inset: '-15%',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${accent}22 0%, ${accent}08 35%, transparent 65%)`,
          filter: 'blur(20px)',
          pointerEvents: 'none',
          animation: `bohr-halo ${8 / speed}s ease-in-out infinite`,
        }}
      />

      {/* Energy flash ring (triggered on level change) */}
      <div
        key={flash}
        style={{
          position: 'absolute',
          inset: '20%',
          borderRadius: '50%',
          border: `2px solid ${accent}`,
          opacity: 0,
          animation: 'bohr-flash 1.4s cubic-bezier(.2,.7,.2,1) forwards',
          pointerEvents: 'none',
          zIndex: 5,
        }}
      />

      {/* outer rotation cage */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transformStyle: 'preserve-3d',
          animation: `bohr-spin ${60 / speed}s linear infinite`,
          transform: `rotateX(${tilt}deg)`,
        }}
      >
        {orbits.map((o, i) => {
          const isExcited = i === energyLevel && energyLevel > 0;
          const isDimmed = energyLevel > 0 && i !== energyLevel;
          const ringSize = size * o.r * 2;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: ringSize,
                height: ringSize,
                marginLeft: -ringSize / 2,
                marginTop: -ringSize / 2,
                transformStyle: 'preserve-3d',
                animation: `bohr-orbit-${i} ${o.dur / speed}s linear infinite`,
              }}
            >
              {/* Outer glow ring (only when excited) */}
              {isExcited && (
                <div
                  style={{
                    position: 'absolute',
                    inset: '-3px',
                    borderRadius: '50%',
                    border: `3px solid ${accent}`,
                    filter: 'blur(8px)',
                    opacity: 0.7,
                  }}
                />
              )}
              {/* the solid ring */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  border: `1px solid ${isExcited ? accent : fg}`,
                  opacity: isExcited ? 1 : isDimmed ? 0.1 : 0.28,
                  boxShadow: isExcited
                    ? `0 0 32px ${accent}aa, inset 0 0 32px ${accent}55`
                    : 'none',
                  transition: 'all 0.8s cubic-bezier(.5,0,.2,1)',
                }}
              />
              {/* electrons on the ring */}
              {Array.from({ length: o.electrons }).map((_, j) => {
                const angle = (360 / o.electrons) * j;
                const eSize = isExcited ? size * 0.032 : size * 0.022;
                const trailLen = isExcited ? 60 : 30;
                return (
                  <div
                    key={j}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      width: 0,
                      height: 0,
                      transform: `rotateZ(${angle}deg) translateX(${ringSize / 2}px)`,
                    }}
                  >
                    {/* Trail behind electron */}
                    <div
                      style={{
                        position: 'absolute',
                        width: trailLen,
                        height: eSize * 0.6,
                        marginLeft: -trailLen,
                        marginTop: -eSize * 0.3,
                        background: `linear-gradient(to right, transparent, ${accent}${isExcited ? 'cc' : '66'})`,
                        opacity: isExcited ? 0.9 : 0.5,
                        filter: 'blur(2px)',
                        borderRadius: '50%',
                        transition: 'all 0.6s ease',
                      }}
                    />
                    {/* Electron core */}
                    <div
                      style={{
                        position: 'absolute',
                        width: eSize,
                        height: eSize,
                        marginLeft: -eSize / 2,
                        marginTop: -eSize / 2,
                        borderRadius: '50%',
                        background: `radial-gradient(circle at 35% 35%, #fff, ${accent} 60%)`,
                        boxShadow: glow
                          ? `0 0 ${eSize * 2}px ${accent}, 0 0 ${eSize * 4}px ${accent}aa, 0 0 ${eSize * 8}px ${accent}55`
                          : 'none',
                        transition: 'all 0.6s ease',
                      }}
                    />
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* nucleus */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: nucleusSize,
            height: nucleusSize,
            marginLeft: -nucleusSize / 2,
            marginTop: -nucleusSize / 2,
            borderRadius: '50%',
            transform: `rotateX(${-tilt}deg)`,
          }}
        >
          {/* outer glow halo */}
          <div
            style={{
              position: 'absolute',
              inset: '-100%',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${accent}88 0%, ${accent}22 30%, transparent 60%)`,
              filter: 'blur(8px)',
              animation: `bohr-pulse ${3 / speed}s ease-in-out infinite`,
            }}
          />
          {/* core */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              background: `radial-gradient(circle at 30% 30%, #fff, ${accent} 40%, ${accent}88 80%)`,
              boxShadow: `0 0 ${nucleusSize * 0.8}px ${accent}, 0 0 ${nucleusSize * 1.6}px ${accent}aa`,
              animation: `bohr-pulse ${4 / speed}s ease-in-out infinite`,
            }}
          />
          {/* inner highlight */}
          <div
            style={{
              position: 'absolute',
              inset: '20%',
              borderRadius: '50%',
              background: `radial-gradient(circle at 30% 30%, #fff, ${accent}cc 50%, transparent 80%)`,
            }}
          />
        </div>
      </div>

      {/* keyframes */}
      <style>{`
        @keyframes bohr-spin {
          from { transform: rotateX(${tilt}deg) rotateY(0deg); }
          to   { transform: rotateX(${tilt}deg) rotateY(360deg); }
        }
        ${orbits
          .map(
            (o, i) => `
          @keyframes bohr-orbit-${i} {
            from { transform: rotateZ(${o.phase}deg) rotateY(0deg); }
            to   { transform: rotateZ(${o.phase}deg) rotateY(360deg); }
          }`
          )
          .join('\n')}
        @keyframes bohr-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%      { transform: scale(1.12); opacity: 0.85; }
        }
        @keyframes bohr-halo {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50%      { transform: scale(1.15); opacity: 1; }
        }
        @keyframes bohr-flash {
          0%   { transform: scale(0.4); opacity: 0; border-width: 2px; }
          30%  { opacity: 1; }
          100% { transform: scale(2.2); opacity: 0; border-width: 1px; }
        }
      `}</style>
    </div>
  );
}

window.BohrAtom = BohrAtom;
