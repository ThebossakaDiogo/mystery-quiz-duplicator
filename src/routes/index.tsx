import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ButtonHTMLAttributes, type FormEvent, type ReactNode } from "react";
import female from "../assets/female.a214dfbb.png.asset.json";
import male from "../assets/masculine.b27a3766.png.asset.json";
import divino from "../assets/bg_divino.d0e06856.png.asset.json";
import stop from "../assets/stop.f3d2a697.png.asset.json";
import lecture from "../assets/leitura-final.mp4.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Teste de Frequência | Mistérios da Alma" },
    { name: "description", content: "Descubra como seu nome rege sua vibração e veja como alinhar sua energia com a prosperidade." },
    { property: "og:title", content: "Teste de Frequência | Mistérios da Alma" },
    { property: "og:description", content: "Descubra como seu nome rege sua vibração e veja como alinhar sua energia com a prosperidade." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Quiz,
});

const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const marital = [
  { label: "Casado(a)", icon: "♕" }, { label: "Namorando", icon: "♡" }, { label: "Noivo(a)", icon: "♧" },
  { label: "Solteiro(a)", icon: "♡" }, { label: "Separado(a)", icon: "♧" }, { label: "Viúvo(a)", icon: "♡" },
];
const challenges = [
  { label: "Vida Amorosa", icon: "♡" }, { label: "Finanças", icon: "♧" },
  { label: "Saúde", icon: "♡" }, { label: "Felicidade", icon: "♕" },
];

type QuizButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode; kind?: "option" | "picture" | "back" | "continue" | "gender" };
function QuizButton({ children, kind = "option", className = "", ...props }: QuizButtonProps) {
  return <button type="button" className={`${kind === "option" ? "option-button" : kind === "picture" ? "picture-button" : kind === "back" ? "back-button" : kind === "gender" ? "gender-button" : "continue-button"} ${className}`} {...props}>{children}</button>;
}

const videoFiles = import.meta.glob<{ url: string }>("../assets/videos/*.mp4.asset.json", { eager: true, import: "default" });
const videoUrl = (id: string) => videoFiles[`../assets/videos/${id}.mp4.asset.json`]?.url ?? (id === "6a594e360b945f764e51e622" ? lecture.url : "");
const videoMapP1: Record<string, string> = {
  H_20_S: "6a594d8f412fe7a4cac846a6", H_20_C: "6a594dca8be918d307f1ffc5", H_30_S: "6a596c21a2d2f1883da52197", H_30_C: "6a596c5016d31ce51390cc97",
  H_40_S: "6a5b974e59b73dc8ca51c3a3", H_40_C: "6a594ddec02fb54b9a399d6e", H_50_S: "6a596c3a2f1fdfc17ad015c8", H_50_C: "6a596c802cf68483ab16d32b",
  H_60_S: "6a596c94363c53474ac3393e", H_60_C: "6a596c6ac46a23f534f0c33d", M_20_S: "6a596b71c46a23f534f0c253", M_20_C: "6a594ff5412fe7a4cac8487c",
  M_30_S: "6a596a1ffcb7e69c1fa51ffa", M_30_C: "6a596a3aa2d2f1883da5205b", M_40_S: "6a596a08f12d2459428b014e", M_40_C: "6a594db5015d17fd22778973",
  M_50_S: "6a5969dd16d31ce51390ca97", M_50_C: "6a596b59e656b72253c0ef13", M_60_S: "6a595e2eaa4525b9f43df2f5", M_60_C: "6a594e360b945f764e51e622",
};
const videoMapP2: Record<string, string> = {
  dinheiro: "6a5b8bae5a39d29133350132", felicidade: "6a5b8c3fe43bd30de8128561", saude: "6a5b8f6a1cfb78ac1d317d2b",
  m_casada: "6a5b8588e37f739e5f350a29", h_casado: "6a5b883b524c4f2440f0c837", h_solteiro: "6a5b91c0494da490dcf1b529", m_solteira: "6a5b8fa35a39d29133350732",
};
const isCommitted = (civil?: string) => ["Casado(a)", "Namorando", "Noivo(a)"].includes(civil ?? "");
function ageRange(year?: string) {
  const age = new Date().getFullYear() - Number(year || 2000);
  return age < 30 ? "20" : age < 40 ? "30" : age < 50 ? "40" : age < 60 ? "50" : "60";
}
function videoP1(a: Record<string, string>) {
  const g = a["genero"] === "Mulher" ? "M" : "H";
  return videoMapP1[`${g}_${ageRange(a["ano"])}_${isCommitted(a["estadoCivil"]) ? "C" : "S"}`] ?? videoMapP1["H_20_S"];
}
function videoP2(a: Record<string, string>) {
  const d = a["desafio"];
  if (d === "Finanças") return videoMapP2["dinheiro"];
  if (d === "Felicidade") return videoMapP2["felicidade"];
  if (d === "Saúde") return videoMapP2["saude"];
  const woman = a["genero"] === "Mulher"; const c = isCommitted(a["estadoCivil"]);
  return videoMapP2[woman ? (c ? "m_casada" : "m_solteira") : (c ? "h_casado" : "h_solteiro")];
}

