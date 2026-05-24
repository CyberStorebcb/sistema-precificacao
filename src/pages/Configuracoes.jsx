import { useState } from 'react';
import { Plus, Trash2, Save, Building2, Package, DollarSign } from 'lucide-react';
import { DEFAULT_MODULES } from '../data/defaultData';

function fmt(v) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function Configuracoes({
  modules, addModule, updateModule, removeModule,
  valorHora, setValorHora,
  mensalidadeBase, setMensalidadeBase,
  empresa, setEmpresa,
}) {
  const [tab, setTab] = useState('empresa');
  const [novoMod, setNovoMod] = useState({ nome: '', mensalidade: '', implantacao: '', descricao: '' });
  const [saved, setSaved] = useState(false);

  function handleSaveEmpresa() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleAddModulo() {
    if (!novoMod.nome || !novoMod.mensalidade) return;
    addModule({
      nome: novoMod.nome,
      mensalidade: Number(novoMod.mensalidade),
      implantacao: Number(novoMod.implantacao || 0),
      descricao: novoMod.descricao,
    });
    setNovoMod({ nome: '', mensalidade: '', implantacao: '', descricao: '' });
  }

  function handleReset() {
    if (confirm('Redefinir módulos para os valores padrão? Isso vai sobrescrever todos os módulos.')) {
      DEFAULT_MODULES.forEach(m => {
        const exists = modules.find(x => x.id === m.id);
        if (!exists) addModule(m);
      });
    }
  }

  const TABS = [
    { id: 'empresa', label: 'Minha Empresa', icon: Building2 },
    { id: 'modulos', label: 'Módulos ERP', icon: Package },
    { id: 'precos', label: 'Valores Base', icon: DollarSign },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-100">Configurações</h1>
        <p className="text-gray-500 text-sm mt-1">Personalize o sistema com suas informações e tabela de preços</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-800">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
              tab === id
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab: Empresa */}
      {tab === 'empresa' && (
        <div className="card space-y-4 max-w-xl">
          <h2 className="font-bold text-gray-200">Dados da Sua Empresa</h2>
          <p className="text-sm text-gray-500">Estas informações aparecem no cabeçalho do PDF das propostas.</p>

          <div>
            <label className="label">Nome da Empresa</label>
            <input className="input" value={empresa.nome}
              onChange={e => setEmpresa({ ...empresa, nome: e.target.value })} />
          </div>
          <div>
            <label className="label">CNPJ</label>
            <input className="input" placeholder="00.000.000/0001-00" value={empresa.cnpj}
              onChange={e => setEmpresa({ ...empresa, cnpj: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Telefone</label>
              <input className="input" value={empresa.telefone}
                onChange={e => setEmpresa({ ...empresa, telefone: e.target.value })} />
            </div>
            <div>
              <label className="label">E-mail</label>
              <input className="input" value={empresa.email}
                onChange={e => setEmpresa({ ...empresa, email: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label">Site</label>
            <input className="input" placeholder="www.suaempresa.com.br" value={empresa.site}
              onChange={e => setEmpresa({ ...empresa, site: e.target.value })} />
          </div>
          <div>
            <label className="label">Cor principal da marca</label>
            <div className="flex items-center gap-3">
              <input type="color" value={empresa.cor}
                onChange={e => setEmpresa({ ...empresa, cor: e.target.value })}
                className="w-12 h-9 rounded border border-gray-700 cursor-pointer p-0.5 bg-gray-800"
              />
              <span className="text-sm text-gray-400 font-mono">{empresa.cor}</span>
              <span className="text-xs text-gray-600">Usada no PDF e cabeçalho</span>
            </div>
          </div>
          <button onClick={handleSaveEmpresa} className="btn-primary">
            <Save size={15} />
            {saved ? '✓ Salvo!' : 'Salvar dados'}
          </button>
        </div>
      )}

      {/* Tab: Módulos */}
      {tab === 'modulos' && (
        <div className="space-y-4">
          {/* Banner de referência */}
          <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl p-4 text-sm">
            <p className="font-semibold text-amber-400 mb-2">Referência de mercado — modelo SaaS/aluguel Brasil (2024-2025)</p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-amber-300/70">
              <span>Financeiro / Fluxo de Caixa: <strong className="text-amber-300">R$ 200 – R$ 500/mês</strong></span>
              <span>Fiscal / NF-e / SPED: <strong className="text-amber-300">R$ 300 – R$ 700/mês</strong></span>
              <span>Estoque / Compras / Vendas: <strong className="text-amber-300">R$ 150 – R$ 400/mês</strong></span>
              <span>RH / Folha de Pagamento: <strong className="text-amber-300">R$ 350 – R$ 800/mês</strong></span>
              <span>CRM / Dashboard / BI: <strong className="text-amber-300">R$ 150 – R$ 400/mês</strong></span>
              <span>IA / Robôs: <strong className="text-amber-300">R$ 250 – R$ 700/mês</strong></span>
            </div>
          </div>

          {/* Adicionar módulo */}
          <div className="card">
            <h2 className="font-bold text-gray-200 mb-4">Adicionar Módulo</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <label className="label">Nome do Módulo</label>
                <input className="input" placeholder="Ex: Ordem de Serviço" value={novoMod.nome}
                  onChange={e => setNovoMod({ ...novoMod, nome: e.target.value })} />
              </div>
              <div>
                <label className="label">Mensalidade (R$/mês)</label>
                <input className="input" type="number" placeholder="250" value={novoMod.mensalidade}
                  onChange={e => setNovoMod({ ...novoMod, mensalidade: e.target.value })} />
              </div>
              <div>
                <label className="label">Implantação (R$)</label>
                <input className="input" type="number" placeholder="1500" value={novoMod.implantacao}
                  onChange={e => setNovoMod({ ...novoMod, implantacao: e.target.value })} />
              </div>
              <div className="sm:col-span-4">
                <label className="label">Descrição (opcional)</label>
                <input className="input" placeholder="Breve descrição do módulo" value={novoMod.descricao}
                  onChange={e => setNovoMod({ ...novoMod, descricao: e.target.value })} />
              </div>
            </div>
            <button
              onClick={handleAddModulo}
              disabled={!novoMod.nome || !novoMod.mensalidade}
              className="btn-primary mt-3"
            >
              <Plus size={15} />
              Adicionar Módulo
            </button>
          </div>

          {/* Lista de módulos */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-200">{modules.length} Módulos Cadastrados</h2>
              <button onClick={handleReset} className="text-xs text-gray-600 hover:text-gray-400 underline cursor-pointer">
                Restaurar padrão
              </button>
            </div>
            <div className="space-y-2">
              {modules.map(m => (
                <div key={m.id} className="flex items-center gap-2 p-3 border border-gray-800 rounded-lg hover:bg-gray-800/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <input
                      className="input text-sm font-medium py-1"
                      value={m.nome}
                      onChange={e => updateModule(m.id, { nome: e.target.value })}
                    />
                  </div>
                  <div className="shrink-0 w-28">
                    <input
                      className="input text-sm text-right py-1"
                      type="number"
                      title="Mensalidade (R$/mês)"
                      placeholder="Mens."
                      value={m.mensalidade ?? m.preco ?? ''}
                      onChange={e => updateModule(m.id, { mensalidade: Number(e.target.value) })}
                    />
                    <p className="text-xs text-gray-600 text-right mt-0.5">/mês</p>
                  </div>
                  <div className="shrink-0 w-28">
                    <input
                      className="input text-sm text-right py-1"
                      type="number"
                      title="Implantação (R$)"
                      placeholder="Impl."
                      value={m.implantacao ?? ''}
                      onChange={e => updateModule(m.id, { implantacao: Number(e.target.value) })}
                    />
                    <p className="text-xs text-gray-600 text-right mt-0.5">impl.</p>
                  </div>
                  <button onClick={() => removeModule(m.id)} className="text-red-500 hover:text-red-400 shrink-0 cursor-pointer transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Valores base */}
      {tab === 'precos' && (
        <div className="space-y-5 max-w-lg">
          {/* Banner de referência de mercado */}
          <div className="bg-blue-500/8 border border-blue-500/20 rounded-xl p-4 text-sm">
            <p className="font-semibold text-blue-400 mb-2">Referência de mercado Brasil (2024-2025)</p>
            <ul className="text-blue-300/70 space-y-1">
              <li>• Hora técnica de implantação/treinamento: <strong className="text-blue-300">R$ 100 – R$ 250/h</strong></li>
              <li>• Suporte técnico mensal (adicional às mensalidades): <strong className="text-blue-300">R$ 300 – R$ 800/mês</strong></li>
              <li>• O suporte aqui é o contrato de SLA — atendimento prioritário, correções e atualizações</li>
            </ul>
          </div>

          <div className="card space-y-5">
            <h2 className="font-bold text-gray-200">Valores Base</h2>
            <p className="text-sm text-gray-500">
              Estes valores são usados no cálculo de todas as propostas.
              O multiplicador de porte é aplicado sobre os módulos e suporte.
            </p>

            <div>
              <label className="label">Valor da Hora de Implementação (R$)</label>
              <input
                className="input"
                type="number"
                value={valorHora}
                onChange={e => setValorHora(Number(e.target.value))}
              />
              <p className="text-xs text-gray-600 mt-1">
                Mercado: R$ 150/h (freelancer sênior) a R$ 450/h (empresa especializada). Sugerido: R$ 200–250/h
              </p>
            </div>

            <div>
              <label className="label">Mensalidade de Suporte Base — Pequena Empresa (R$)</label>
              <input
                className="input"
                type="number"
                value={mensalidadeBase}
                onChange={e => setMensalidadeBase(Number(e.target.value))}
              />
              <p className="text-xs text-gray-600 mt-1">
                O multiplicador de porte é aplicado sobre este valor. Mercado: R$ 800–R$ 1.500/mês para PME.
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-4 text-sm space-y-2">
              <p className="font-semibold text-gray-300 mb-2">Suporte com multiplicadores aplicados:</p>
              <div className="flex justify-between text-gray-400">
                <span>Pequena empresa (×1.0)</span>
                <strong className="text-gray-200">{fmt(mensalidadeBase)}/mês</strong>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Média empresa (×2.0)</span>
                <strong className="text-gray-200">{fmt(mensalidadeBase * 2.0)}/mês</strong>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Grande empresa (×4.0)</span>
                <strong className="text-gray-200">{fmt(mensalidadeBase * 4.0)}/mês</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
