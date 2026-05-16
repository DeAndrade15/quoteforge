const express = require('express');
const { GoogleGenAI } = require('@google/genai');
const router  = express.Router();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

router.post('/gerar', async (req, res) => {
  const { freelancerNome, clienteNome, tipo, descricao, prazo, orcamento, tecnologias, extras } = req.body;

  if (!descricao || !clienteNome) {
    return res.status(400).json({ erro: 'Campos obrigatórios ausentes.' });
  }

  const prompt = `Você é especialista em propostas comerciais para desenvolvedores freelancer.
Gere uma proposta profissional, detalhada e convincente em português brasileiro.
Retorne APENAS um JSON válido, sem markdown, sem backticks.

Dados do projeto:
- Freelancer: ${freelancerNome || 'Desenvolvedor'}
- Cliente: ${clienteNome}
- Tipo: ${tipo || 'Sistema Web'}
- Descrição: ${descricao}
- Prazo estimado: ${prazo || 'A definir'}
- Faixa de orçamento: ${orcamento || 'A definir'}
- Tecnologias: ${tecnologias || 'A definir'}
- Observações: ${extras || 'Nenhuma'}

Retorne exatamente esta estrutura JSON:
{
  "titulo": "título profissional da proposta (ex: Proposta de Desenvolvimento — Sistema X para Empresa Y)",
  "resumo": "2-3 frases apresentando o entendimento do projeto e o valor entregue",
  "escopo": ["entregável detalhado 1", "entregável detalhado 2", "entregável 3", "entregável 4", "entregável 5"],
  "naoIncluso": ["item fora do escopo 1", "item fora do escopo 2", "item fora do escopo 3"],
  "cronograma": [
    { "fase": "Nome da fase", "duracao": "X dias", "entregaveis": "O que será entregue nessa fase" },
    { "fase": "Nome da fase 2", "duracao": "X dias", "entregaveis": "Descrição" },
    { "fase": "Nome da fase 3", "duracao": "X dias", "entregaveis": "Descrição" }
  ],
  "investimento": {
    "total": "R$ X.XXX,00",
    "entrada": "R$ X.XXX,00 (50% na assinatura)",
    "parcelas": "R$ X.XXX,00 (50% na entrega final)",
    "justificativa": "1-2 frases justificando o valor pelo resultado entregue"
  },
  "termos": [
    "Prazo começa após aprovação da proposta e pagamento da entrada",
    "Revisões ilimitadas dentro do escopo acordado",
    "Alterações fora do escopo serão orçadas separadamente",
    "Código-fonte entregue após quitação total"
  ],
  "validade": "30 dias"
}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: { temperature: 0.7 }
    });

    const raw = response.text.trim();
    // Remove possíveis backticks/markdown
    const clean = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
    const proposta = JSON.parse(clean);
    proposta.data = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
    proposta.freelancerNome = freelancerNome || 'Desenvolvedor';
    proposta.clienteNome = clienteNome;

    res.json({ proposta });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao gerar proposta. Verifique sua API key e tente novamente.' });
  }
});

module.exports = router;
