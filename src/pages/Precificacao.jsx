import { useState } from 'react';
import { FileDown, Bot, Cpu, CheckSquare, Square, Wrench } from 'lucide-react';
import { PORTES } from '../data/defaultData';
import { gerarPDF } from '../utils/gerarPDF';

function fmt(v) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function OptionRow({ item, estado, onChange, mult, accentBorder, accentText }) {
  const ativo = estado === 'sim' || estado === 'gratis';
  const mensalidade = item.mensalidade * mult;
  const implantacao = item.implantacao * mult;

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-3 rounded-lg border transition-all ${
      estado === 'sim'    ? `${accentBorder} bg-opacity-10` :
      estado === 'gratis' ? 'border-emerald-500/40 bg-emerald-500/5' :
                            'border-gray-700/60'
    }`}>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${ativo ? 'text-gray-100' : 'text-gray-400'}`}>
          {item.nome}
        </p>
        {item.descricao && <p className="text-xs text-gray-500 mt-0.5 hidden sm:block">{item.descricao}</p>}
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-3">
        <div className="shrink-0 text-right">
          {estado === 'gratis' ? (
            <>
              <span className="text-sm font-semibold block text-emerald-300">
                {fmt(mensalidade)}<span className="text-xs font-normal">/mês</span>
              </span>
              <span className="text-xs font-semibold text-emerald-400 block">impl. grátis</span>
            </>
          ) : (
            <>
              <span className={`text-sm font-semibold block ${ativo ? accentText : 'text-gray-600'}`}>
                {fmt(mensalidade)}<span className="text-xs font-normal">/mês</span>
              </span>
              <span className="text-xs text-gray-600 block">
                impl. {fmt(implantacao)}
              </span>
            </>
          )}
        </div>

        <div className="flex shrink-0 rounded-lg overflow-hidden border border-gray-700">
          {[
            { value: null,     label: 'Não',    activeClass: 'bg-gray-700 text-gray-200' },
            { value: 'sim',    label: 'Sim',    activeClass: 'bg-blue-600 text-white' },
            { value: 'gratis', label: 'Grátis', activeClass: 'bg-emerald-600 text-white' },
          ].map(({ value, label, activeClass }, i) => (
            <button
              key={label}
              onClick={() => onChange(item.id, value)}
              className={`px-2.5 sm:px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                i > 0 ? 'border-l border-gray-700' : ''
              } ${estado === value ? activeClass : 'bg-gray-800/60 text-gray-500 hover:text-gray-300 hover:bg-gray-700/60'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function SelectionList({ items, estados, onChange, mult, accentBorder, accentText }) {
  return (
    <div className="space-y-2">
      {items.map(m => (
        <OptionRow
          key={m.id}
          item={m}
          estado={estados[m.id] ?? null}
          onChange={onChange}
          mult={mult}
          accentBorder={accentBorder}
          accentText={accentText}
        />
      ))}
    </div>
  );
}

function ServicoRow({ item, estado, onChange }) {
  const ativo = estado === 'sim' || estado === 'gratis';
  const temMens = (item.mensalidade || 0) > 0;
  const temUnico = (item.valorUnico || 0) > 0;

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-3 rounded-lg border transition-all ${
      estado === 'sim'    ? 'border-orange-500/40 bg-orange-500/5' :
      estado === 'gratis' ? 'border-emerald-500/40 bg-emerald-500/5' :
                            'border-gray-700/60'
    }`}>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${ativo ? 'text-gray-100' : 'text-gray-400'}`}>
          {item.nome}
        </p>
        {item.descricao && <p className="text-xs text-gray-500 mt-0.5 hidden sm:block">{item.descricao}</p>}
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-3">
      <div className="shrink-0 text-right">
        {estado === 'gratis' ? (
          <>
            <span className="text-xs font-semibold text-emerald-400 block">único grátis</span>
            {temMens && (
              <span className="text-xs text-emerald-300 block">
                + {fmt(item.mensalidade)}<span className="font-normal">/mês</span>
              </span>
            )}
          </>
        ) : (
          <>
            {temUnico && (
              <span className={`text-sm font-semibold block ${ativo ? 'text-orange-300' : 'text-gray-600'}`}>
                {fmt(item.valorUnico)} <span className="text-xs font-normal">único</span>
              </span>
            )}
            {temMens && (
              <span className={`text-xs block ${ativo ? 'text-orange-400' : 'text-gray-600'}`}>
                + {fmt(item.mensalidade)}<span className="font-normal">/mês</span>
              </span>
            )}
          </>
        )}
      </div>

        <div className="flex shrink-0 rounded-lg overflow-hidden border border-gray-700">
          {[
            { value: null,     label: 'Não',    activeClass: 'bg-gray-700 text-gray-200' },
            { value: 'sim',    label: 'Sim',    activeClass: 'bg-orange-600 text-white' },
            { value: 'gratis', label: 'Grátis', activeClass: 'bg-emerald-600 text-white' },
          ].map(({ value, label, activeClass }, i) => (
            <button
              key={label}
              onClick={() => onChange(item.id, value)}
              className={`px-2.5 sm:px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                i > 0 ? 'border-l border-gray-700' : ''
              } ${estado === value ? activeClass : 'bg-gray-800/60 text-gray-500 hover:text-gray-300 hover:bg-gray-700/60'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Precificacao({ modules, iaItems, roboItems, servicoItems, valorHora, setValorHora, mensalidadeBase, saveProposal, empresa, setPage }) {
  const [cliente, setCliente] = useState({ nome: '', cnpj: '', email: '', telefone: '' });
  const [porte, setPorte] = useState('pequena');
  const [modulosEstado, setModulosEstado] = useState({});
  const [iaEstado,      setIaEstado]      = useState({});
  const [roboEstado,    setRoboEstado]    = useState({});
  const [servicoEstado, setServicoEstado] = useState({});
  const [horasImpl, setHorasImpl]         = useState(80);
  const [implAtiva, setImplAtiva]         = useState(true);
  const [percAdicional, setPercAdicional] = useState(10);
  const [parcelas, setParcelas]               = useState(1);
  const [taxaParcelamento, setTaxaParcelamento] = useState(0);
  const [observacoes, setObservacoes]     = useState('');
  const [gerando, setGerando]             = useState(false);
  const [saved, setSaved]                 = useState(false);

  const porteObj = PORTES.find(p => p.id === porte);
  const mult = porteObj?.multiplicador || 1;

  const setEstado = (setter) => (id, value) =>
    setter(prev => ({ ...prev, [id]: value }));

  const modulosSelecionados  = modules.filter(m => modulosEstado[m.id]  === 'sim' || modulosEstado[m.id]  === 'gratis');
  const iaSelecionados       = iaItems.filter(m => iaEstado[m.id]       === 'sim' || iaEstado[m.id]       === 'gratis');
  const roboSelecionados     = roboItems.filter(m => roboEstado[m.id]   === 'sim' || roboEstado[m.id]     === 'gratis');
  const servicoSelecionados  = (servicoItems || []).filter(m => servicoEstado[m.id] === 'sim' || servicoEstado[m.id] === 'gratis');

  // mensalidade: soma 'sim' e 'gratis' × mult (grátis só isenta a implantação)
  const calcMensalidade = (lista, estadoMap) =>
    lista.reduce((s, m) => s + (estadoMap[m.id] === 'sim' || estadoMap[m.id] === 'gratis' ? m.mensalidade * mult : 0), 0);

  // implantação: soma apenas 'sim' × mult (grátis não cobra implantação)
  const calcImplantacao = (lista, estadoMap) =>
    lista.reduce((s, m) => s + (estadoMap[m.id] === 'sim' ? m.implantacao * mult : 0), 0);

  const mensalidadeModulos = calcMensalidade(modules, modulosEstado);
  const mensalidadeIA      = calcMensalidade(iaItems, iaEstado);
  const mensalidadeRobos   = calcMensalidade(roboItems, roboEstado);
  const mensalidadeServicos = (servicoItems || []).reduce((s, m) =>
    s + (servicoEstado[m.id] === 'sim' || servicoEstado[m.id] === 'gratis' ? (m.mensalidade || 0) : 0), 0);

  const implantacaoModulos = calcImplantacao(modules, modulosEstado);
  const implantacaoIA      = calcImplantacao(iaItems, iaEstado);
  const implantacaoRobos   = calcImplantacao(roboItems, roboEstado);
  const valorUnicoServicos = (servicoItems || []).reduce((s, m) =>
    s + (servicoEstado[m.id] === 'sim' ? (m.valorUnico || 0) : 0), 0);

  const totalImpl         = implAtiva ? horasImpl * valorHora : 0;
  const adicionalImpl     = implAtiva && horasImpl > 0 ? Math.round(totalImpl * (percAdicional / 100)) : 0;
  const suporteMensal     = mensalidadeBase;

  const totalMensalidade = mensalidadeModulos + mensalidadeIA + mensalidadeRobos + mensalidadeServicos + suporteMensal + adicionalImpl;
  const totalImplantacao = implantacaoModulos + implantacaoIA + implantacaoRobos + valorUnicoServicos + totalImpl;

  const totalItens = modulosSelecionados.length + iaSelecionados.length + roboSelecionados.length + servicoSelecionados.length;

  const modulosComEstado  = modulosSelecionados.map(m => ({ ...m, gratis: modulosEstado[m.id]  === 'gratis' }));
  const iaComEstado       = iaSelecionados.map(m => ({ ...m, gratis: iaEstado[m.id]            === 'gratis' }));
  const roboComEstado     = roboSelecionados.map(m => ({ ...m, gratis: roboEstado[m.id]         === 'gratis' }));
  const servicoComEstado  = servicoSelecionados.map(m => ({ ...m, gratis: servicoEstado[m.id]  === 'gratis' }));

  function buildProposal(extra = {}) {
    return {
      cliente, porte, porteLabel: porteObj.label, multiplicador: mult,
      modulosSelecionados: modulosComEstado,
      iaSelecionados: iaComEstado,
      roboSelecionados: roboComEstado,
      servicoSelecionados: servicoComEstado,
      horasImpl, implAtiva, percAdicional, incluiSuporte: true, observacoes,
      mensalidadeModulos, mensalidadeIA, mensalidadeRobos, mensalidadeServicos,
      implantacaoModulos, implantacaoIA, implantacaoRobos, valorUnicoServicos,
      totalImpl, adicionalImpl, suporteMensal,
      totalMensalidade, totalImplantacao,
      valorHora, mensalidadeBase,
      // compat com PDF legado
      subtotalModulos: mensalidadeModulos,
      subtotalIA: mensalidadeIA,
      subtotalRobos: mensalidadeRobos,
      totalMensal: totalMensalidade,
      totalGeral: totalImplantacao,
      ...extra,
    };
  }

  function handleSave() {
    saveProposal(buildProposal());
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  async function handleGerarPDF() {
    if (!cliente.nome) {
      alert('Informe o nome do cliente antes de gerar o PDF.');
      return;
    }
    setGerando(true);
    try {
      await gerarPDF(buildProposal({ criadoEm: new Date().toISOString() }), empresa);
    } finally {
      setGerando(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-100">Nova Proposta</h1>
        <p className="text-gray-500 text-sm mt-1">Modelo de aluguel — taxa de implantação + mensalidade por módulo</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2 space-y-4 order-2 lg:order-1">

          {/* Dados do cliente */}
          <div className="card">
            <h2 className="font-bold text-gray-200 mb-4">Dados do Cliente</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Nome / Empresa *</label>
                <input className="input" placeholder="Ex: Empresa XYZ Ltda" value={cliente.nome}
                  onChange={e => setCliente({ ...cliente, nome: e.target.value })} />
              </div>
              <div>
                <label className="label">CNPJ</label>
                <input className="input" placeholder="00.000.000/0001-00" value={cliente.cnpj}
                  onChange={e => setCliente({ ...cliente, cnpj: e.target.value })} />
              </div>
              <div>
                <label className="label">E-mail</label>
                <input className="input" type="email" placeholder="contato@empresa.com" value={cliente.email}
                  onChange={e => setCliente({ ...cliente, email: e.target.value })} />
              </div>
              <div>
                <label className="label">Telefone</label>
                <input className="input" placeholder="(00) 00000-0000" value={cliente.telefone}
                  onChange={e => setCliente({ ...cliente, telefone: e.target.value })} />
              </div>
            </div>
          </div>

          {/* Porte */}
          <div className="card">
            <h2 className="font-bold text-gray-200 mb-1">Porte da Empresa</h2>
            <p className="text-xs text-gray-500 mb-4">O porte ajusta os valores conforme complexidade, número de usuários e integrações necessárias.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {PORTES.map(p => (
                <button
                  key={p.id}
                  onClick={() => setPorte(p.id)}
                  className={`border-2 rounded-xl p-4 text-left transition-all cursor-pointer ${
                    porte === p.id
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-gray-700 hover:border-gray-600 hover:bg-gray-800/50'
                  }`}
                >
                  <p className={`font-semibold text-sm ${porte === p.id ? 'text-blue-300' : 'text-gray-300'}`}>{p.label}</p>
                  <p className="text-xs text-gray-500 mt-1">{p.descricao}</p>
                  <p className={`text-xs font-bold mt-2 ${porte === p.id ? 'text-blue-400' : 'text-gray-600'}`}>×{p.multiplicador.toFixed(1)}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Banner explicativo */}
          <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 px-4 py-3 flex gap-3 items-start">
            <span className="text-blue-400 text-lg leading-none mt-0.5">ℹ</span>
            <div className="text-xs text-gray-400 space-y-1">
              <p><span className="text-gray-200 font-semibold">Como funciona o modelo de aluguel:</span> cada módulo tem uma <span className="text-gray-300">taxa de implantação</span> (cobrada uma única vez para configuração e treinamento) e uma <span className="text-gray-300">mensalidade</span> recorrente que inclui uso do sistema, atualizações e suporte básico.</p>
              {mult > 1 && (
                <p className="text-blue-300 font-medium">Porte atual ×{mult.toFixed(1)} — valores já ajustados para mais usuários e integrações. O preço base (×1.0) é o da pequena empresa.</p>
              )}
            </div>
          </div>

          {/* Serviços de Implantação */}
          <div className="card border-orange-500/20">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-orange-500/15 flex items-center justify-center">
                <Wrench size={14} className="text-orange-400" />
              </div>
              <h2 className="font-bold text-gray-200">Serviços de Implantação</h2>
              {(valorUnicoServicos > 0 || mensalidadeServicos > 0) && (
                <span className="text-xs font-semibold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full">
                  {valorUnicoServicos > 0 && fmt(valorUnicoServicos) + ' único'}
                  {valorUnicoServicos > 0 && mensalidadeServicos > 0 && ' + '}
                  {mensalidadeServicos > 0 && fmt(mensalidadeServicos) + '/mês'}
                </span>
              )}
              <button
                onClick={() => setServicoEstado({})}
                className="ml-auto text-xs text-gray-500 hover:text-red-400 transition-colors px-2 py-1 rounded hover:bg-red-500/10"
              >
                Limpar
              </button>
            </div>
            <p className="text-xs text-gray-500 mb-3">Itens cobrados pelo valor fixo — não sofrem multiplicador de porte.</p>
            <div className="space-y-2">
              {(servicoItems || []).map(item => (
                <ServicoRow
                  key={item.id}
                  item={item}
                  estado={servicoEstado[item.id] ?? null}
                  onChange={(id, value) => setServicoEstado(prev => ({ ...prev, [id]: value }))}
                />
              ))}
            </div>
          </div>

          {/* Módulos ERP */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-200">Módulos do ERP</h2>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded-full">
                  {modulosSelecionados.length} selecionado{modulosSelecionados.length !== 1 ? 's' : ''}
                </span>
                <button
                  onClick={() => setModulosEstado({})}
                  className="text-xs text-gray-500 hover:text-red-400 transition-colors px-2 py-1 rounded hover:bg-red-500/10"
                >
                  Limpar
                </button>
              </div>
            </div>
            <SelectionList
              items={modules}
              estados={modulosEstado}
              onChange={setEstado(setModulosEstado)}
              mult={mult}
              accentBorder="border-blue-500/40 bg-blue-500/8"
              accentText="text-blue-300"
            />
          </div>

          {/* IA Integrada */}
          <div className="card border-violet-500/20">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-violet-500/15 flex items-center justify-center">
                <Cpu size={14} className="text-violet-400" />
              </div>
              <h2 className="font-bold text-gray-200">IA Integrada</h2>
              {mensalidadeIA > 0 && (
                <span className="text-xs font-semibold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full">
                  {fmt(mensalidadeIA)}/mês
                </span>
              )}
              <button
                onClick={() => setIaEstado({})}
                className="ml-auto text-xs text-gray-500 hover:text-red-400 transition-colors px-2 py-1 rounded hover:bg-red-500/10"
              >
                Limpar
              </button>
            </div>
            <SelectionList
              items={iaItems}
              estados={iaEstado}
              onChange={setEstado(setIaEstado)}
              mult={mult}
              accentBorder="border-violet-500/40 bg-violet-500/8"
              accentText="text-violet-300"
            />
          </div>

          {/* Robôs e Automação */}
          <div className="card border-emerald-500/20">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                <Bot size={14} className="text-emerald-400" />
              </div>
              <h2 className="font-bold text-gray-200">Robôs e Automação</h2>
              {mensalidadeRobos > 0 && (
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  {fmt(mensalidadeRobos)}/mês
                </span>
              )}
              <button
                onClick={() => setRoboEstado({})}
                className="ml-auto text-xs text-gray-500 hover:text-red-400 transition-colors px-2 py-1 rounded hover:bg-red-500/10"
              >
                Limpar
              </button>
            </div>
            <SelectionList
              items={roboItems}
              estados={roboEstado}
              onChange={setEstado(setRoboEstado)}
              mult={mult}
              accentBorder="border-emerald-500/40 bg-emerald-500/8"
              accentText="text-emerald-300"
            />
          </div>

          {/* Implantação e suporte */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-200">Implantação e Suporte</h2>
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-500">R$/hora</label>
                <input
                  className="input w-24 text-right py-1 text-sm"
                  type="number" min="0" step="10"
                  value={valorHora}
                  onChange={e => setValorHora(Number(e.target.value))}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="label mb-0">Horas de implantação / treinamento</label>
                  <div
                    onClick={() => setImplAtiva(!implAtiva)}
                    className={`flex items-center gap-1.5 px-2 py-1 border rounded-md cursor-pointer transition-all text-xs ${
                      implAtiva
                        ? 'border-blue-500/50 bg-blue-500/10 text-blue-400'
                        : 'border-gray-700 text-gray-500 hover:border-gray-600'
                    }`}
                  >
                    {implAtiva
                      ? <CheckSquare size={13} className="text-blue-400" />
                      : <Square size={13} className="text-gray-500" />
                    }
                    {implAtiva ? 'Ativo' : 'Inativo'}
                  </div>
                </div>
                <input
                  className={`input transition-opacity ${!implAtiva ? 'opacity-40 pointer-events-none' : ''}`}
                  type="number" min="0" step="8"
                  value={horasImpl}
                  onChange={e => setHorasImpl(Number(e.target.value))}
                  disabled={!implAtiva}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {implAtiva
                    ? <>{horasImpl}h × {fmt(valorHora)}/h = <strong className="text-gray-300">{fmt(totalImpl)}</strong></>
                    : <span className="italic">Implantação não incluída</span>
                  }
                </p>
                {implAtiva && horasImpl > 0 && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    ≈ <strong className="text-gray-400">{Math.ceil(horasImpl / 8)} dia{Math.ceil(horasImpl / 8) !== 1 ? 's' : ''}</strong> de trabalho <span className="text-gray-600">(8h/dia)</span>
                  </p>
                )}
                {implAtiva && horasImpl > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-700/50">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs text-gray-400">Adicional mensal por complexidade</label>
                      <span className="text-xs font-semibold text-blue-400">{fmt(adicionalImpl)}/mês</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="range" min="0" max="30" step="1"
                        value={percAdicional}
                        onChange={e => setPercAdicional(Number(e.target.value))}
                        className="flex-1 accent-blue-500 cursor-pointer"
                      />
                      <span className="text-xs font-bold text-gray-300 w-8 text-right">{percAdicional}%</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {fmt(totalImpl)} × {percAdicional}% = {fmt(adicionalImpl)}/mês
                    </p>
                  </div>
                )}
              </div>
              <div>
                <label className="label">Suporte técnico mensal</label>
                <div className="flex items-center gap-3 p-3 border-2 rounded-lg border-blue-500/50 bg-blue-500/10">
                  <CheckSquare size={18} className="text-blue-400 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-200">Suporte mensal obrigatório</p>
                    <p className="text-xs text-gray-500">SLA de atendimento + atualizações — {fmt(mensalidadeBase)}/mês</p>
                  </div>
                  <span className="text-xs text-blue-400/60 font-medium">Incluso</span>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className="label">Observações para o cliente</label>
              <textarea
                className="input h-20 resize-none"
                placeholder="Ex: Contrato sem fidelidade. Cancelamento com 30 dias de aviso. Inclui treinamento para 2 usuários..."
                value={observacoes}
                onChange={e => setObservacoes(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Coluna direita: resumo */}
        <div className="space-y-4 order-1 lg:order-2">
          <div className="card lg:sticky lg:top-6">
            <h2 className="font-bold text-gray-200 mb-4">Resumo da Proposta</h2>

            {/* Mensalidade */}
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Mensalidade Recorrente</p>
            <div className="space-y-2 mb-4">
              {mensalidadeModulos > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                    Módulos ERP ({modulosSelecionados.length})
                  </span>
                  <span className="font-medium text-gray-300">{fmt(mensalidadeModulos)}</span>
                </div>
              )}
              {mensalidadeIA > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-violet-500 inline-block" />
                    IA Integrada ({iaSelecionados.length})
                  </span>
                  <span className="font-medium text-violet-300">{fmt(mensalidadeIA)}</span>
                </div>
              )}
              {mensalidadeRobos > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                    Robôs ({roboSelecionados.length})
                  </span>
                  <span className="font-medium text-emerald-300">{fmt(mensalidadeRobos)}</span>
                </div>
              )}
              {mensalidadeServicos > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-orange-500 inline-block" />
                    Serviços ({servicoSelecionados.length})
                  </span>
                  <span className="font-medium text-orange-300">{fmt(mensalidadeServicos)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Suporte técnico</span>
                <span className="font-medium text-gray-300">{fmt(suporteMensal)}</span>
              </div>
              {adicionalImpl > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
                    Complexidade ({percAdicional}%)
                  </span>
                  <span className="font-medium text-blue-300">{fmt(adicionalImpl)}</span>
                </div>
              )}
              <div className="border-t border-gray-700 pt-2 flex justify-between items-center">
                <span className="font-bold text-gray-200 text-sm">Total mensal</span>
                <span className="font-bold text-xl text-blue-400">{fmt(totalMensalidade)}<span className="text-xs font-normal">/mês</span></span>
              </div>
            </div>

            {/* Implantação */}
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Taxa de Implantação (única)</p>
            <div className="space-y-2 mb-4">
              {implantacaoModulos > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Módulos ERP</span>
                  <span className="font-medium text-gray-300">{fmt(implantacaoModulos)}</span>
                </div>
              )}
              {implantacaoIA > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">IA Integrada</span>
                  <span className="font-medium text-gray-300">{fmt(implantacaoIA)}</span>
                </div>
              )}
              {implantacaoRobos > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Robôs</span>
                  <span className="font-medium text-gray-300">{fmt(implantacaoRobos)}</span>
                </div>
              )}
              {valorUnicoServicos > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Serviços ({servicoSelecionados.length})</span>
                  <span className="font-medium text-gray-300">{fmt(valorUnicoServicos)}</span>
                </div>
              )}
              {implAtiva && horasImpl > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Treinamento ({horasImpl}h)</span>
                  <span className="font-medium text-gray-300">{fmt(totalImpl)}</span>
                </div>
              )}
              <div className="border-t border-gray-700 pt-2 flex justify-between items-center">
                <span className="font-bold text-gray-200 text-sm">Total implantação</span>
                <span className="font-bold text-xl text-amber-400">{fmt(totalImplantacao)}</span>
              </div>
            </div>

            {/* Parcelamento */}
            {totalImplantacao > 0 && (() => {
              const taxaParc = parcelas > 1 ? taxaParcelamento : 0;
              const totalComTaxa = Math.round(totalImplantacao * (1 + taxaParc / 100));
              const valorParcela = Math.ceil(totalComTaxa / parcelas);
              const taxaReais = totalComTaxa - totalImplantacao;
              return (
                <div className="border border-gray-700 rounded-xl p-3 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Simulação de Parcelamento</p>
                    <div className="flex items-center gap-2">
                      {parcelas > 1 && taxaParcelamento === 0 && (
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                          Sem juros
                        </span>
                      )}
                      {parcelas > 1 && taxaParcelamento > 0 && (
                        <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
                          Taxa embutida
                        </span>
                      )}
                      <span className="text-xs text-gray-500">{parcelas}x</span>
                    </div>
                  </div>

                  {/* Slider de parcelas */}
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gray-600 w-14">Parcelas</span>
                    <input
                      type="range" min="1" max="12" step="1"
                      value={parcelas}
                      onChange={e => setParcelas(Number(e.target.value))}
                      className="flex-1 accent-amber-400 cursor-pointer"
                    />
                    <span className="text-xs font-bold text-gray-300 w-6 text-right">{parcelas}x</span>
                  </div>

                  {/* Slider de taxa */}
                  {parcelas > 1 && (
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs text-gray-600 w-14">Taxa op.</span>
                      <input
                        type="range" min="0" max="10" step="0.5"
                        value={taxaParcelamento}
                        onChange={e => setTaxaParcelamento(Number(e.target.value))}
                        className="flex-1 accent-blue-500 cursor-pointer"
                      />
                      <span className="text-xs font-bold text-gray-300 w-6 text-right">{taxaParcelamento}%</span>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    {parcelas === 1 ? (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">À vista</span>
                        <span className="font-bold text-amber-400">{fmt(totalImplantacao)}</span>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Implantação em {parcelas}x</span>
                          <span className="font-bold text-amber-400">{fmt(valorParcela)}/mês</span>
                        </div>
                        {taxaParcelamento > 0 && (
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600">Você recebe (líquido)</span>
                            <span className="text-gray-500">{fmt(totalImplantacao)} — taxa: {fmt(taxaReais)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Mensalidade recorrente</span>
                          <span className="text-gray-300">{fmt(totalMensalidade)}/mês</span>
                        </div>
                        <div className="border-t border-gray-700 pt-1.5 flex justify-between text-sm">
                          <span className="font-semibold text-gray-200">Total nos {parcelas} primeiros meses</span>
                          <span className="font-bold text-white">{fmt(valorParcela + totalMensalidade)}/mês</span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">Após {parcelas} meses: {fmt(totalMensalidade)}/mês</p>
                      </>
                    )}
                  </div>
                </div>
              );
            })()}

            <div className="mt-5 space-y-2">
              <button
                onClick={handleGerarPDF}
                disabled={gerando || totalItens === 0}
                className="btn-primary w-full justify-center"
              >
                <FileDown size={16} />
                {gerando ? 'Gerando PDF...' : 'Gerar Proposta PDF'}
              </button>
              <button
                onClick={handleSave}
                disabled={!cliente.nome || totalItens === 0}
                className="btn-secondary w-full justify-center"
              >
                {saved ? '✓ Salvo!' : 'Salvar Proposta'}
              </button>
            </div>

            {totalItens === 0 && (
              <p className="text-xs text-gray-600 text-center mt-3">Selecione ao menos um item</p>
            )}
          </div>

          <div className="card border-amber-500/20 bg-amber-500/5">
            <p className="text-xs font-semibold text-amber-500 mb-1">Fator de porte aplicado</p>
            <p className="text-3xl font-bold text-amber-400">×{mult.toFixed(1)}</p>
            <p className="text-xs text-amber-600 mt-1">{porteObj?.label}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
