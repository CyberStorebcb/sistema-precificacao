// Modelo: ALUGUEL — taxa de implantação única + mensalidade por módulo (SaaS)
// Referência mercado BR 2024-2025: Omie, Bling, Sankhya, ContaAzul, Senior, soluções customizadas PME
// Mensalidades são por módulo/mês; implantação é cobrada uma única vez

export const DEFAULT_MODULES = [
  {
    id: 1,
    nome: "Financeiro (Contas a Pagar/Receber + Fluxo de Caixa)",
    mensalidade: 290,
    implantacao: 1800,
    descricao: "Lançamentos, conciliação bancária, fluxo de caixa, DRE"
  },
  {
    id: 2,
    nome: "Contabilidade",
    mensalidade: 320,
    implantacao: 2000,
    descricao: "Plano de contas, lançamentos contábeis, balanço patrimonial, DRE"
  },
  {
    id: 3,
    nome: "Estoque / Almoxarifado",
    mensalidade: 220,
    implantacao: 1400,
    descricao: "Entradas, saídas, inventário, rastreabilidade por lote/série"
  },
  {
    id: 4,
    nome: "Vendas / Pedidos",
    mensalidade: 250,
    implantacao: 1600,
    descricao: "Orçamentos, pedidos, comissões, faturamento"
  },
  {
    id: 5,
    nome: "Compras e Fornecedores",
    mensalidade: 180,
    implantacao: 1200,
    descricao: "Cotações, pedidos de compra, aprovações, recebimento de mercadoria"
  },
  {
    id: 6,
    nome: "Fiscal / Tributário (NF-e, SPED)",
    mensalidade: 390,
    implantacao: 2800,
    descricao: "NF-e/NFS-e, SPED EFD, obrigações acessórias — alta complexidade legal"
  },
  {
    id: 7,
    nome: "RH / Folha de Pagamento",
    mensalidade: 420,
    implantacao: 3200,
    descricao: "Admissão, ponto, férias, rescisão, folha, eSocial"
  },
  {
    id: 8,
    nome: "Produção / Manufatura (PCP)",
    mensalidade: 490,
    implantacao: 3800,
    descricao: "MRP, ordens de produção, custos industriais, integração com estoque"
  },
  {
    id: 9,
    nome: "CRM / Gestão de Clientes",
    mensalidade: 260,
    implantacao: 1600,
    descricao: "Funil de vendas, histórico de contatos, follow-up, oportunidades"
  },
  {
    id: 10,
    nome: "BI / Relatórios Gerenciais",
    mensalidade: 210,
    implantacao: 1200,
    descricao: "Dashboards, KPIs, relatórios customizados com exportação"
  },
];

export const PORTES = [
  {
    id: "pequena",
    label: "Pequena Empresa",
    multiplicador: 1.0,
    descricao: "Até 10 usuários / faturamento até R$ 4,8M/ano"
  },
  {
    id: "media",
    label: "Média Empresa",
    multiplicador: 1.5,
    descricao: "De 11 a 50 usuários / faturamento até R$ 48M/ano"
  },
  {
    id: "grande",
    label: "Grande Empresa",
    multiplicador: 2.5,
    descricao: "Acima de 50 usuários / multifilial / integrações avançadas"
  },
];

// IA — mensalidade inclui custo de API (OpenAI/Anthropic) + manutenção
export const DEFAULT_IA = [
  {
    id: "ia-1",
    nome: "Chatbot com IA",
    mensalidade: 490,
    implantacao: 2800,
    descricao: "Bot de atendimento automático com LLM integrado ao sistema",
    categoria: "ia",
  },
  {
    id: "ia-2",
    nome: "Análise Preditiva",
    mensalidade: 590,
    implantacao: 3500,
    descricao: "Previsão de demanda, vendas e inadimplência — modelos ML no ERP",
    categoria: "ia",
  },
  {
    id: "ia-3",
    nome: "Automação de Documentos com IA",
    mensalidade: 390,
    implantacao: 2200,
    descricao: "Leitura e processamento automático de NF, contratos e e-mails via OCR + IA",
    categoria: "ia",
  },
  {
    id: "ia-4",
    nome: "Dashboard Inteligente (Insights IA)",
    mensalidade: 350,
    implantacao: 1800,
    descricao: "Alertas automáticos e insights gerados por IA sobre os dados do negócio",
    categoria: "ia",
  },
  {
    id: "ia-5",
    nome: "BOT de Análise de Negócio",
    mensalidade: 520,
    implantacao: 3000,
    descricao: "Assistente IA que analisa vendas, inadimplência, estoque e sugere ações estratégicas em linguagem natural",
    categoria: "ia",
  },
];

// Robôs — mensalidade cobre infraestrutura + monitoramento do robô
export const DEFAULT_ROBOS = [
  {
    id: "rob-1",
    nome: "RPA — Robô de Processo",
    mensalidade: 390,
    implantacao: 2400,
    descricao: "Automação de processos repetitivos: boletos, XMLs, e-mails, relatórios",
    categoria: "robo",
  },
  {
    id: "rob-2",
    nome: "Integração WhatsApp Business",
    mensalidade: 320,
    implantacao: 1800,
    descricao: "Conexão do sistema ao WhatsApp Business: envio de boletos, ordens, confirmações e notificações automáticas",
    categoria: "robo",
  },
  {
    id: "rob-3",
    nome: "Importação Automática de Dados",
    mensalidade: 220,
    implantacao: 1200,
    descricao: "Importa planilhas, XMLs, EDI ou APIs externas automaticamente no sistema",
    categoria: "robo",
  },
  {
    id: "rob-4",
    nome: "Conciliação Bancária Automática",
    mensalidade: 260,
    implantacao: 1400,
    descricao: "Baixa extrato bancário OFX/API e concilia com financeiro automaticamente",
    categoria: "robo",
  },
];

// Serviços avulsos — cobrados uma única vez (sem mensalidade recorrente)
export const DEFAULT_SERVICOS = [
  {
    id: "srv-1",
    nome: "Identidade Visual da Empresa",
    valorUnico: 1800,
    descricao: "Criação de logotipo, paleta de cores, tipografia e aplicação no sistema",
    categoria: "servico",
  },
  {
    id: "srv-2",
    nome: "Transferência de Dados do Excel",
    valorUnico: 1200,
    descricao: "Importação, limpeza e migração de planilhas Excel para o banco de dados do sistema",
    categoria: "servico",
  },
  {
    id: "srv-3",
    nome: "Documentos Personalizados",
    valorUnico: 900,
    descricao: "Criação de modelos personalizados de orçamentos, contratos, NF e relatórios com a identidade do cliente",
    categoria: "servico",
  },
  {
    id: "srv-4",
    nome: "Hospedagem, Domínio e Banco de Dados",
    valorUnico: 800,
    mensalidade: 250,
    descricao: "Configuração de servidor em nuvem, domínio personalizado e banco de dados — inclui 1 ano de contrato",
    categoria: "servico",
  },
  {
    id: "srv-5",
    nome: "Manutenção e Consultoria",
    valorUnico: 0,
    mensalidade: 490,
    descricao: "Suporte técnico prioritário, atualizações do sistema, consultoria mensal para novos processos",
    categoria: "servico",
  },
];

// Taxa de suporte/sustentação mensal (além das mensalidades dos módulos)
// Inclui: SLA de atendimento, atualizações, backups
export const MENSALIDADE_SUPORTE_BASE = 350;

// Hora técnica para implantação/treinamento presencial ou remoto
export const VALOR_HORA_IMPLEMENTACAO = 114;
