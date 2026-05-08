export default function Mantenimiento() {
  return (
    <html lang="es">
      <head>
        <title>Mentalia — Próximamente</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f0f7f3;
            font-family: Georgia, serif;
          }
          .card {
            text-align: center;
            padding: 3rem 2rem;
            max-width: 420px;
          }
          .icon {
            font-size: 3rem;
            margin-bottom: 1.5rem;
          }
          h1 {
            font-size: 2rem;
            font-style: italic;
            color: #2D6A4F;
            margin-bottom: 0.75rem;
          }
          p {
            color: #666;
            font-family: system-ui, sans-serif;
            font-size: 1rem;
            line-height: 1.6;
          }
          .dot {
            display: inline-block;
            width: 8px;
            height: 8px;
            background: #2D6A4F;
            border-radius: 50%;
            margin: 2rem auto 0;
            animation: pulse 1.5s ease-in-out infinite;
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.4; transform: scale(0.8); }
          }
        `}</style>
      </head>
      <body>
        <div className="card">
          <div className="icon">🌿</div>
          <h1>mentalia</h1>
          <p>Estamos trabajando para ofrecerte la mejor experiencia.<br />Volvemos pronto.</p>
          <div className="dot" />
        </div>
      </body>
    </html>
  );
}
