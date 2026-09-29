import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type ButtonHTMLAttributes, type FormEvent, type ReactNode } from "react";
import female from "../assets/female.a214dfbb.png.asset.json";
import male from "../assets/masculine.b27a3766.png.asset.json";
import divino from "../assets/bg_divino.d0e06856.png.asset.json";
import stop from "../assets/stop.f3d2a697.png.asset.json";

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

function Quiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [playing, setPlaying] = useState(false);
  const answer = (key: string, value: string) => { setAnswers(previous => ({ ...previous, [key]: value })); setError(""); setStep(previous => previous + 1); };
  const goBack = () => { setError(""); setStep(previous => Math.max(0, previous - 1)); };
  useEffect(() => {
    if (step !== 8) return;
    const timer = window.setTimeout(() => setStep(9), 3000);
    return () => window.clearTimeout(timer);
  }, [step]);
  const submitName = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) { setError("Digite seu nome para continuar."); return; }
    setError(""); setStep(8);
  };
  const submitEmail = (event: FormEvent) => {
    event.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Digite um e-mail válido para continuar."); return; }
    setError(""); setStep(10);
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
      {step === 4 && options("Em que Ano você nasceu?", Array.from({ length: 10 }, (_, i) => String(Number(answers.decada || 1910) + i)), "ano", "years")}
      {step === 5 && pictures("QUAL É O SEU ESTADO CIVIL?", marital, "estadoCivil", "marital")}
      {step === 6 && pictures("QUAL O MAIOR DESAFIO DA SUA VIDA NESSE MOMENTO?", challenges, "desafio", "challenge")}
      {step === 7 && <form className="quiz-inner" onSubmit={submitName}><h1 className="field-title">Qual é o seu Primeiro Nome?</h1><input className="field-input" placeholder="Digite seu nome" autoComplete="given-name" value={name} onChange={e => setName(e.target.value)} aria-label="Digite seu nome" />{error && <p className="form-error">{error}</p>}<QuizButton kind="continue" type="submit">Clique Aqui Para Continuar!</QuizButton></form>}
      {step === 8 && <div className="quiz-inner"><h1 className="loading-title">Carregando a sua leitura...</h1><span className="loading-wheel" /></div>}
      {step === 9 && <form className="quiz-inner" onSubmit={submitEmail}><p className="email-intro">Digite o seu <strong>e-mail</strong> para receber o restante da sua <strong>leitura personalizada...</strong></p><h1 className="field-title">Qual é o seu Email?</h1><input className="field-input email-input" type="email" placeholder="Digite seu Email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} aria-label="Digite seu Email" />{error && <p className="form-error">{error}</p>}<QuizButton kind="continue" type="submit">Clique para continuar</QuizButton></form>}
      {step === 10 && <div className="video-screen"><h1 className="video-heading">{name}, sua leitura vai sair do ar em breve.</h1><p className="video-note">Essa é a sua última chance de assistir até o final.</p><div className="video-frame"><img className="video-art" src={divino.url} alt="" /><div className="video-overlay">{playing ? <span>Leitura personalizada</span> : <><img src={stop.url} alt="" /><span>Clique no botão abaixo…</span></>}</div></div><QuizButton kind="continue" onClick={() => setPlaying(previous => !previous)}>{playing ? "PAUSAR" : "COMEÇAR"}</QuizButton></div>}
    </section>
  </main>;
}
