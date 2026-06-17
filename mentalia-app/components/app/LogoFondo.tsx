"use client";
export default function LogoFondo() {
  return (
    <img
      src="/logo_mentalia.svg"
      alt=""
      style={{
        position: 'fixed',
        top: '50%',
        left: '60%',
        transform: 'translate(-50%, -50%)',
        width: '700px',
        opacity: 0.06,
        filter: 'grayscale(100%) brightness(0)',
        pointerEvents: 'none',
        zIndex: 0,
        userSelect: 'none',
      }}
    />
  );
}
