import { useState } from 'react'
import type { FormData } from '../types'
import styles from './Form.module.css'

interface Props {
  onSubmit: (data: FormData) => void
  loading: boolean
}

const TIPOS = ['Site Institucional', 'Landing Page', 'Sistema Web', 'E-commerce', 'App Mobile', 'Dashboard / Painel', 'API / Integração', 'Automação com IA', 'Outro']
const PRAZOS = ['1 semana', '2 semanas', '1 mês', '6 semanas', '2 meses', '3 meses', 'A combinar']
const ORCAMENTOS = ['Até R$ 1.000', 'R$ 1.000 – R$ 3.000', 'R$ 3.000 – R$ 8.000', 'R$ 8.000 – R$ 20.000', 'Acima de R$ 20.000', 'A combinar']

export function Form({ onSubmit, loading }: Props) {
  const [data, setData] = useState<FormData>({
    freelancerNome: '', clienteNome: '', tipo: TIPOS[2],
    descricao: '', prazo: PRAZOS[2], orcamento: ORCAMENTOS[1],
    tecnologias: '', extras: ''
  })

  const set = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setData(prev => ({ ...prev, [k]: e.target.value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!data.clienteNome.trim() || !data.descricao.trim()) return
    onSubmit(data)
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.grid}>
        <div className={styles.field}>
          <label>Seu nome <span className={styles.opt}>(opcional)</span></label>
          <input type="text" value={data.freelancerNome} onChange={set('freelancerNome')} placeholder="Ex: Douglas Andrade" />
        </div>
        <div className={styles.field}>
          <label>Nome do cliente / empresa <span className={styles.req}>*</span></label>
          <input type="text" value={data.clienteNome} onChange={set('clienteNome')} placeholder="Ex: Barbearia Silva" required />
        </div>
        <div className={styles.field}>
          <label>Tipo de projeto</label>
          <select value={data.tipo} onChange={set('tipo')}>
            {TIPOS.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className={styles.field}>
          <label>Tecnologias principais <span className={styles.opt}>(opcional)</span></label>
          <input type="text" value={data.tecnologias} onChange={set('tecnologias')} placeholder="Ex: React, Node.js, PostgreSQL" />
        </div>
        <div className={`${styles.field} ${styles.full}`}>
          <label>Descreva o projeto <span className={styles.req}>*</span></label>
          <textarea
            value={data.descricao}
            onChange={set('descricao')}
            rows={5}
            placeholder="Explique o que o cliente precisa, quais funcionalidades, quais problemas resolve..."
            required
          />
        </div>
        <div className={styles.field}>
          <label>Prazo estimado</label>
          <select value={data.prazo} onChange={set('prazo')}>
            {PRAZOS.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
        <div className={styles.field}>
          <label>Faixa de orçamento</label>
          <select value={data.orcamento} onChange={set('orcamento')}>
            {ORCAMENTOS.map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div className={`${styles.field} ${styles.full}`}>
          <label>Observações extras <span className={styles.opt}>(opcional)</span></label>
          <textarea
            value={data.extras}
            onChange={set('extras')}
            rows={3}
            placeholder="Alguma informação adicional que a IA deve considerar..."
          />
        </div>
      </div>

      <button type="submit" className={styles.btn} disabled={loading || !data.clienteNome || !data.descricao}>
        {loading ? (
          <span className={styles.btnLoading}>
            <span className={styles.spinner} />
            Gerando proposta...
          </span>
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
            </svg>
            Gerar Proposta com IA
          </>
        )}
      </button>
    </form>
  )
}
