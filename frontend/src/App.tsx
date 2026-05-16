import { useState } from 'react'
import type { FormData, Proposta } from './types'
import { Form }     from './components/Form'
import { Loading }  from './components/Loading'
import { Proposal } from './components/Proposal'
import styles from './App.module.css'

type State = 'form' | 'loading' | 'result' | 'error'

export default function App() {
  const [state, setState]     = useState<State>('form')
  const [proposta, setProposta] = useState<Proposta | null>(null)
  const [erro, setErro]       = useState('')

  const gerar = async (data: FormData) => {
    setState('loading')
    setErro('')
    try {
      const res = await fetch('/api/gerar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.erro || 'Erro ao gerar proposta')
      setProposta(json.proposta)
      setState('result')
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : 'Erro inesperado')
      setState('error')
    }
  }

  const nova = () => {
    setState('form')
    setProposta(null)
    setErro('')
  }

  return (
    <div className={styles.app}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoBadge}>QF</span>
          <span className={styles.logoName}>QuoteForge</span>
        </div>
        <p className={styles.tagline}>Propostas profissionais com IA</p>
      </header>

      <main className={styles.main}>
        {state === 'form' && (
          <div className={styles.formWrap}>
            <div className={styles.heroText}>
              <h1 className={styles.hero}>
                Gere uma proposta<br />
                <span className={styles.heroAccent}>profissional em segundos</span>
              </h1>
              <p className={styles.heroSub}>
                Descreva o projeto do seu cliente e a IA cria uma proposta completa —
                escopo, cronograma, investimento e termos — pronta para enviar.
              </p>
            </div>
            <div className={styles.card}>
              <Form onSubmit={gerar} loading={false} />
            </div>
          </div>
        )}

        {state === 'loading' && (
          <div className={styles.card}>
            <Loading />
          </div>
        )}

        {state === 'result' && proposta && (
          <div className={styles.resultWrap}>
            <Proposal proposta={proposta} onNova={nova} />
          </div>
        )}

        {state === 'error' && (
          <div className={styles.card}>
            <div className={styles.error}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <h3>Algo deu errado</h3>
              <p>{erro}</p>
              <button className={styles.btnTentar} onClick={nova}>Tentar novamente</button>
            </div>
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <p>Feito por <strong>Douglas Andrade</strong> · Powered by Gemini AI</p>
      </footer>
    </div>
  )
}
