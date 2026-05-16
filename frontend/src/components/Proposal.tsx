import { useRef } from 'react'
import type { Proposta } from '../types'
import styles from './Proposal.module.css'

interface Props {
  proposta: Proposta
  onNova: () => void
}

export function Proposal({ proposta, onNova }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  const handlePDF = async () => {
    const { default: jsPDF } = await import('jspdf')
    const { default: html2canvas } = await import('html2canvas')
    if (!ref.current) return

    const btn = document.getElementById('pdf-btn')!
    btn.style.display = 'none'

    const canvas = await html2canvas(ref.current, {
      scale: 2,
      backgroundColor: '#ffffff',
      useCORS: true
    })
    btn.style.display = ''

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    const w = pdf.internal.pageSize.getWidth()
    const h = (canvas.height * w) / canvas.width
    const pageH = pdf.internal.pageSize.getHeight()
    let y = 0
    while (y < h) {
      if (y > 0) pdf.addPage()
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, -y, w, h)
      y += pageH
    }
    pdf.save(`Proposta — ${proposta.clienteNome}.pdf`)
  }

  return (
    <div className={styles.outer}>
      <div className={styles.actions}>
        <button className={styles.btnNova} onClick={onNova}>
          ← Nova proposta
        </button>
        <button className={styles.btnPDF} id="pdf-btn" onClick={handlePDF}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Baixar PDF
        </button>
      </div>

      <div className={styles.doc} ref={ref}>
        {/* Header */}
        <div className={styles.docHeader}>
          <div className={styles.docLogo}>
            <span className={styles.docLogoBadge}>QF</span>
            <span className={styles.docLogoName}>QuoteForge</span>
          </div>
          <div className={styles.docMeta}>
            <p className={styles.docData}>{proposta.data}</p>
            <p className={styles.docValidade}>Válida por {proposta.validade}</p>
          </div>
        </div>

        <div className={styles.docDivider} />

        {/* Parties */}
        <div className={styles.docParties}>
          <div>
            <p className={styles.partyLabel}>Desenvolvedor</p>
            <p className={styles.partyName}>{proposta.freelancerNome}</p>
          </div>
          <div className={styles.arrowIcon}>→</div>
          <div>
            <p className={styles.partyLabel}>Cliente</p>
            <p className={styles.partyName}>{proposta.clienteNome}</p>
          </div>
        </div>

        {/* Title */}
        <h1 className={styles.docTitle}>{proposta.titulo}</h1>

        {/* Resumo */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNum}>01</span> Resumo Executivo
          </h2>
          <p className={styles.sectionText}>{proposta.resumo}</p>
        </section>

        {/* Escopo */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNum}>02</span> Escopo do Projeto
          </h2>
          <ul className={styles.list}>
            {proposta.escopo.map((item, i) => (
              <li key={i} className={styles.listItem}>
                <span className={styles.check}>✓</span>
                {item}
              </li>
            ))}
          </ul>
          {proposta.naoIncluso?.length > 0 && (
            <div className={styles.naoIncluso}>
              <p className={styles.naoInclusoLabel}>Não incluso nesta proposta:</p>
              <ul className={styles.naoInclusoList}>
                {proposta.naoIncluso.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          )}
        </section>

        {/* Cronograma */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNum}>03</span> Cronograma
          </h2>
          <div className={styles.timeline}>
            {proposta.cronograma.map((item, i) => (
              <div key={i} className={styles.timelineItem}>
                <div className={styles.timelineDot} />
                <div className={styles.timelineContent}>
                  <div className={styles.timelineHeader}>
                    <span className={styles.timelineFase}>{item.fase}</span>
                    <span className={styles.timelineDuracao}>{item.duracao}</span>
                  </div>
                  <p className={styles.timelineEntregaveis}>{item.entregaveis}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Investimento */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNum}>04</span> Investimento
          </h2>
          <div className={styles.investBox}>
            <div className={styles.investTotal}>
              <span className={styles.investLabel}>Total</span>
              <span className={styles.investValue}>{proposta.investimento.total}</span>
            </div>
            <div className={styles.investRow}>
              <span>Entrada (assinatura)</span>
              <span>{proposta.investimento.entrada}</span>
            </div>
            <div className={styles.investRow}>
              <span>Restante</span>
              <span>{proposta.investimento.parcelas}</span>
            </div>
          </div>
          <p className={styles.investJust}>{proposta.investimento.justificativa}</p>
        </section>

        {/* Termos */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionNum}>05</span> Termos e Condições
          </h2>
          <ul className={styles.termosList}>
            {proposta.termos.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </section>

        {/* Footer */}
        <div className={styles.docFooter}>
          <p>Proposta gerada por <strong>QuoteForge</strong> · Válida por {proposta.validade} a partir de {proposta.data}</p>
        </div>
      </div>
    </div>
  )
}