function VideoPlayer({ src, onEnded, children }: { src: string; onEnded?: () => void; children?: ReactNode }) {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const ref = useRef<HTMLVideoElement>(null);
  const toggle = () => { const v = ref.current; if (!v) return; if (muted) { setMuted(false); v.muted = false; void v.play(); return; } if (v.paused) void v.play(); else v.pause(); };
  return <>
    <div className="video-frame">
      <img className="video-backdrop" src={divino.url} alt="" />
      <video ref={ref} className="video-art" src={src} autoPlay muted playsInline onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => { setPlaying(false); onEnded?.(); }} onClick={toggle} />
      {muted && <button type="button" className="unmute-overlay" onClick={toggle}>
        <strong>Seu vídeo já começou</strong>
        <span className="unmute-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></svg>
        </span>
        <strong>Clique para ouvir</strong>
      </button>}
      {!playing && !muted && !children && <div className="video-paused"><img src={stop.url} alt="" /><span>Clique no botão abaixo…</span></div>}
      {children}
    </div>
    {!children && <QuizButton kind="continue" onClick={toggle}>{playing && !muted ? "PAUSAR" : "COMEÇAR"}</QuizButton>}
  </>;
}

function Quiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [showEmail, setShowEmail] = useState(false);
  const answer = (key: string, value: string) => { setAnswers(previous => ({ ...previous, [key]: value })); setError(""); setStep(previous => previous + 1); };
  const goBack = () => { setError(""); setStep(previous => Math.max(0, previous - 1)); };
  useEffect(() => {
    if (step !== 8) return;
    const timer = window.setTimeout(() => setStep(9), 3000);
    return () => window.clearTimeout(timer);
  }, [step]);
  const submitName = (event: FormEvent) => {
    event.preventDefault();
    const value = name.trim();
    if (!value) { setError("Digite seu nome para continuar."); return; }
    if (/\d/.test(value)) { setError("*Apenas letras são permitidas!"); return; }
    if (/\s/.test(value)) { setError("*Apenas o primeiro nome!"); return; }
    setError(""); setStep(8);
  };
  const submitEmail = (event: FormEvent) => {
    event.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Digite um e-mail válido para continuar."); return; }
    setError(""); setShowEmail(false); setStep(10);
  };
  const options = (title: string, values: string[], key: string, variant: string) => <div className="quiz-inner">
    <h1 className="options-title">{title}</h1>
    <div className={`option-grid ${variant}`}>{values.map(value => <QuizButton key={value} onClick={() => answer(key, value)}>{value}</QuizButton>)}</div>
    <QuizButton kind="back" onClick={goBack}>&lt; Voltar</QuizButton>
  </div>;
  const pictures = (title: string, values: typeof marital, key: string, variant: string) => <div className="quiz-inner">
    <h1 className="gold-title">{title}</h1>
    <div className={`picture-grid ${variant}`}>{values.map(item => <QuizButton kind="picture" key={item.label} onClick={() => answer(key, item.label)}><span className="picture-icon" aria-hidden="true">{item.icon}</span>{item.label}</QuizButton>)}</div>
    <QuizButton kind="back" onClick={goBack}>&lt; Voltar</QuizButton>
  </div>;
  return <main className="quiz-page">
    <div className="progress-track" aria-label={`Progresso do teste: ${Math.round(((step + 1) / 11) * 100)}%`}><div className="progress-fill" style={{ width: `${Math.min(100, (step + 1) / 11 * 100)}%` }} /></div>
    <section className="quiz-stage" key={step}>
      {step === 0 && <div className="quiz-inner">
        <h1 className="quiz-heading compact">Em apenas 30 segundos, descubra como seu nome rege sua vibração e veja como alinhar sua energia com a <span className="highlight">prosperidade</span>!</h1>
        <div className="alert-box"><span className="alert-symbol" aria-hidden="true">⚠️</span><span>Atenção: Se tudo começar a fluir depois do teste, você me deve um PIX de R$ 5,00!</span></div>
        <p className="selection-title">Selecione seu gênero para iniciar o teste.</p>
        <div className="gender-grid">
          <QuizButton kind="gender" onClick={() => answer("genero", "Mulher")} aria-label="Mulher"><img className="gender-image" src={female.url} alt="" /><span className="gender-label">&gt; Mulher</span></QuizButton>
          <QuizButton kind="gender" onClick={() => answer("genero", "Homem")} aria-label="Homem"><img className="gender-image" src={male.url} alt="" /><span className="gender-label">&gt; Homem</span></QuizButton>
        </div>
        <div className="privacy"><p><span className="privacy-lock">🔒</span><strong>Privacidade Garantida:</strong> Suas respostas são 100% anônimas e confidenciais.</p><p>Mais de 98.342 pessoas já descobriram seus bloqueios através deste teste.</p></div>
      </div>}
      {step === 1 && options("Clique no mês em que você nasceu:", months, "mes", "months")}
      {step === 2 && options("Informe o Dia do seu Nascimento:", Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0")), "dia", "days")}
      {step === 3 && options("Em qual Década você nasceu?", Array.from({ length: 11 }, (_, i) => String(1910 + i * 10)), "decada", "decades")}
      {step === 4 && options("Em que Ano você nasceu?", Array.from({ length: 10 }, (_, i) => String(Number(answers["decada"] || 1910) + i)), "ano", "years")}
      {step === 5 && pictures("QUAL É O SEU ESTADO CIVIL?", marital, "estadoCivil", "marital")}
      {step === 6 && pictures("QUAL O MAIOR DESAFIO DA SUA VIDA NESSE MOMENTO?", challenges, "desafio", "challenge")}
      {step === 7 && <form className="quiz-inner" onSubmit={submitName}><h1 className="field-title">Qual é o seu Primeiro Nome?</h1><input className="field-input" placeholder="Digite seu nome" autoComplete="given-name" value={name} onChange={e => setName(e.target.value)} aria-label="Digite seu nome" />{error && <p className="form-error">{error}</p>}<QuizButton kind="continue" type="submit">Clique Aqui Para Continuar!</QuizButton></form>}
      {step === 8 && <div className="quiz-inner"><h1 className="loading-title">Carregando a sua leitura...</h1><span className="loading-wheel" /></div>}
      {step === 9 && <div className="video-screen">
        <h1 className="video-heading">{name}, sua leitura personalizada está pronta.</h1>
        <p className="video-note">Assista até o final para receber a segunda parte.</p>
        <VideoPlayer src={videoUrl(videoP1(answers))} onEnded={() => setShowEmail(true)}>
          {showEmail && <form className="email-modal" onSubmit={submitEmail}>
            <p className="email-intro">Digite o seu <strong>e-mail</strong> para receber o restante da sua <strong>leitura personalizada...</strong></p>
            <h2 className="field-title">Qual é o seu Email?</h2>
            <input className="field-input email-input" type="email" placeholder="Digite seu Email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} aria-label="Digite seu Email" />
            {error && <p className="form-error">{error}</p>}
            <QuizButton kind="continue" type="submit">Clique para continuar</QuizButton>
          </form>}
        </VideoPlayer>
      </div>}
      {step === 10 && <div className="video-screen">
        <h1 className="video-heading">{name}, sua leitura vai sair do ar em breve.</h1>
        <p className="video-note">Essa é a sua última chance de assistir até o final.</p>
        <VideoPlayer src={videoUrl(videoP2(answers))} />
      </div>}
    </section>
  </main>;
}
