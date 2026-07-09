// Banner de crisis para el paciente (nivel alto). No es cerrable a propósito:
// permanece hasta que el profesional marca la alerta como vista.
export default function RiskBanner() {
  return (
    <div
      role="alert"
      className="sticky top-0 z-50 border-b border-[#c2410c]/30"
      style={{ background: "#fff7ed" }}
    >
      <div className="max-w-3xl mx-auto px-6 py-4">
        <p className="text-sm font-semibold" style={{ color: "#9a3412" }}>
          Queremos acompañarte.
        </p>
        <p className="text-sm mt-1 leading-relaxed" style={{ color: "#7c2d12" }}>
          Si estás pasando por un momento muy difícil o tenés pensamientos de hacerte daño, no estás
          solo/a. Podés hablar ahora mismo, de forma gratuita y confidencial:
        </p>
        <ul className="text-sm mt-2 space-y-1" style={{ color: "#7c2d12" }}>
          <li>
            <strong>Centro de Asistencia al Suicida</strong> —{" "}
            <a href="tel:135" className="underline font-semibold">135</a> (CABA/GBA) o{" "}
            <a href="tel:08003451435" className="underline font-semibold">0800-345-1435</a>{" "}
            (todo el país), de 8 a 24 h.
          </li>
          <li>
            En una emergencia, llamá al{" "}
            <a href="tel:107" className="underline font-semibold">107</a> (SAME) o{" "}
            <a href="tel:911" className="underline font-semibold">911</a>.
          </li>
        </ul>
        <p className="text-sm mt-2" style={{ color: "#7c2d12" }}>
          Tu profesional también fue notificado y va a estar en contacto.
        </p>
      </div>
    </div>
  );
}
