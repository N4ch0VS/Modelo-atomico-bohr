// Atom with mouse-drag rotation + click-to-excite electrons
const { useState, useEffect, useRef } = React;

function InteractiveAtom({
  size = 520,
  accent = '#c4b5fd',
  baseSpeed = 1,
  energyLevel = 0,
  onElectronClick,
  electronCounts = [2, 4, 6, 4],
  darkMode = true,
  draggable = true,
}) {
  const orbits = [
    { r: 0.20, dur: 5,  phase: 0  },
    { r: 0.32, dur: 9,  phase: 30 },
    { r: 0.44, dur: 13, phase: 60 },
    { r: 0.56, dur: 18, phase: 90 },
  ].map((o, i) => ({ ...o, electrons: electronCounts[i] || 0 }));

  const nucleusSize = size * 0.13;
  const fg = darkMode ? '#f5f3ee' : '#0a0a14';

  const [rotY, setRotY] = useState(0);
  const [rotX, setRotX] = useState(65);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, rotY: 0, rotX: 0 });
  const [autoSpin, setAutoSpin] = useState(true);

  // Auto-spin
  useEffect(() => {
    if (!autoSpin || dragging) return;
    let raf;
    const tick = () => {
      setRotY((y) => (y + 0.15 * baseSpeed) % 360);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [autoSpin, dragging, baseSpeed]);

  const onPointerDown = (e) => {
    if (!draggable) return;
    setDragging(true);
    setAutoSpin(false);
    dragStart.current = { x: e.clientX, y: e.clientY, rotY, rotX };
    e.target.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!dragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setRotY(dragStart.current.rotY + dx * 0.5);
    setRotX(Math.max(20, Math.min(100, dragStart.current.rotX - dy * 0.3)));
  };
  const onPointerUp = () => {
    setDragging(false);
    setTimeout(() => setAutoSpin(true), 1500);
  };

  // Flash on energy change
  const [flashKey, setFlashKey] = useState(0);
  const prevE = useRef(energyLevel);
  useEffect(() => {
    if (prevE.current !== energyLevel) {
      setFlashKey((k) => k + 1);
      prevE.current = energyLevel;
    }
  }, [energyLevel]);

  return (
    <div
      style={{
        width: size,
        height: size,
        position: 'relative',
        perspective: size * 2.5,
        transformStyle: 'preserve-3d',
        cursor: draggable ? (dragging ? 'grabbing' : 'grab') : 'default',
        touchAction: 'none',
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {/* Halo */}
      <div style={{
        position: 'absolute',
        inset: '-15%',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${accent}22 0%, ${accent}08 35%, transparent 65%)`,
        filter: 'blur(20px)',
        pointerEvents: 'none',
        animation: 'iatom-halo 8s ease-in-out infinite',
      }} />

      {/* Flash */}
      <div
        key={flashKey}
        style={{
          position: 'absolute',
          inset: '20%',
          borderRadius: '50%',
          border: `2px solid ${accent}`,
          opacity: 0,
          animation: 'iatom-flash 1.4s cubic-bezier(.2,.7,.2,1) forwards',
          pointerEvents: 'none',
          zIndex: 5,
        }}
      />

      <div style={{
        position: 'absolute',
        inset: 0,
        transformStyle: 'preserve-3d',
        transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
      }}>
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
                animation: `iatom-orbit-${i} ${o.dur / baseSpeed}s linear infinite`,
              }}
            >
              {isExcited && (
                <div style={{
                  position: 'absolute',
                  inset: '-3px',
                  borderRadius: '50%',
                  border: `3px solid ${accent}`,
                  filter: 'blur(8px)',
                  opacity: 0.7,
                }} />
              )}
              <div style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                border: `1px solid ${isExcited ? accent : fg}`,
                opacity: isExcited ? 1 : isDimmed ? 0.1 : 0.28,
                boxShadow: isExcited ? `0 0 32px ${accent}aa, inset 0 0 32px ${accent}55` : 'none',
                transition: 'all 0.8s cubic-bezier(.5,0,.2,1)',
              }} />
              {Array.from({ length: o.electrons }).map((_, j) => {
                const angle = (360 / o.electrons) * j;
                const eSize = isExcited ? size * 0.034 : size * 0.024;
                const trailLen = isExcited ? 60 : 30;
                return (
                  <div
                    key={j}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: `rotateZ(${angle}deg) translateX(${ringSize / 2}px)`,
                    }}
                  >
                    <div style={{
                      position: 'absolute',
                      width: trailLen,
                      height: eSize * 0.6,
                      marginLeft: -trailLen,
                      marginTop: -eSize * 0.3,
                      background: `linear-gradient(to right, transparent, ${accent}${isExcited ? 'cc' : '66'})`,
                      filter: 'blur(2px)',
                      borderRadius: '50%',
                      transition: 'all 0.6s ease',
                    }} />
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        onElectronClick?.(i);
                      }}
                      style={{
                        position: 'absolute',
                        width: eSize,
                        height: eSize,
                        marginLeft: -eSize / 2,
                        marginTop: -eSize / 2,
                        borderRadius: '50%',
                        background: `radial-gradient(circle at 35% 35%, #fff, ${accent} 60%)`,
                        boxShadow: `0 0 ${eSize * 2}px ${accent}, 0 0 ${eSize * 4}px ${accent}aa`,
                        cursor: onElectronClick ? 'pointer' : 'inherit',
                        transition: 'all 0.6s ease',
                      }}
                    />
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* Nucleus */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: nucleusSize,
          height: nucleusSize,
          marginLeft: -nucleusSize / 2,
          marginTop: -nucleusSize / 2,
          borderRadius: '50%',
          transform: `rotateX(${-rotX}deg) rotateY(${-rotY}deg)`,
        }}>
          <div style={{
            position: 'absolute',
            inset: '-100%',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${accent}88 0%, ${accent}22 30%, transparent 60%)`,
            filter: 'blur(8px)',
            animation: 'iatom-pulse 3s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: `radial-gradient(circle at 30% 30%, #fff, ${accent} 40%, ${accent}88 80%)`,
            boxShadow: `0 0 ${nucleusSize * 0.8}px ${accent}, 0 0 ${nucleusSize * 1.6}px ${accent}aa`,
            animation: 'iatom-pulse 4s ease-in-out infinite',
          }} />
        </div>
      </div>

      <style>{`
        @keyframes iatom-orbit-0 { from { transform: rotateZ(0deg) rotateY(0deg); } to { transform: rotateZ(0deg) rotateY(360deg); } }
        @keyframes iatom-orbit-1 { from { transform: rotateZ(30deg) rotateY(0deg); } to { transform: rotateZ(30deg) rotateY(360deg); } }
        @keyframes iatom-orbit-2 { from { transform: rotateZ(60deg) rotateY(0deg); } to { transform: rotateZ(60deg) rotateY(360deg); } }
        @keyframes iatom-orbit-3 { from { transform: rotateZ(90deg) rotateY(0deg); } to { transform: rotateZ(90deg) rotateY(360deg); } }
        @keyframes iatom-pulse { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.12); opacity: 0.85; } }
        @keyframes iatom-halo { 0%,100% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.15); opacity: 1; } }
        @keyframes iatom-flash { 0% { transform: scale(0.4); opacity: 0; } 30% { opacity: 1; } 100% { transform: scale(2.2); opacity: 0; } }
      `}</style>
    </div>
  );
}

window.InteractiveAtom = InteractiveAtom;
