import { useEffect, useState } from 'react'
import styles from './Loading.module.css'

const MSGS = [
  'Analisando o briefing...',
  'Estruturando o escopo do projeto...',
  'Calculando cronograma e investimento...',
  'Revisando termos e condições...',
  'Finalizando sua proposta profissional...',
]

export function Loading() {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % MSGS.length), 2200)
    return () => clearInterval(t)
  }, [])

  return (
    <div className={styles.wrap}>
      <div className={styles.orb}>
        <div className={styles.ring} />
        <div className={styles.ring2} />
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/>
          <path d="M2 12l10 5 10-5"/>
        </svg>
      </div>
      <h3 className={styles.title}>Gerando sua proposta</h3>
      <p className={styles.msg} key={idx}>{MSGS[idx]}</p>
      <div className={styles.bar}><div className={styles.fill} /></div>
    </div>
  )
}
